"""
Hybrid recommendation agent that fuses structured scores, deterministic rules,
and an optional LLM narrative to deliver executive-grade retail guidance.

Pipeline:
1. Compute quantitative scores (forecast, volatility, sentiment, segmentation).
2. Extract rule-based insights + action candidates.
3. If OPENAI_API_KEY exists → LLM writes the final narrative & action plan.
4. Fallback gracefully to scored bullet points when LLM is unavailable.
"""

from __future__ import annotations

import importlib
import os
from typing import Any, Dict, List, Optional, Sequence


def _format_topic(topic: Optional[str]) -> str:
    if not topic:
        return "chủ đề chưa xác định"
    return topic.strip().capitalize()


def compute_scores(
    sales_summary: Dict[str, float],
    sentiment_summary: Dict[str, float],
    topic_insights: Dict[str, Sequence[str]],
    segment_summary: Optional[Dict[str, float]],
) -> Dict[str, float]:
    """
    Convert raw analytics signals into normalized (0-1) risk/opportunity scores.
    """

    weekly_trend = sales_summary.get("weekly_trend", 0.0)
    forecast_growth = sales_summary.get("forecast_growth", 0.0)
    volatility = sales_summary.get("demand_volatility", 0.0)

    negative_ratio = sentiment_summary.get("negative_ratio", 0.0)
    positive_ratio = sentiment_summary.get("positive_ratio", 0.0)

    vip_share = segment_summary.get("vip_share", 0.0) if segment_summary else 0.0
    at_risk_share = segment_summary.get("at_risk_share", 0.0) if segment_summary else 0.0

    top_positive_topic = next(iter(topic_insights.get("top_positive_topics", [])), "") or ""
    trending_is_tiktok = "tiktok" in top_positive_topic.lower()

    scores = {
        "sales_risk": max(0.0, -weekly_trend) * 0.6 + volatility * 0.4,
        "sentiment_risk": negative_ratio,
        "growth_opportunity": max(0.0, forecast_growth) * positive_ratio,
        "trending_opportunity": 1.0 if trending_is_tiktok else 0.0,
        "customer_risk": at_risk_share * 0.7 + max(0.0, 0.2 - vip_share),
    }

    return {label: max(0.0, min(1.0, score)) for label, score in scores.items()}


def extract_rule_based_recommendations(
    sales_summary: Dict[str, float],
    sentiment_summary: Dict[str, float],
    topic_insights: Dict[str, Sequence[str]],
    segment_summary: Optional[Dict[str, float]] = None,
) -> List[str]:
    """
    Deterministic signals that remain available even without an API key.
    """

    recs: List[str] = []

    weekly_trend = sales_summary.get("weekly_trend", 0.0)
    forecast_growth = sales_summary.get("forecast_growth", 0.0)
    volatility = sales_summary.get("demand_volatility", 0.0)

    negative_ratio = sentiment_summary.get("negative_ratio", 0.0)
    positive_ratio = sentiment_summary.get("positive_ratio", 0.0)

    top_negative_topic = next(iter(topic_insights.get("top_negative_topics", [])), None)
    top_positive_topic = next(iter(topic_insights.get("top_positive_topics", [])), None)

    if weekly_trend < -0.2 and negative_ratio > 0.4:
        recs.append(
            f"Doanh số tuần giảm {weekly_trend:.0%} và đánh giá tiêu cực đạt {negative_ratio:.0%}. "
            f"Khách hàng phàn nàn nhiều về '{_format_topic(top_negative_topic)}' → ưu tiên xử lý chất lượng & CSKH."
        )

    if forecast_growth > 0.5 and positive_ratio > 0.5:
        recs.append(
            f"Dự báo nhu cầu tăng {forecast_growth:.0%} với cảm xúc tích cực {positive_ratio:.0%}. "
            "Tăng nhập kho & bổ sung nhân sự fulfillment để tránh thiếu hàng."
        )

    if forecast_growth > 0.5 and top_positive_topic and "tiktok" in top_positive_topic.lower():
        recs.append(
            "Sản phẩm đang viral trên TikTok → tung combo marketing + livestream để chốt đơn nhanh."
        )

    if volatility > 0.4:
        recs.append(
            f"Nhu cầu biến động mạnh (CV={volatility:.2f}). Thiết lập ngưỡng tồn kho linh hoạt và theo dõi hằng ngày."
        )

    if segment_summary:
        vip_share = segment_summary.get("vip_share")
        at_risk_share = segment_summary.get("at_risk_share")

        if vip_share is not None and vip_share < 0.2:
            recs.append(
                f"Tỷ lệ khách VIP còn {vip_share:.0%}. Tạo loyalty tier với voucher độc quyền để khóa khách chi tiêu cao."
            )

        if at_risk_share is not None and at_risk_share > 0.3:
            recs.append(
                f"{at_risk_share:.0%} khách nằm trong nhóm rời bỏ. Kích hoạt chiến dịch win-back + CSKH cá nhân hóa."
            )

    if not recs:
        recs.append("Các chỉ số ổn định, duy trì chiến lược hiện tại và tiếp tục theo dõi forecast.")

    return recs


