"""Command-line interface for the bookstore translation pipeline."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Iterable, Optional

from .book_translation import BookTranslator, TranslationDirection


def _parse_direction(value: str) -> Optional[TranslationDirection]:
    value = value.lower()
    if value in {"auto", "automatic"}:
        return None
    if value in {"en-vi", "en_vi", "english-vietnamese"}:
        return TranslationDirection.EN_VI
    if value in {"vi-en", "vi_en", "vietnamese-english"}:
        return TranslationDirection.VI_EN
    raise argparse.ArgumentTypeError(f"Unsupported direction: {value}")


def _iter_inputs(args: argparse.Namespace) -> Iterable[str]:
    if args.text:
        yield args.text
        return
    if args.input_file:
        path = Path(args.input_file)
        if not path.exists():
            raise FileNotFoundError(path)
        if path.suffix.lower() in {".jsonl", ".json"}:
            for line in path.read_text(encoding="utf-8").splitlines():
                line = line.strip()
                if not line:
                    continue
                if path.suffix.lower() == ".jsonl":
                    payload = json.loads(line)
                    yield payload.get("text", "")
                else:
                    payload = json.loads(line)
                    if isinstance(payload, list):
                        for item in payload:
                            yield str(item)
                    else:
                        yield str(payload)
        else:
            for line in path.read_text(encoding="utf-8").splitlines():
                if line.strip():
                    yield line.strip()
        return

    print("Entering interactive mode (Ctrl+C to exit).", file=sys.stderr)
    for line in sys.stdin:
        text = line.strip()
        if text:
            yield text


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Bookstore English↔Vietnamese translation CLI.")
    parser.add_argument("--glossary-path", required=True, help="Path to bookstore glossary JSON.")
    parser.add_argument("--corpus-path", required=True, help="Path to bilingual corpus JSON.")
    parser.add_argument("--llm-model", default=None, help="LLM model identifier (Hugging Face).")
    parser.add_argument("--embedding-model", default=None, help="SentenceTransformer model identifier.")
    parser.add_argument("--direction", type=_parse_direction, default=None, help="Translation direction or 'auto'.")
    parser.add_argument("--text", help="Translate a single sentence provided inline.")
    parser.add_argument("--input-file", help="Translate lines from file (.txt or .jsonl).")
    parser.add_argument("--top-k", type=int, default=1, help="Number of retrieved examples to consider.")
    return parser


def main(argv: Optional[list[str]] = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)

    translator = BookTranslator(
        glossary_path=args.glossary_path,
        corpus_path=args.corpus_path,
        llm_model_name=args.llm_model or "google/gemma-2-9b-it",
        embedding_model_name=args.embedding_model or "BAAI/bge-m3",
    )

    for text in _iter_inputs(args):
        result = translator.translate(text, direction=args.direction, top_k_examples=args.top_k)
        output = {
            "source": text,
            "translation": result["translation"],
            "metadata": result["metadata"],
        }
        print(json.dumps(output, ensure_ascii=False))

    return 0


if __name__ == "__main__":
    raise SystemExit(main())

