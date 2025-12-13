"""Run a single bookstore translation request and print JSON output."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

PACKAGE_DIR = Path(__file__).resolve().parent
if str(PACKAGE_DIR) not in sys.path:
    sys.path.insert(0, str(PACKAGE_DIR))

try:
    from .book_translation import BookTranslator, TranslationDirection
except ImportError:
    from book_translation import BookTranslator, TranslationDirection  # type: ignore


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Translate book content EN↔VI with glossary support.")
    parser.add_argument("--glossary-path", required=True, help="Path to book_glossary.json")
    parser.add_argument("--corpus-path", required=True, help="Path to book_parallel.json")
    parser.add_argument("--text", required=True, help="Source sentence to translate.")
    parser.add_argument(
        "--direction",
        choices=[TranslationDirection.EN_VI.value, TranslationDirection.VI_EN.value, "auto"],
        default="auto",
        help="Translation direction (default: auto-detect).",
    )
    parser.add_argument("--llm-model", default="Helsinki-NLP/opus-mt-vi-en", help="LLM model name.")
    parser.add_argument("--embedding-model", default="sentence-transformers/all-MiniLM-L6-v2", help="Embedding model name.")
    parser.add_argument("--top-k", type=int, default=1, help="Retrieved example count.")
    parser.add_argument("--llm-device", default=None, help="Torch device override for the LLM.")
    parser.add_argument("--embedder-device", default=None, help="Device override for the embedder.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    glossary_path = Path(args.glossary_path)
    corpus_path = Path(args.corpus_path)
    if not glossary_path.exists():
        raise FileNotFoundError(glossary_path)
    if not corpus_path.exists():
        raise FileNotFoundError(corpus_path)

    direction = None
    if args.direction != "auto":
        direction = TranslationDirection(args.direction)

    translator = BookTranslator(
        glossary_path=str(glossary_path),
        corpus_path=str(corpus_path),
        llm_model_name=args.llm_model,
        embedding_model_name=args.embedding_model,
        llm_device=args.llm_device,
        embedder_device=args.embedder_device,
    )

    result = translator.translate(
        text=args.text,
        direction=direction,
        top_k_examples=max(1, args.top_k),
    )
    payload = json.dumps(result, ensure_ascii=False, indent=2)

    try:
        buffer = sys.stdout.buffer  # type: ignore[attr-defined]
        buffer.write(payload.encode("utf-8"))
        buffer.write(b"\n")
        buffer.flush()
    except (AttributeError, ValueError):
        # Fallback if stdout lacks buffer (rare).
        sys.stdout.write(payload + "\n")
        sys.stdout.flush()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

