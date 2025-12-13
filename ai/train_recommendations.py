"""

1. Đọc các sự kiện phản hồi (view/click/add_to_cart/purchase/...) từ collection
   `recommendation_feedbacks` do backend ghi nhận khi người dùng tương tác.
2. Tính điểm tích luỹ cho từng sách theo từng profile (user:<id> hoặc session ẩn danh).
3. Lọc/xếp hạng -> lưu lại vào hai collection:
     - `profiles`: lưu map điểm để tiện phân tích.
     - `recommendations`: lưu danh sách sản phẩm đề xuất cho BE/FE sử dụng.
4. Xuất báo cáo dạng JSON (stdout + file) để backend đọc và hiển thị log.
"""

from __future__ import annotations

import argparse
import json
from collections import Counter, defaultdict, OrderedDict
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Tuple

import os

import importlib

MongoClient: Any
try:
    MongoClient = importlib.import_module("pymongo").MongoClient
except ImportError as _pymongo_exc:  # pragma: no cover
    MongoClient = None  # type: ignore[assignment]
    _PYMONGO_IMPORT_ERROR = _pymongo_exc
else:
    _PYMONGO_IMPORT_ERROR = None

from embedding_rerank import (
    DEFAULT_MODEL_NAME as EMBEDDING_MODEL_NAME,
    aggregate_book_popularity,
    rerank_profiles_with_embeddings,
)

# Các giá trị mặc định (có thể override bằng tham số CLI)
DEFAULT_MONGO_URI = "mongodb://localhost:27017/customer_tracking"
DEFAULT_DB_NAME = "customer_tracking"
DEFAULT_EVENTS_COLLECTION = "recommendation_feedbacks"
DEFAULT_PROFILES_COLLECTION = "profiles"
DEFAULT_RECOMMENDATIONS_COLLECTION = "recommendations"

# Trọng số mặc định cho điểm hành vi / embedding / độ phổ biến khi rerank
EMBEDDING_RERANK_WEIGHTS = {"behavior": 0.6, "embedding": 0.3, "popularity": 0.1}

# Thang điểm rút gọn nếu sự kiện không có finalScore/value riêng
EVENT_WEIGHTS = {
    "view_detail": 0.5,
    "recommendation_click": 2.0,
    "add_to_cart": 4.0,
    "purchase": 6.0,
    "like": 3.0,
    "dislike": -2.0,
    "impression": 0.25,
}


def now_utc() -> datetime:
    """Lấy thời gian hiện tại (UTC)."""
    return datetime.now(timezone.utc)


def parse_args() -> argparse.Namespace:
    """Đọc tham số dòng lệnh và trả về Namespace."""
    parser = argparse.ArgumentParser(description="Huấn luyện gợi ý cá nhân hoá từ MongoDB.")
    parser.add_argument("--mongo-uri", default=DEFAULT_MONGO_URI, help="Chuỗi kết nối MongoDB.")
    parser.add_argument("--mongo-db", default=DEFAULT_DB_NAME, help="Tên database MongoDB.")
    parser.add_argument(
        "--events-collection",
        default=DEFAULT_EVENTS_COLLECTION,
        help="Collection lưu các sự kiện phản hồi (feedback).",
    )
    parser.add_argument(
        "--profiles-collection",
        default=DEFAULT_PROFILES_COLLECTION,
        help="Collection lưu map điểm của từng profile.",
    )
    parser.add_argument(
        "--recommendations-collection",
        default=DEFAULT_RECOMMENDATIONS_COLLECTION,
        help="Collection lưu danh sách sản phẩm gợi ý.",
    )
    parser.add_argument(
        "--history-days",
        type=int,
        default=90,
        help="Chỉ lấy sự kiện trong N ngày gần nhất (0 = không giới hạn).",
    )
    parser.add_argument(
        "--min-score",
        type=float,
        default=0.2,
        help="Ngưỡng điểm tối thiểu để giữ lại một sản phẩm trong profile.",
    )
    parser.add_argument(
        "--top-k",
        type=int,
        default=25,
        help="Số lượng sản phẩm tối đa trong danh sách recommendation.",
    )
    parser.add_argument(
        "--max-profiles",
        type=int,
        default=0,
        help="Giới hạn số profile xử lý (0 = tất cả, hữu ích khi debug).",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Chỉ tính toán, không ghi kết quả vào MongoDB.",
    )
    parser.add_argument(
        "--report-json",
        default=None,
        help="Đường dẫn file JSON để ghi lại báo cáo huấn luyện.",
    )
    parser.add_argument(
        "--book-meta-json",
        default=None,
        help="(Tuỳ chọn) file JSON chứa metadata sách (category/author/publisher) để LLM ưu tiên sách liên quan.",
    )
    return parser.parse_args()