def _format_score_summary(scores: Dict[str, float]) -> str:
    """
    Provide a concise fallback summary that still feels actionable.
    """

    if not scores:
        return "Không có tín hiệu nổi bật – hệ thống sẽ tiếp tục giám sát."

    risk_labels = {
        "sales_risk": "rủi ro doanh số",
        "sentiment_risk": "rủi ro cảm xúc",
        "customer_risk": "rủi ro khách hàng",
    }
    opp_labels = {
        "growth_opportunity": "cơ hội tăng trưởng",
        "trending_opportunity": "cơ hội TikTok",
    }

    risks = sorted(
        ((risk_labels[k], v) for k, v in scores.items() if k in risk_labels), key=lambda x: x[1], reverse=True
    )
    opps = sorted(
        ((opp_labels[k], v) for k, v in scores.items() if k in opp_labels), key=lambda x: x[1], reverse=True
    )

    def _describe(items: List[Any]) -> str:
        top = [f"{label} {score:.0%}" for label, score in items[:2] if score > 0.25]
        return ", ".join(top) if top else ""

    risk_text = _describe(risks)
    opp_text = _describe(opps)

    pieces = []
    if risk_text:
        pieces.append(f"Rủi ro nổi bật: {risk_text}.")
    if opp_text:
        pieces.append(f"Cơ hội đáng chú ý: {opp_text}.")

    return " ".join(pieces) or "Không có rủi ro/cơ hội nổi bật."


class _LLMClient:
    """
    Lazy LLM loader that prefers OpenAI but can fall back to Gemini.
    """

    def __init__(self) -> None:
        self.provider: Optional[str] = None
        self.model_name: Optional[str] = None
        self.client: Any = None
        self.ready: bool = False

        openai_key = os.environ.get("OPENAI_API_KEY")
        if openai_key:
            self._init_openai()
            if self.ready:
                return

        gemini_key = os.environ.get("GEMINI_API_KEY")
        if gemini_key:
            self._init_gemini(gemini_key)

    # ---------------------------------------------------------
    # Provider initializers
    # ---------------------------------------------------------
    def _init_openai(self) -> None:
        try:
            OpenAI = getattr(importlib.import_module("openai"), "OpenAI")  # type: ignore[attr-defined]
        except (ImportError, AttributeError):
            self.ready = False
            return

        self.client = OpenAI()
        self.model_name = os.environ.get("OPENAI_LLM_MODEL", "gpt-4.1-mini")
        self.provider = "openai"
        self.ready = True

    def _init_gemini(self, api_key: str) -> None:
        try:
            genai = importlib.import_module("google.generativeai")
        except ImportError:
            self.ready = False
            return

        genai.configure(api_key=api_key)
        model_name = os.environ.get("GEMINI_LLM_MODEL", "gemini-1.5-flash")
        self.client = genai.GenerativeModel(model_name)
        self.model_name = model_name
        self.provider = "gemini"
        self.ready = True

    # ---------------------------------------------------------
    # Public helpers
    # ---------------------------------------------------------
    def is_available(self) -> bool:
        return self.ready and self.client is not None and self.provider is not None

    def generate(self, prompt: str) -> str:
        if not self.is_available():
            raise RuntimeError("LLM backend not initialized.")

        if self.provider == "openai":
            response = self.client.chat.completions.create(
                model=self.model_name,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=400,
            )
            return response.choices[0].message.content.strip()

        if self.provider == "gemini":
            response = self.client.generate_content(prompt)
            text = getattr(response, "text", None)
            if text:
                return text.strip()
            candidates = getattr(response, "candidates", None)
            if candidates:
                parts = getattr(candidates[0], "content", None)
                if parts and getattr(parts, "parts", None):
                    snippets = [
                        getattr(part, "text", "") for part in parts.parts if getattr(part, "text", "")
                    ]
                    combined = "\n".join(snippets).strip()
                    if combined:
                        return combined
            raise RuntimeError("Gemini response is empty.")

        raise ValueError(f"Unsupported LLM provider: {self.provider}")


