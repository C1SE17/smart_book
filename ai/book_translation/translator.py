"""High-level bookstore translation engine orchestrating glossary, retrieval, and LLM."""

from __future__ import annotations

from typing import Dict, List, Optional

from .constants import (
    DEFAULT_EMBEDDING_MODEL,
    DEFAULT_LLM_MODEL,
    TranslationDirection,
    VIETNAMESE_DIACRITICS,
)
from .corpus import BookParallelCorpus, ParallelSentence
from .dictionary import BookGlossary, TermHint
from .llm import LLMTranslatorBackend, GenerationSettings
from .prompting import PromptContext, build_chat_messages


def detect_direction(text: str) -> TranslationDirection:
    """Detect translation direction based on presence of Vietnamese diacritics."""
    text = text.strip()
    if not text:
        raise ValueError("Input text must be non-empty.")
    total_letters = sum(char.isalpha() for char in text)
    vi_letters = sum(char.lower() in VIETNAMESE_DIACRITICS for char in text)

    if total_letters == 0:
        return TranslationDirection.EN_VI

    ratio = vi_letters / total_letters
    return TranslationDirection.VI_EN if ratio > 0.2 else TranslationDirection.EN_VI


class BookTranslator:
    """Combine retrieval, glossary augmentation, and LLM prompting for bookstore content."""

    def __init__(
        self,
        glossary_path: str,
        corpus_path: str,
        llm_model_name: str = DEFAULT_LLM_MODEL,
        embedding_model_name: str = DEFAULT_EMBEDDING_MODEL,
        llm_device: Optional[str] = None,
        llm_generation: Optional[GenerationSettings] = None,
        embedder_device: Optional[str] = None,
    ):
        self.glossary = BookGlossary.from_path(glossary_path)
        self.corpus = BookParallelCorpus.from_path(
            corpus_path,
            embedding_model_name=embedding_model_name,
            device=embedder_device,
        )
        self.llm = LLMTranslatorBackend(
            model_name=llm_model_name,
            device=llm_device,
            generation_settings=llm_generation,
        )
        self._llm_available = getattr(self.llm, "available", True)

    def _apply_glossary_fallback(
        self,
        text: str,
        direction: TranslationDirection,
        hints: List[TermHint],
    ) -> str:
        result = text
        for hint in hints:
            if direction == TranslationDirection.EN_VI:
                result = result.replace(hint.source_term, hint.target_term)
            else:
                result = result.replace(hint.target_term, hint.source_term)
        return result

    def translate(
        self,
        text: str,
        direction: Optional[TranslationDirection] = None,
        top_k_examples: int = 1,
    ) -> Dict[str, object]:
        if direction is None:
            direction = detect_direction(text)

        retrieved_pairs = self.corpus.retrieve(text, direction=direction, top_k=top_k_examples)
        example_pair: Optional[ParallelSentence] = None
        example_score: Optional[float] = None
        example_hints: List[TermHint] = []
        if retrieved_pairs:
            example_pair, example_score = retrieved_pairs[0]
            example_source_text = example_pair.en if direction == TranslationDirection.EN_VI else example_pair.vi
            example_hints = self.glossary.lookup(example_source_text, direction=direction)

        input_hints = self.glossary.lookup(text, direction=direction)

        prompt_context = PromptContext(
            direction=direction,
            source_text=text,
            example_pair=example_pair,
            example_hints=example_hints,
            source_hints=input_hints,
        )
        messages = build_chat_messages(prompt_context)

        translation_method = "llm"
        if self._llm_available:
            translation = self.llm.generate(messages)
        else:
            translation_method = "glossary_fallback"
            translation = self._apply_glossary_fallback(text, direction, input_hints)
            if (not translation.strip() or translation.strip() == text.strip()) and example_pair:
                translation = example_pair.vi if direction == TranslationDirection.EN_VI else example_pair.en

        return {
            "translation": translation,
            "metadata": {
                "direction": direction.value,
                "example": {
                    "en": example_pair.en,
                    "vi": example_pair.vi,
                }
                if example_pair
                else None,
                "example_score": example_score,
                "example_hints": [hint.to_prompt_fragment() for hint in example_hints],
                "input_hints": [hint.to_prompt_fragment() for hint in input_hints],
                "strategy": translation_method,
            },
        }

