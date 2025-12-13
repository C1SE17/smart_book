"""Utilities for loading and querying the bookstore bilingual glossary."""

from __future__ import annotations

import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Tuple

from .constants import TranslationDirection, normalize_text


@dataclass(frozen=True)
class TermHint:
    """Structured representation of a terminology hint."""

    source_term: str
    target_term: str
    note: Optional[str] = None

    def to_prompt_fragment(self) -> str:
        """Return hint formatted for prompt injection."""
        fragment = f'"{self.source_term}" translates to "{self.target_term}"'
        if self.note:
            fragment += f" ({self.note})"
        return fragment


def _load_dictionary_payload(path: Path) -> Dict[str, object]:
    with path.open("r", encoding="utf-8") as handle:
        payload = json.load(handle)
    if isinstance(payload, list):
        mapping = {}
        for item in payload:
            if not isinstance(item, dict):
                continue
            term_en = item.get("en") or item.get("english") or item.get("term_en")
            term_vi = item.get("vi") or item.get("vietnamese") or item.get("term_vi")
            if term_en and term_vi:
                mapping[term_en] = item
        return mapping
    if not isinstance(payload, dict):
        raise ValueError("Unsupported glossary format. Expected mapping or list of objects.")
    return payload


def _normalize_dictionary_entry(term: str) -> str:
    return normalize_text(term.lower())


def _tokenize(text: str) -> List[str]:
    text = normalize_text(text.lower())
    tokens = re.findall(r"[0-9a-zA-ZÀ-ỹ]+", text)
    return tokens


class BookGlossary:
    """Lightweight glossary matcher supporting EN↔VI lookups for publishing terms."""

    def __init__(self, entries: Dict[str, TermHint], max_tokens: int = 6):
        self.entries = entries
        self.max_tokens = max_tokens
        self._index_en: Dict[int, Dict[Tuple[str, ...], TermHint]] = {}
        self._index_vi: Dict[int, Dict[Tuple[str, ...], TermHint]] = {}
        for hint in entries.values():
            en_tokens = tuple(_tokenize(hint.source_term))
            vi_tokens = tuple(_tokenize(hint.target_term))
            if not en_tokens or not vi_tokens:
                continue
            self._index_en.setdefault(len(en_tokens), {})[en_tokens] = hint
            self._index_vi.setdefault(len(vi_tokens), {})[vi_tokens] = hint
        self._max_en = max(self._index_en.keys(), default=1)
        self._max_vi = max(self._index_vi.keys(), default=1)

    @classmethod
    def from_path(cls, path: str | Path) -> "BookGlossary":
        path = Path(path)
        payload = _load_dictionary_payload(path)
        hints: Dict[str, TermHint] = {}

        for key, value in payload.items():
            term_en = key
            term_vi: Optional[str] = None
            note: Optional[str] = None

            if isinstance(value, str):
                term_vi = value
            elif isinstance(value, dict):
                term_en = value.get("en") or value.get("english") or term_en
                term_vi = value.get("vi") or value.get("vietnamese") or value.get("term_vi")
                note = value.get("note") or value.get("context")
            else:
                continue

            if not term_en or not term_vi:
                continue

            normalized_key = _normalize_dictionary_entry(term_en)
            hints[normalized_key] = TermHint(source_term=term_en, target_term=term_vi, note=note)

        if not hints:
            raise ValueError(f"No valid glossary entries found in {path}")
        return cls(hints)

    def _scan(self, text: str, direction: TranslationDirection, limit: int) -> List[TermHint]:
        tokens = _tokenize(text)
        if not tokens:
            return []

        index = self._index_en if direction == TranslationDirection.EN_VI else self._index_vi
        max_window = self._max_en if direction == TranslationDirection.EN_VI else self._max_vi
        max_window = min(max_window, self.max_tokens)

        results: List[TermHint] = []
        seen_sources: set[str] = set()

        for start in range(len(tokens)):
            for window in range(max_window, 0, -1):
                if start + window > len(tokens):
                    continue
                window_tokens = tuple(tokens[start : start + window])
                hint = index.get(window, {}).get(window_tokens)
                if hint and hint.source_term not in seen_sources:
                    results.append(hint)
                    seen_sources.add(hint.source_term)
                    if len(results) >= limit:
                        return results
        return results

    def lookup(self, text: str, direction: TranslationDirection, limit: int = 6) -> List[TermHint]:
        """Find up to `limit` hints relevant to the supplied text."""
        return self._scan(text, direction, limit)

    def reverse_lookup(self, text: str, limit: int = 6) -> List[TermHint]:
        en_hints = self._scan(text, TranslationDirection.EN_VI, limit)
        if len(en_hints) >= limit:
            return en_hints
        vi_hints = self._scan(text, TranslationDirection.VI_EN, limit)
        combined = en_hints + [hint for hint in vi_hints if hint not in en_hints]
        return combined[:limit]

    def __len__(self) -> int:
        return len(self.entries)

    def iter_hints(self) -> Iterable[TermHint]:
        return self.entries.values()