_LLM_BACKEND = _LLMClient()


def llm_generate_business_narrative(
    scores: Dict[str, float],
    rule_recs: List[str],
    raw_payload: Dict[str, Any],
) -> str:
    """
    Ask the LLM to synthesize insights + propose concrete actions.
    """

    prompt = f"""
Bạn là chuyên gia chiến lược bán lẻ cấp cao.
Dữ liệu cung cấp gồm:
[SCORES 0-1] {scores}
[RULE INSIGHTS] {rule_recs}
[RAW DATA] {raw_payload}

Yêu cầu:
- Chọn 3-5 insight quan trọng nhất.
- Giải thích nguyên nhân (trend, sentiment, topic, phân khúc).
- Nêu rủi ro và cơ hội kèm tác động kinh doanh.
- Đề xuất hành động rõ ràng cho tồn kho, marketing, loyalty/TikTok.
- Văn phong BI dashboard, súc tích nhưng giàu insight.

Trả về 1 đoạn văn bằng tiếng Việt.
"""

    return _LLM_BACKEND.generate(prompt)


def generate_manager_recommendations(
    sales_summary: Dict[str, float],
    sentiment_summary: Dict[str, float],
    topic_insights: Dict[str, Sequence[str]],
    segment_summary: Optional[Dict[str, float]] = None,
) -> List[str]:
    """
    Public API expected by the rest of the pipeline.
    Returns a list to keep backward compatibility with the CLI/UI layer:
    - Item[0] = executive narrative (LLM or fallback summary).
    - Remaining items = deterministic rule-based bullet points.
    """

    scores = compute_scores(sales_summary, sentiment_summary, topic_insights, segment_summary)
    rule_recs = extract_rule_based_recommendations(
        sales_summary=sales_summary,
        sentiment_summary=sentiment_summary,
        topic_insights=topic_insights,
        segment_summary=segment_summary,
    )

    narrative: Optional[str] = None
    if _LLM_BACKEND.is_available():
        raw_payload: Dict[str, Any] = {
            "sales_summary": sales_summary,
            "sentiment_summary": sentiment_summary,
            "topic_insights": topic_insights,
            "segment_summary": segment_summary,
        }
        try:
            narrative = llm_generate_business_narrative(scores=scores, rule_recs=rule_recs, raw_payload=raw_payload)
        except Exception:
            narrative = None

    header = narrative if narrative else f"[Fallback] {_format_score_summary(scores)}"

    return [header, *rule_recs]


def generate_manager_report(
    sales_summary: Dict[str, float],
    sentiment_summary: Dict[str, float],
    topic_insights: Dict[str, Sequence[str]],
    segment_summary: Optional[Dict[str, float]] = None,
) -> str:
    """
    Convenience helper when a single narrative string is desired.
    """

    recs = generate_manager_recommendations(
        sales_summary=sales_summary,
        sentiment_summary=sentiment_summary,
        topic_insights=topic_insights,
        segment_summary=segment_summary,
    )

    return recs[0] if recs else ""


__all__ = [
    "compute_scores",
    "extract_rule_based_recommendations",
    "generate_manager_recommendations",
    "generate_manager_report",
]