def normalize_key(event: Dict) -> str | None:
    """
    Chuẩn hoá khóa profile:
      - Nếu có userId (đã đăng nhập) => 'user:<id>'
      - Nếu không => dùng sessionId (ẩn danh)
    """
    user_id = event.get("userId")
    if user_id not in (None, "", "null"):
        return f"user:{user_id}"
    session_id = event.get("sessionId")
    if session_id:
        return str(session_id)
    return None


def event_score(event: Dict) -> float:
    """
    Xác định điểm của sự kiện:
      1. Ưu tiên dùng finalScore (nếu BE đã tính sẵn, ví dụ decay theo thời gian)
      2. Nếu có value riêng, dùng value
      3. Nếu không, fallback sang bảng EVENT_WEIGHTS
    """
    if event.get("finalScore") is not None:
        return float(event["finalScore"])
    if event.get("value") is not None:
        return float(event["value"])
    etype = event.get("eventType")
    if etype in EVENT_WEIGHTS:
        return EVENT_WEIGHTS[etype]
    return 1.0


def iter_events(collection, history_days: int) -> Iterable[Dict]:
    """Iterator trả về các sự kiện phù hợp với khoảng thời gian yêu cầu."""
    query = {}
    if history_days > 0:
        since = now_utc() - timedelta(days=history_days)
        query["occurredAt"] = {"$gte": since}

    projection = {
        "_id": 0,
        "userId": 1,
        "sessionId": 1,
        "bookId": 1,
        "eventType": 1,
        "finalScore": 1,
        "value": 1,
        "occurredAt": 1,
    }
    return collection.find(query, projection)


def aggregate_profiles(events: Iterable[Dict]) -> Tuple[Dict[str, Dict[str, float]], Dict[str, Dict]]:
    """
    Gom điểm theo profile.
    Trả về:
      - raw_scores: map {profile_key: {book_id: score}}
      - metadata: lưu thông tin bổ sung (số sự kiện, breakdown...) để ghi báo cáo
    """
    raw_scores: Dict[str, Dict[str, float]] = defaultdict(lambda: defaultdict(float))
    metadata: Dict[str, Dict] = {}

    for event in events:
        profile_key = normalize_key(event)
        if not profile_key:
            continue

        book_id = event.get("bookId")
        if book_id is None:
            continue

        try:
            book_id_str = str(int(book_id))
        except (TypeError, ValueError):
            continue

        score = event_score(event)
        raw_scores[profile_key][book_id_str] += score

        meta = metadata.setdefault(
            profile_key,
            {
                "eventCount": 0,
                "eventTypes": Counter(),
                "lastEventAt": None,
            },
        )
        meta["eventCount"] += 1
        meta["eventTypes"][event.get("eventType") or "unknown"] += 1
        occurred_at = event.get("occurredAt")
        if isinstance(occurred_at, datetime):
            if meta["lastEventAt"] is None or occurred_at > meta["lastEventAt"]:
                meta["lastEventAt"] = occurred_at

    return raw_scores, metadata


def prune_profiles(
    raw_scores: Dict[str, Dict[str, float]],
    metadata: Dict[str, Dict],
    min_score: float,
    top_k: int,
    max_profiles: int,
) -> Tuple[Dict[str, Dict[str, float]], Dict[str, Dict]]:
    """
    Lọc/Xếp hạng:
      - Bỏ sách có tổng điểm < min_score
      - Giữ tối đa top_k sách theo profile
      - Giới hạn số profile xử lý nếu max_profiles > 0
    """
    ordered_keys = sorted(
        raw_scores.keys(),
        key=lambda key: metadata[key]["eventCount"],
        reverse=True,
    )
    if max_profiles > 0:
        ordered_keys = ordered_keys[:max_profiles]

    filtered_scores: Dict[str, Dict[str, float]] = {}
    filtered_meta: Dict[str, Dict] = {}

    for key in ordered_keys:
        pairs = [
            (book_id, float(score))
            for book_id, score in raw_scores[key].items()
            if score >= min_score
        ]
        if not pairs:
            continue

        pairs.sort(key=lambda item: item[1], reverse=True)
        if top_k > 0:
            pairs = pairs[:top_k]

        filtered_scores[key] = OrderedDict(pairs)
        filtered_meta[key] = metadata[key]

    return filtered_scores, filtered_meta


