"""LLM utility wrapper for deterministic bookstore translation generation."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, List, Mapping, Optional

try:
    import torch
except ImportError:  # pragma: no cover - optional dependency
    torch = None

try:
    from transformers import AutoModelForSeq2SeqLM, AutoTokenizer, GenerationConfig
except ImportError:  # pragma: no cover - optional dependency
    AutoModelForSeq2SeqLM = None
    AutoTokenizer = None
    GenerationConfig = None

from .constants import DEFAULT_LLM_MODEL, DEFAULT_MAX_NEW_TOKENS


# --------------------------------------------------
# Generation settings (cleaned for translation)
# MarianMT does NOT support temperature, top_p or sampling
# --------------------------------------------------

@dataclass
class GenerationSettings:
    max_new_tokens: int = DEFAULT_MAX_NEW_TOKENS
    do_sample: bool = False                   # Seq2Seq translation always deterministic
    repetition_penalty: float = 1.0

    def to_kwargs(self) -> Mapping[str, Any]:
        return {
            "max_new_tokens": self.max_new_tokens,
            "do_sample": self.do_sample,
            "repetition_penalty": self.repetition_penalty,
        }


# --------------------------------------------------
# Translator Backend
# --------------------------------------------------

class LLMTranslatorBackend:
    """Loads a Seq2Seq LM and exposes a minimal chat-style interface."""

    def __init__(
        self,
        model_name: str = DEFAULT_LLM_MODEL,
        device: Optional[str] = None,
        torch_dtype: Optional[torch.dtype] = None,
        generation_settings: Optional[GenerationSettings] = None,
    ):
        self.model_name = model_name
        self.generation_settings = generation_settings or GenerationSettings()
        self.available = (
            torch is not None
            and AutoModelForSeq2SeqLM is not None
            and AutoTokenizer is not None
            and GenerationConfig is not None
        )

        if not self.available:
            self.tokenizer = None
            self.model = None
            self.device = "cpu"
            return

        tokenizer_kwargs = {}
        model_kwargs = {}
        if torch_dtype is not None:
            model_kwargs["torch_dtype"] = torch_dtype

        inferred_device = device or ("cuda" if torch.cuda.is_available() else "cpu")

        # Load tokenizer
        self.tokenizer = AutoTokenizer.from_pretrained(model_name, **tokenizer_kwargs)
        if self.tokenizer.pad_token is None:
            self.tokenizer.pad_token = self.tokenizer.eos_token

        # Load model
        self.model = AutoModelForSeq2SeqLM.from_pretrained(model_name, **model_kwargs)
        self.model.to(inferred_device)
        self.device = inferred_device

        # Apply generation config safely
        self.model.generation_config = GenerationConfig(
            **self.generation_settings.to_kwargs(),
            pad_token_id=self.tokenizer.pad_token_id,
            eos_token_id=self.tokenizer.eos_token_id,
        )

    def _extract_seq2seq_payload(self, messages: List[Mapping[str, str]]) -> Optional[str]:
        """Try to grab the latest `Source: ... Target:` block for deterministic models."""
        for message in reversed(messages):
            content = message.get("content", "")
            if "Source:" not in content:
                continue
            tail = content.rsplit("Source:", 1)[1]
            if "Target" in tail:
                tail = tail.split("Target", 1)[0]
            cleaned = tail.strip()
            if cleaned:
                return cleaned
        return None

    # --------------------------------------------------
    # Render messages (falling back to simple format)
    # --------------------------------------------------
    def _render_messages(self, messages: List[Mapping[str, str]]) -> str:
        # Try chat template if exists (LLMs)
        if hasattr(self.tokenizer, "apply_chat_template"):
            try:
                return self.tokenizer.apply_chat_template(
                    messages,
                    tokenize=False,
                    add_generation_prompt=True,
                )
            except ValueError:
                pass  # MarianMT does not have chat template

        # Fallback: simple formatting for Seq2Seq
        parts = []
        for m in messages:
            content = m.get("content", "").strip()
            if content:
                parts.append(content)
        return "\n".join(parts)

    # --------------------------------------------------
    # Main generate() function for translation
    # --------------------------------------------------
    def generate(self, messages: List[Mapping[str, str]]) -> str:
        if not self.available or self.model is None or self.tokenizer is None:
            for msg in reversed(messages):
                if msg.get("role") == "user":
                    return msg.get("content", "").strip()
            return ""

        prompt_text = self._extract_seq2seq_payload(messages)
        if not prompt_text:
            prompt_text = self._render_messages(messages).strip()
        if not prompt_text:
            return ""

        # Encode text
        encoded = self.tokenizer(
            prompt_text,
            return_tensors="pt",
            padding=True,
            truncation=True,
        )
        encoded = {k: v.to(self.device) for k, v in encoded.items()}

        # ------------- FIX: decoder_start_token_id -----------------
        decoder_start = self.model.config.decoder_start_token_id
        if decoder_start is None:
            decoder_start = getattr(self.tokenizer, "bos_token_id", None)

        if decoder_start is None:
            raise ValueError(
                "decoder_start_token_id is required for MarianMT but missing in model/tokenizer."
            )

        # Generate
        outputs = self.model.generate(
            **encoded,
            max_new_tokens=self.generation_settings.max_new_tokens,
            decoder_start_token_id=decoder_start,
        )

        text = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        return text.strip()
