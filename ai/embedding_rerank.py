"""
Tiện ích rerank dựa trên embedding cho pipeline huấn luyện gợi ý.

Mục tiêu: kết hợp điểm hành vi với độ tương đồng ngữ nghĩa (SentenceTransformer)
và độ phổ biến giúp cá nhân hoá sâu hơn, đồng thời giảm vấn đề cold-start so với
trước đây chỉ dùng heuristic/LLM fallback.
"""

from __future__ import annotations

from collections import OrderedDict
from dataclasses import dataclass
from typing import Dict, Iterable, List, Optional, Sequence, Tuple, Set

import numpy as np
from sentence_transformers import SentenceTransformer


DEFAULT_MODEL_NAME = "sentence-transformers/all-MiniLM-L12-v2"


def _render_book_text(meta: Dict) -> str:
    """
    Chuyển metadata sách thành chuỗi ngắn gọn phục vụ việc tạo embedding.
    Nếu thiếu nhãn thân thiện, sẽ fallback sang ID.
    """
    parts: List[str] = []
    title = (meta.get("title") or "").strip()
    if title:
        parts.append(title)

    category_id = meta.get("category_id")
    if category_id is not None:
        parts.append(f"Category {category_id}")

    author_id = meta.get("author_id")
    if author_id is not None:
        parts.append(f"Author {author_id}")

    publisher_id = meta.get("publisher_id")
    if publisher_id is not None:
        parts.append(f"Publisher {publisher_id}")

    return " | ".join(parts) or f"Book {meta.get('product_id')}"


@dataclass
class EmbeddingIndex:
    model_name: str = DEFAULT_MODEL_NAME
    batch_size: int = 64

    def __post_init__(self):
        self.model = SentenceTransformer(self.model_name)
        self.book_ids: List[int] = []
        self.embeddings: Optional[np.ndarray] = None
        self._id_to_idx: Dict[int, int] = {}

    def build(self, book_meta: Dict[int, Dict]) -> None:
        """Sinh vector embedding cho toàn bộ sách dựa trên metadata truyền vào."""
        if not book_meta:
            self.book_ids = []
            self.embeddings = None
            self._id_to_idx = {}
            return

        texts: List[str] = []
        book_ids: List[int] = []
        for pid, meta in book_meta.items():
            try:
                pid_int = int(pid)
            except (TypeError, ValueError):
                continue
            book_ids.append(pid_int)
            texts.append(_render_book_text({**meta, "product_id": pid_int}))

        if not book_ids:
            self.book_ids = []
            self.embeddings = None
            self._id_to_idx = {}
            return

        embeddings = self.model.encode(
            texts,
            batch_size=self.batch_size,
            convert_to_numpy=True,
            normalize_embeddings=True,
            show_progress_bar=len(texts) >= self.batch_size,
        )

        self.book_ids = book_ids
        self.embeddings = embeddings
        self._id_to_idx = {pid: idx for idx, pid in enumerate(book_ids)}

    def get_vector(self, product_id: int) -> Optional[np.ndarray]:
        """Lấy embedding của một sách theo product_id (nếu đã được build)."""
        if self.embeddings is None:
            return None
        idx = self._id_to_idx.get(int(product_id))
        if idx is None:
            return None
        return self.embeddings[idx]

    def user_vector(self, score_map: Dict[str, float]) -> Optional[np.ndarray]:
        """
        Tạo vector đại diện người dùng bằng cách trung bình có trọng số các sách đã
        tương tác (dựa trên điểm hành vi).
        """
        if not score_map or self.embeddings is None:
            return None

        aggregate = np.zeros(self.embeddings.shape[1], dtype=np.float32)
        weight_sum = 0.0

        for book_id_str, score in score_map.items():
            try:
                pid = int(book_id_str)
            except (TypeError, ValueError):
                continue
            vec = self.get_vector(pid)
            if vec is None:
                continue
            weight = float(score)
            if not np.isfinite(weight) or weight <= 0:
                continue
            aggregate += weight * vec
            weight_sum += weight

        if weight_sum <= 0 or not np.any(aggregate):
            return None

        norm = np.linalg.norm(aggregate)
        if norm == 0:
            return None
        return aggregate / norm

    def query_similar(
        self,
        vector: np.ndarray,
        top_n: int,
        exclude_ids: Optional[Set[int]] = None,
    ) -> List[Tuple[int, float]]:
        """
        Tìm danh sách sách tương tự nhất theo cosine similarity.
        Có thể loại bỏ trước các ID đã xuất hiện để tránh trùng.
        """
        if self.embeddings is None or vector is None:
            return []
        exclude_ids = exclude_ids or set()

        sims = self.embeddings @ vector
        if top_n >= len(sims):
            candidate_indices = np.argsort(sims)[::-1]
        else:
            candidate_indices = np.argpartition(sims, -top_n)[-top_n:]
            candidate_indices = candidate_indices[np.argsort(sims[candidate_indices])[::-1]]

        results: List[Tuple[int, float]] = []
        for idx in candidate_indices:
            pid = self.book_ids[idx]
            if pid in exclude_ids:
                continue
            results.append((pid, float(sims[idx])))
            if len(results) >= top_n:
                break
        return results


