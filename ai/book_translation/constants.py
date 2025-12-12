"""Package-wide constants for the bookstore translation pipeline."""

from enum import Enum


class TranslationDirection(str, Enum):
    """Supported translation directions."""

    EN_VI = "en_vi"
    VI_EN = "vi_en"


DEFAULT_LLM_MODEL = "Helsinki-NLP/opus-mt-vi-en"
DEFAULT_EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
DEFAULT_MAX_NEW_TOKENS = 512
DEFAULT_TEMPERATURE = 0.0

# Character heuristics for language detection
VIETNAMESE_DIACRITICS = set(
    "ăâđêôơư"
    "áàảãạ"
    "ấầẩẫậ"
    "ắằẳẵặ"
    "éèẻẽẹ"
    "ếềểễệ"
    "íìỉĩị"
    "óòỏõọ"
    "ốồổỗộ"
    "ớờởỡợ"
    "úùủũụ"
    "ứừửữự"
    "ýỳỷỹỵ"
)


def normalize_text(text: str) -> str:
    """Normalize whitespace for consistent processing."""
    return " ".join(text.strip().split())