def load_book_metadata(path: str | None) -> Dict[int, Dict]:
    """
    Đọc metadata sách do backend truyền xuống (JSON).
    Metadata sẽ giúp LLM/heuristic hiểu sách thuộc category/tác giả/nhà xuất bản nào.
    """
    if not path:
        return {}
    meta_path = Path(path)
    if not meta_path.exists():
        print(f"[Recommender] Không tìm thấy file metadata: {meta_path}")
        return {}
    data = json.loads(meta_path.read_text(encoding="utf-8"))
    book_map: Dict[int, Dict] = {}
    for item in data:
        try:
            pid = int(item.get("product_id"))
        except (TypeError, ValueError):
            continue
        book_map[pid] = {
            "title": item.get("title"),
            "category_id": item.get("category_id"),
            "author_id": item.get("author_id"),
            "publisher_id": item.get("publisher_id"),
            "price": float(item.get("price") or 0),
            "stock": float(item.get("stock") or 0),
        }
    return book_map


class _HybridLLMClient:
    """
    Lightweight LLM wrapper that prefers OpenAI but can fall back to Gemini.
    """

    def __init__(self):
        self.provider: Optional[str] = None
        self.model_name: Optional[str] = None
        self.client: Any = None

        openai_key = os.getenv("OPENAI_API_KEY") or os.getenv("LLM_API_KEY")
        if openai_key:
            self._init_openai()
            if self.is_available():
                return

        gemini_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
        if gemini_key:
            self._init_gemini(gemini_key)

    def _init_openai(self) -> None:
        try:
            OpenAI = getattr(importlib.import_module("openai"), "OpenAI")  # type: ignore[attr-defined]
        except (ImportError, AttributeError):
            return
        self.client = OpenAI()
        self.model_name = (
            os.getenv("LLM_MODEL")
            or os.getenv("OPENAI_LLM_MODEL")
            or "gpt-4.1-mini"
        )
        self.provider = "openai"

    def _init_gemini(self, api_key: str) -> None:
        try:
            genai = importlib.import_module("google.generativeai")
        except ImportError:
            return
        genai.configure(api_key=api_key)
        self.model_name = (
            os.getenv("LLM_MODEL")
            or os.getenv("GEMINI_LLM_MODEL")
            or "gemini-1.5-flash"
        )
        self.client = genai.GenerativeModel(self.model_name)
        self.provider = "gemini"

    def is_available(self) -> bool:
        return self.client is not None and self.provider is not None

    def describe(self) -> str:
        if not self.is_available():
            return "offline"
        return f"{self.provider}:{self.model_name}"

    def generate(self, prompt: str, temperature: float = 0.1, max_tokens: int = 400) -> str:
        if not self.is_available():
            raise RuntimeError("LLM backend not initialized.")

        if self.provider == "openai":
            response = self.client.chat.completions.create(
                model=self.model_name,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=max_tokens,
                temperature=temperature,
            )
            return response.choices[0].message.content.strip()

        if self.provider == "gemini":
            generation_config = {
                "temperature": temperature,
                "max_output_tokens": max_tokens,
            }
            response = self.client.generate_content(prompt, generation_config=generation_config)
            text = getattr(response, "text", None)
            if text:
                return text.strip()
            candidates = getattr(response, "candidates", None)
            if candidates:
                parts = getattr(candidates[0], "content", None)
                if parts and getattr(parts, "parts", None):
                    snippets = [
                        getattr(part, "text", "")
                        for part in parts.parts
                        if getattr(part, "text", "")
                    ]
                    combined = "\n".join(snippets).strip()
                    if combined:
                        return combined
            raise RuntimeError("Gemini response is empty.")

        raise ValueError(f"Unsupported LLM provider: {self.provider}")