def normalize_popularity(raw_popularity: Dict[int, float]) -> Dict[int, float]:
    """Chuẩn hoá điểm phổ biến về [0,1] bằng min-max đơn giản."""
    if not raw_popularity:
        return {}
    values = [max(float(v), 0.0) for v in raw_popularity.values() if np.isfinite(v)]
    if not values:
        return {}
    max_value = max(values)
    if max_value <= 0:
        return {int(k): 0.0 for k in raw_popularity.keys()}
    return {int(k): float(v) / max_value for k, v in raw_popularity.items()}


def rerank_profiles_with_embeddings(
    profiles: Dict[str, Dict[str, float]],
    *,
    book_meta: Dict[int, Dict],
    book_popularity: Dict[int, float],
    top_k: int,
    weights: Optional[Dict[str, float]] = None,
    model_name: str = DEFAULT_MODEL_NAME,
    neighbor_multi: float = 1.5,
) -> Dict[str, OrderedDict]:
    """
    Áp dụng rerank: mở rộng tập ứng viên bằng sách tương tự rồi tính điểm tổng hợp
    giữa hành vi, embedding và độ phổ biến.
    """
    if not profiles:
        return {}

    index = EmbeddingIndex(model_name=model_name)
    index.build(book_meta)

    if index.embeddings is None or not index.book_ids:
        # No embeddings available -> return original profiles unchanged
        return {key: OrderedDict(score_map) for key, score_map in profiles.items()}

    weights = weights or {"behavior": 0.6, "embedding": 0.3, "popularity": 0.1}
    w_behavior = float(weights.get("behavior", 0.0))
    w_embedding = float(weights.get("embedding", 0.0))
    w_popularity = float(weights.get("popularity", 0.0))

    pop_normalized = normalize_popularity(book_popularity)
    result: Dict[str, OrderedDict] = {}

    neighbor_limit = max(top_k, int(top_k * neighbor_multi))

    for profile_key, score_map in profiles.items():
        candidate_scores: Dict[str, float] = dict(score_map)
        try:
            user_vec = index.user_vector(score_map)
        except Exception:
            user_vec = None

        exclude_ids: Set[int] = set()
        for pid_str in candidate_scores.keys():
            try:
                exclude_ids.add(int(pid_str))
            except (TypeError, ValueError):
                continue

        if user_vec is not None:
            similar_items = index.query_similar(user_vec, neighbor_limit, exclude_ids=exclude_ids)
            for pid, sim in similar_items:
                candidate_scores.setdefault(str(pid), 0.0)
        else:
            similar_items = []

        if not candidate_scores:
            result[profile_key] = OrderedDict()
            continue

        behavior_values = [float(v) for v in candidate_scores.values() if np.isfinite(v)]
        max_behavior = max(behavior_values) if behavior_values else 0.0

        ranked_items: List[Tuple[str, float]] = []

        for pid_str, base_score in candidate_scores.items():
            try:
                pid = int(pid_str)
            except (TypeError, ValueError):
                continue

            norm_behavior = (
                float(base_score) / max_behavior if max_behavior > 0 else 0.0
            )

            embed_vec = index.get_vector(pid)
            if user_vec is not None and embed_vec is not None:
                similarity = float(np.clip(np.dot(user_vec, embed_vec), -1.0, 1.0))
                norm_embed = (similarity + 1.0) / 2.0
            else:
                norm_embed = 0.0

            norm_pop = pop_normalized.get(pid, 0.0)

            final_score = (
                w_behavior * norm_behavior
                + w_embedding * norm_embed
                + w_popularity * norm_pop
            )

            ranked_items.append((pid_str, final_score))

        ranked_items.sort(key=lambda item: item[1], reverse=True)

        ordered = OrderedDict()
        for pid_str, _final in ranked_items[:top_k]:
            base_value = candidate_scores.get(pid_str, 0.0)
            ordered[pid_str] = float(base_value)

        result[profile_key] = ordered

    return result


def aggregate_book_popularity(raw_scores: Dict[str, Dict[str, float]]) -> Dict[int, float]:
    """
    Tính độ phổ biến toàn cục cho từng sách bằng cách cộng toàn bộ điểm hành vi
    trên mọi profile.
    """
    popularity: Dict[int, float] = {}
    for score_map in raw_scores.values():
        for book_id_str, score in score_map.items():
            try:
                pid = int(book_id_str)
            except (TypeError, ValueError):
                continue
            popularity[pid] = popularity.get(pid, 0.0) + float(score)
    return popularity


__all__ = [
    "EmbeddingIndex",
    "rerank_profiles_with_embeddings",
    "aggregate_book_popularity",
    "normalize_popularity",
    "DEFAULT_MODEL_NAME",
]

