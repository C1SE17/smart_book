"""Parallel corpus management and retrieval for bookstore translation."""

from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, List, Sequence, Tuple

import difflib

try:
    import numpy as np
except ImportError:  # pragma: no cover - optional dependency
    np = None

try:
    from sentence_transformers import SentenceTransformer
except ImportError:  # pragma: no cover - optional dependency
    SentenceTransformer = None

from .constants import TranslationDirection, normalize_text

try:
    import faiss  # type: ignore

    FAISS_AVAILABLE = True
except ImportError:  # pragma: no cover - optional dependency
    faiss = None
    FAISS_AVAILABLE = False


@dataclass(frozen=True)
class ParallelSentence:
    """Representation of a bilingual sentence pair."""

    en: str
    vi: str


class _FaissIndex:
    """Thin wrapper around FAISS inner-product index with L2-normalization."""

    def __init__(self, dim: int):
        self.index = faiss.IndexFlatIP(dim)

    def add(self, vectors: np.ndarray) -> None:
        faiss.normalize_L2(vectors)
        self.index.add(vectors)

    def search(self, query: np.ndarray, top_k: int) -> Tuple[np.ndarray, np.ndarray]:
        faiss.normalize_L2(query)
        return self.index.search(query, top_k)


class _NumpyIndex:
    """Fallback exact-search index implemented with NumPy."""

    def __init__(self, vectors: np.ndarray):
        self.vectors = self._normalize(vectors)

    def _normalize(self, matrix: np.ndarray) -> np.ndarray:
        norms = np.linalg.norm(matrix, axis=1, keepdims=True)
        norms[norms == 0] = 1.0
        return matrix / norms

    def search(self, query: np.ndarray, top_k: int) -> Tuple[np.ndarray, np.ndarray]:
        query = self._normalize(query)
        scores = np.matmul(self.vectors, query.T).squeeze()
        if top_k >= len(scores):
            top_indices = np.argsort(scores)[::-1]
        else:
            top_indices = np.argpartition(scores, -top_k)[-top_k:]
            top_indices = top_indices[np.argsort(scores[top_indices])[::-1]]
        return scores[top_indices], top_indices


class BookParallelCorpus:
    """Loads a bilingual corpus of book content and builds retrieval indexes."""

    def __init__(
        self,
        sentences: Sequence[ParallelSentence],
        embedding_model_name: str,
        device: str | None = None,
    ):
        if not sentences:
            raise ValueError("Parallel corpus cannot be empty.")
        self.sentences = list(sentences)
        self._use_embeddings = SentenceTransformer is not None and np is not None
        self.embedder = None
        if self._use_embeddings:
            self.embedder = SentenceTransformer(embedding_model_name, device=device)
            self._build_indexes()
        else:
            self.en_embeddings = None
            self.vi_embeddings = None
            self.en_index = None
            self.vi_index = None

    @classmethod
    def from_path(
        cls,
        path: str | Path,
        embedding_model_name: str,
        device: str | None = None,
    ) -> "BookParallelCorpus":
        path = Path(path)
        with path.open("r", encoding="utf-8") as handle:
            payload = json.load(handle)

        sentences: List[ParallelSentence] = []
        def _normalize_pair(raw_en, raw_vi) -> ParallelSentence | None:
            en = normalize_text(raw_en) if raw_en else None
            vi = normalize_text(raw_vi) if raw_vi else None
            if not en and vi:
                en = vi
            if not vi and en:
                vi = en
            if en and vi:
                return ParallelSentence(en=en, vi=vi)
            return None

        if isinstance(payload, list):
            for item in payload:
                if not isinstance(item, dict):
                    continue
                candidate = _normalize_pair(item.get("en") or item.get("english"), item.get("vi") or item.get("vietnamese"))
                if candidate:
                    sentences.append(candidate)
        elif isinstance(payload, dict):
            for key, value in payload.items():
                if isinstance(value, dict):
                    candidate = _normalize_pair(value.get("en") or key, value.get("vi"))
                else:
                    candidate = _normalize_pair(key, value)
                if candidate:
                    sentences.append(candidate)
        else:
            raise ValueError("Unsupported corpus format. Expected list or mapping.")

        if not sentences:
            raise ValueError(f"No valid sentence pairs found in {path}")

        return cls(sentences=sentences, embedding_model_name=embedding_model_name, device=device)

    def _build_indexes(self) -> None:
        if not self._use_embeddings:
            return

        english_sentences = [pair.en for pair in self.sentences]
        vietnamese_sentences = [pair.vi for pair in self.sentences]

        self.en_embeddings = self._encode(english_sentences)
        self.vi_embeddings = self._encode(vietnamese_sentences)

        dim = self.en_embeddings.shape[1]
        if FAISS_AVAILABLE:
            self.en_index = _FaissIndex(dim)
            self.vi_index = _FaissIndex(dim)
            self.en_index.add(self.en_embeddings.copy())
            self.vi_index.add(self.vi_embeddings.copy())
        else:  # pragma: no cover - fallback path
            self.en_index = _NumpyIndex(self.en_embeddings.copy())
            self.vi_index = _NumpyIndex(self.vi_embeddings.copy())

    def _encode(self, sentences: Sequence[str]) -> np.ndarray:
        if not self._use_embeddings or self.embedder is None or np is None:
            raise RuntimeError("Embedding model is not available.")
        embeddings = self.embedder.encode(sentences, show_progress_bar=False, convert_to_numpy=True)
        return embeddings.astype("float32")

    def retrieve(
        self,
        text: str,
        direction: TranslationDirection,
        top_k: int = 1,
    ) -> List[Tuple[ParallelSentence, float]]:
        """Retrieve top-k similar examples for the supplied text."""
        if not text.strip():
            raise ValueError("Input text must be non-empty.")
        if self._use_embeddings and self.en_index is not None and self.vi_index is not None:
            query_embedding = self._encode([normalize_text(text)])

            if direction == TranslationDirection.EN_VI:
                scores, indices = self.en_index.search(query_embedding, top_k)
            else:
                scores, indices = self.vi_index.search(query_embedding, top_k)

            results: List[Tuple[ParallelSentence, float]] = []
            if FAISS_AVAILABLE:
                for idx, score in zip(indices[0], scores[0]):
                    results.append((self.sentences[int(idx)], float(score)))
            else:
                for idx, score in zip(indices, scores):
                    results.append((self.sentences[int(idx)], float(score)))
            return results
        else:
            # Fallback: simple similarity using SequenceMatcher
            scored_pairs: List[Tuple[ParallelSentence, float]] = []
            for pair in self.sentences:
                candidate = pair.en if direction == TranslationDirection.EN_VI else pair.vi
                score = difflib.SequenceMatcher(None, normalize_text(text).lower(), candidate.lower()).ratio()
                scored_pairs.append((pair, score))
            scored_pairs.sort(key=lambda item: item[1], reverse=True)
            return scored_pairs[:top_k]

    def __len__(self) -> int:
        return len(self.sentences)

    def iter_sentences(self) -> Iterable[ParallelSentence]:
        return iter(self.sentences)