class HybridLLMReranker:
    """
    Hybrid reranker: deterministic heuristics with optional LLM ranking.
    """

    def __init__(self):
        self.llm = _HybridLLMClient()
        self.mode = "llm" if self.llm.is_available() else "heuristic"
        if self.mode == "llm":
            print(f"[LLMReranker] Đang dùng LLM {self.llm.describe()} để rerank.")

    @staticmethod
    def _heuristic_score(candidate: Dict) -> float:
        base = float(candidate.get("base_score", 0))
        score = base
        if candidate.get("same_category"):
            score += 1.0
        if candidate.get("same_author"):
            score += 0.6
        if candidate.get("same_publisher"):
            score += 0.4
        return score

    @staticmethod
    def _extract_json_block(text: str) -> str:
        cleaned = text.strip()
        if "```" in cleaned:
            for segment in cleaned.split("```"):
                segment = segment.strip()
                if segment.startswith("{"):
                    cleaned = segment
                    break
        start = cleaned.find("{")
        end = cleaned.rfind("}")
        if start != -1 and end != -1 and end > start:
            return cleaned[start : end + 1]
        return cleaned

    def _prompt_llm(self, profile_key: str, candidates: List[Dict]) -> List[int]:
        candidate_lines = []
        for item in candidates:
            reasons = []
            if item.get("same_category"):
                reasons.append("cùng danh mục")
            if item.get("same_author"):
                reasons.append("cùng tác giả")
            if item.get("same_publisher"):
                reasons.append("cùng nhà xuất bản")
            if not reasons:
                reasons.append("điểm tương tác cao")
            reason = ", ".join(reasons)
            candidate_lines.append(
                f"- ID {item['product_id']} | Điểm cơ bản {item['base_score']:.2f} | {reason} | Tên: {item.get('title','(không rõ)')}"
            )

        prompt = (
            "Bạn là hệ thống gợi ý sách cá nhân hoá. "
            "Sắp xếp danh sách dưới đây theo độ ưu tiên cao nhất cho người dùng, "
            "ưu tiên điểm cơ bản và các sách trùng danh mục/tác giả/nhà xuất bản. "
            "Chỉ trả về JSON thuần dạng {\"ranking\": [id_theo_thu_tu]}.\n\n"
            f"Hồ sơ: {profile_key}\n"
            "Ứng viên:\n"
            + "\n".join(candidate_lines)
        )

        try:
            raw = self.llm.generate(prompt, temperature=0.15, max_tokens=600)
            payload = self._extract_json_block(raw)
            data = json.loads(payload)
            ranking = data.get("ranking")
            if isinstance(ranking, list):
                cleaned: List[int] = []
                for item in ranking:
                    try:
                        cleaned.append(int(float(item)))
                    except (TypeError, ValueError):
                        continue
                if cleaned:
                    return cleaned
        except Exception as exc:
            print(f"[LLMReranker] LLM lỗi ({exc}), fallback heuristic.")
        return []

    def rerank(self, profile_key: str, candidates: List[Dict]) -> List[int]:
        if self.mode == "llm":
            ranking = self._prompt_llm(profile_key, candidates)
            if ranking:
                return ranking
        sorted_candidates = sorted(
            candidates,
            key=lambda item: self._heuristic_score(item),
            reverse=True,
        )
        return [item["product_id"] for item in sorted_candidates]


def build_similarity_index(book_meta: Dict[int, Dict]) -> Dict[str, Dict[int, List[int]]]:
    """
    Tạo inverted index để nhanh chóng tìm các sách chung category/author/publisher.
    """
    index = {
        "category": defaultdict(list),
        "author": defaultdict(list),
        "publisher": defaultdict(list),
    }
    for pid, meta in book_meta.items():
        if meta.get("category_id") is not None:
            index["category"][meta["category_id"]].append(pid)
        if meta.get("author_id") is not None:
            index["author"][meta["author_id"]].append(pid)
        if meta.get("publisher_id") is not None:
            index["publisher"][meta["publisher_id"]].append(pid)
    return index


