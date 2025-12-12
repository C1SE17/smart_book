"""Prompt construction utilities for glossary-augmented bookstore translation."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable, List, Sequence

from .constants import TranslationDirection, normalize_text
from .dictionary import TermHint
from .corpus import ParallelSentence


SYSTEM_PROMPT_TEMPLATE = """You are a senior localization specialist for an online bookstore handling {direction_label} translations.
Follow these rules strictly:
- Preserve author names, ISBNs, and edition numbers exactly.
- If a glossary hint is provided, you must keep the given translation verbatim.
- Output only the translated sentence without additional commentary.
- Maintain a marketing-friendly yet professional tone appropriate for book listings."""


@dataclass(frozen=True)
class PromptContext:
    """Holds contextual data ready for prompt templating."""

    direction: TranslationDirection
    source_text: str
    example_pair: ParallelSentence | None = None
    example_hints: Sequence[TermHint] = ()
    source_hints: Sequence[TermHint] = ()

    @property
    def direction_label(self) -> str:
        return "English → Vietnamese" if self.direction == TranslationDirection.EN_VI else "Vietnamese → English"


def _format_hints(hints: Iterable[TermHint]) -> str:
    fragments = [hint.to_prompt_fragment() for hint in hints]
    if not fragments:
        return ""
    return "Glossary guidance: " + "; ".join(fragments) + "."


def build_chat_messages(context: PromptContext) -> List[dict]:
    """Create chat-style messages suitable for `tokenizer.apply_chat_template`."""

    system_prompt = SYSTEM_PROMPT_TEMPLATE.format(direction_label=context.direction_label)
    user_segments: List[str] = []

    if context.example_pair:
        example_direction = context.direction_label
        example_text = (
            f"Sample translation ({example_direction}):\n"
            f"Source: {context.example_pair.en if context.direction == TranslationDirection.EN_VI else context.example_pair.vi}\n"
        )
        example_hints_text = _format_hints(context.example_hints)
        if example_hints_text:
            example_text += example_hints_text + "\n"
        target_example = context.example_pair.vi if context.direction == TranslationDirection.EN_VI else context.example_pair.en
        example_text += f"Target: {target_example}"
        user_segments.append(example_text)

    source_block = f"Translate this bookstore content ({context.direction_label}):\nSource: {normalize_text(context.source_text)}"
    hints_text = _format_hints(context.source_hints)
    if hints_text:
        source_block += "\n" + hints_text
    source_block += "\nTarget:"
    user_segments.append(source_block)

    user_prompt = "\n\n".join(user_segments)

    return [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ]