def apply_llm_rerank(
    profiles: Dict[str, OrderedDict],
    book_meta: Dict[int, Dict],
    top_k: int,
) -> Dict[str, OrderedDict]:
    """
    Áp dụng LLM/heuristic để tái xếp hạng:
      - Giữ ưu tiên các sách có điểm cao.
      - Bổ sung các sách chung danh mục/tác giả/NXB với sách anchor.
    """
    if not book_meta:
        return profiles

    index = build_similarity_index(book_meta)
    reranker = HybridLLMReranker()
    result: Dict[str, OrderedDict] = {}

    for profile_key, score_map in profiles.items():
        anchors = list(score_map.items())[:3]
        candidate_details: Dict[int, Dict] = {}

        # Bản thân các sách đã có điểm -> mặc định same_category=True để giữ nguyên thứ hạng
        for product_id_str, base_score in score_map.items():
            pid = int(product_id_str)
            meta = book_meta.get(pid, {})
            candidate_details[pid] = {
                "product_id": pid,
                "title": meta.get("title"),
                "base_score": base_score,
                "same_category": True,
                "same_author": False,
                "same_publisher": False,
            }

        for anchor_product_id, anchor_score in anchors:
            anchor_pid = int(anchor_product_id)
            anchor_meta = book_meta.get(anchor_pid, {})
            related_ids = set()
            if anchor_meta.get("category_id") is not None:
                related_ids.update(index["category"][anchor_meta["category_id"]])
            if anchor_meta.get("author_id") is not None:
                related_ids.update(index["author"][anchor_meta["author_id"]])
            if anchor_meta.get("publisher_id") is not None:
                related_ids.update(index["publisher"][anchor_meta["publisher_id"]])

            for related_pid in related_ids:
                if related_pid == anchor_pid:
                    continue
                meta = book_meta.get(related_pid, {})
                entry = candidate_details.setdefault(
                    related_pid,
                    {
                        "product_id": related_pid,
                        "title": meta.get("title"),
                        "base_score": 0.0,
                        "same_category": False,
                        "same_author": False,
                        "same_publisher": False,
                    },
                )

                if meta.get("category_id") == anchor_meta.get("category_id"):
                    entry["same_category"] = True
                if meta.get("author_id") == anchor_meta.get("author_id"):
                    entry["same_author"] = True
                if meta.get("publisher_id") == anchor_meta.get("publisher_id"):
                    entry["same_publisher"] = True

                # Điểm cộng nhẹ để các sách liên quan có cơ hội lọt top (tỷ lệ 0.6 so với anchor)
                entry["base_score"] = max(entry["base_score"], anchor_score * 0.6)

        candidate_list = list(candidate_details.values())
        ranked_ids = reranker.rerank(profile_key, candidate_list)

        ordered = OrderedDict()
        for pid in ranked_ids:
            if len(ordered) >= top_k:
                break
            entry = candidate_details.get(pid)
            if not entry:
                continue
            ordered[str(pid)] = float(entry.get("base_score", 0.0))

        result[profile_key] = ordered

    return result


def persist_results(
    *,
    profiles_coll,
    recommendations_coll,
    profiles: Dict[str, Dict[str, float]],
    metadata: Dict[str, Dict],
    history_days: int,
    min_score: float,
    top_k: int,
) -> Tuple[int, int]:
    """
    Lưu kết quả vào MongoDB:
      - Collection `profiles`: lưu lại điểm, breakdown để phục vụ phân tích.
      - Collection `recommendations`: lưu danh sách gợi ý cuối cùng.
    """
    updated_profiles = 0
    updated_recommendations = 0
    now = now_utc()

    for key, score_map in profiles.items():
        meta = metadata.get(key, {})
        event_breakdown = {etype: int(count) for etype, count in meta.get("eventTypes", {}).items()}
        total_score = float(sum(score_map.values()))

        profiles_coll.update_one(
            {"key": key},
            {
                "$set": {
                    "key": key,
                    "scores": score_map,
                    "totalScore": total_score,
                    "eventBreakdown": event_breakdown,
                    "eventCount": int(meta.get("eventCount", 0)),
                    "lastEventAt": meta.get("lastEventAt"),
                    "historyDays": history_days,
                    "minScore": min_score,
                    "topK": top_k,
                    "updatedAt": now,
                },
                "$setOnInsert": {"createdAt": now},
            },
            upsert=True,
        )
        updated_profiles += 1

        product_ids = [int(book_id) for book_id in score_map.keys()]
        recommendations_coll.update_one(
            {"key": key},
            {
                "$set": {
                    "key": key,
                    "recommendations": {
                        "product_ids": product_ids,
                        "generatedAt": now,
                        "topK": top_k,
                        "totalCandidates": len(product_ids),
                        "modelVersion": "profile_score_v1",
                    },
                    "metadata": {
                        "historyDays": history_days,
                        "eventBreakdown": event_breakdown,
                        "scoreSum": total_score,
                        "minScore": min_score,
                    },
                    "updatedAt": now,
                },
                "$setOnInsert": {"createdAt": now},
            },
            upsert=True,
        )
        updated_recommendations += 1

    return updated_profiles, updated_recommendations


def serialize_datetime(value):
    """Tiện ích chuyển datetime -> chuỗi ISO8601."""
    if isinstance(value, datetime):
        if value.tzinfo is None:
            value = value.replace(tzinfo=timezone.utc)
        return value.isoformat()
    return value


def main():
    args = parse_args()

    if MongoClient is None:
        raise ImportError(
            "pymongo is required to run train_recommendations.py. Please install pymongo."
        ) from _PYMONGO_IMPORT_ERROR

    client = MongoClient(args.mongo_uri)
    db = client[args.mongo_db]
    events_coll = db[args.events_collection]
    profiles_coll = db[args.profiles_collection]
    recs_coll = db[args.recommendations_collection]

    events_cursor = iter_events(events_coll, args.history_days)
    raw_scores, metadata = aggregate_profiles(events_cursor)
    # Tính tổng điểm để dùng làm thước đo độ phổ biến toàn cục cho từng sách
    book_popularity_totals = aggregate_book_popularity(raw_scores)

    pruned_scores, pruned_meta = prune_profiles(
        raw_scores,
        metadata,
        min_score=args.min_score,
        top_k=args.top_k,
        max_profiles=args.max_profiles,
    )

    book_meta = load_book_metadata(args.book_meta_json)
    embedding_rerank_applied = False
    if book_meta:
        # Bước 1: rerank bằng embedding + độ phổ biến nhằm mở rộng và sắp xếp lại ứng viên
        pruned_scores = rerank_profiles_with_embeddings(
            pruned_scores,
            book_meta=book_meta,
            book_popularity=book_popularity_totals,
            top_k=args.top_k,
            weights=EMBEDDING_RERANK_WEIGHTS,
            model_name=EMBEDDING_MODEL_NAME,
        )
        embedding_rerank_applied = True
        # Bước 2: vẫn cho phép LLM/heuristic nâng cao danh sách cuối cùng nếu được cấu hình
        pruned_scores = apply_llm_rerank(pruned_scores, book_meta, top_k=args.top_k)

    if args.dry_run:
        updated_profiles = len(pruned_scores)
        updated_recommendations = len(pruned_scores)
    else:
        updated_profiles, updated_recommendations = persist_results(
            profiles_coll=profiles_coll,
            recommendations_coll=recs_coll,
            profiles=pruned_scores,
            metadata=pruned_meta,
            history_days=args.history_days,
            min_score=args.min_score,
            top_k=args.top_k,
        )

    summary = {
        "generatedAt": serialize_datetime(now_utc()),
        "historyDays": args.history_days,
        "minScore": args.min_score,
        "topK": args.top_k,
        "profilesProcessed": len(pruned_scores),
        "profilesUpdated": updated_profiles,
        "recommendationsUpdated": updated_recommendations,
        "dryRun": args.dry_run,
        "bookMetaIncluded": bool(book_meta),
        "embeddingRerankEnabled": embedding_rerank_applied,
        "embeddingModel": EMBEDDING_MODEL_NAME if embedding_rerank_applied else None,
        "embeddingWeights": EMBEDDING_RERANK_WEIGHTS if embedding_rerank_applied else None,
    }

    print(json.dumps(summary, ensure_ascii=False))

    if args.report_json:
        Path(args.report_json).parent.mkdir(parents=True, exist_ok=True)
        with open(args.report_json, "w", encoding="utf-8") as handle:
            json.dump(summary, handle, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()


