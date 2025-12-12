"""
Command-line orchestration script that wires together the structured and
unstructured analytics pipelines before generating manager recommendations.
"""

from __future__ import annotations

import argparse
import json
import math
import time
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Sequence, Tuple

import numpy as np
import pandas as pd
from bertopic import BERTopic

from ai_agent import generate_manager_recommendations
from structured_analysis import train_forecasting_model, train_segmentation_model
from unstructured_analysis import (
    analyze_sentiment_batch,
    get_topics_for_book,
    load_sentiment_model,
    train_topic_model,
)


def _load_csv(path: str) -> pd.DataFrame:
    csv_path = Path(path)
    if not csv_path.exists():
        raise FileNotFoundError(f"File not found: {csv_path}")
    return pd.read_csv(csv_path)


def _load_input_payload(args) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    if args.input_json:
        payload_path = Path(args.input_json)
        if not payload_path.exists():
            raise FileNotFoundError(f"Input JSON file not found: {payload_path}")
        payload = json.loads(payload_path.read_text(encoding="utf-8"))

        sales_df = pd.DataFrame(payload.get("sales", []))
        orders_df = pd.DataFrame(payload.get("orders", []))
        reviews_df = pd.DataFrame(payload.get("reviews", []))
    else:
        if not args.sales_path:
            raise ValueError("`--sales-path` is required when --input-json is not provided.")
        if not args.reviews_path:
            raise ValueError("`--reviews-path` is required when --input-json is not provided.")

        sales_df = _load_csv(args.sales_path)
        orders_df = _load_csv(args.orders_path) if args.orders_path else pd.DataFrame()
        reviews_df = _load_csv(args.reviews_path)

    return sales_df, orders_df, reviews_df


def _summarize_sales(
    sales_df: pd.DataFrame,
    forecast_payload: Dict[str, object],
    target_col: str,
    date_col: str,
) -> Dict[str, float]:
    df = sales_df.copy()
    df[date_col] = pd.to_datetime(df[date_col], errors="coerce")
    df = df.dropna(subset=[date_col, target_col]).sort_values(date_col)

    last_14 = df.tail(14)
    if len(last_14) < 14:
        # Not enough data to compute trends – return neutral values
        return {
            "weekly_trend": 0.0,
            "forecast_growth": 0.0,
            "demand_volatility": 0.0,
        }

    last_week = last_14.tail(7)[target_col].mean()
    prev_week = last_14.head(7)[target_col].mean()

    weekly_trend = 0.0 if prev_week == 0 else (last_week - prev_week) / max(prev_week, 1e-6)

    demand_volatility = float(
        last_14[target_col].std() / max(last_14[target_col].mean(), 1e-6)
    )

    forecast_df = forecast_payload.get("forecast_df")
    if isinstance(forecast_df, list):
        forecast_df = pd.DataFrame(forecast_df)
    elif not isinstance(forecast_df, pd.DataFrame):
        forecast_df = pd.DataFrame(forecast_payload.get("forecast", []))
    if forecast_df.empty:
        forecast_mean = float(sales_df[target_col].tail(7).mean())
        forecast_growth = 0.0
    else:
        forecast_mean = float(forecast_df["prediction"].mean())
        last_week = sales_df.tail(7)[target_col].mean() if not sales_df.empty else 0.0
        forecast_growth = 0.0 if last_week == 0 else (forecast_mean - last_week) / max(last_week, 1e-6)

    return {
        "weekly_trend": float(weekly_trend),
        "forecast_growth": float(forecast_growth),
        "demand_volatility": demand_volatility,
    }


def _summarize_sentiment(sentiment_df: pd.DataFrame) -> Dict[str, float]:
    if sentiment_df.empty:
        return {"positive_ratio": 0.0, "negative_ratio": 0.0, "neutral_ratio": 0.0}

    normalized = sentiment_df["label"].value_counts(normalize=True)
    mapping = {
        "positive_ratio": float(normalized.get("POSITIVE", 0.0) or normalized.get("Positive", 0.0)),
        "negative_ratio": float(normalized.get("NEGATIVE", 0.0) or normalized.get("Negative", 0.0)),
        "neutral_ratio": float(normalized.get("NEUTRAL", 0.0) or normalized.get("Neutral", 0.0)),
    }

    # Hugging Face default labels (e.g., LABEL_0) fallback
    total = sentiment_df.shape[0]
    if mapping["positive_ratio"] == 0 and "LABEL_1" in normalized.index:
        mapping["positive_ratio"] = float(normalized["LABEL_1"])
    if mapping["negative_ratio"] == 0 and "LABEL_0" in normalized.index:
        mapping["negative_ratio"] = float(normalized["LABEL_0"])

    remainder = 1.0 - sum(mapping.values())
    if remainder > 0:
        mapping["neutral_ratio"] += remainder

    return mapping


def _describe_topics(topic_model: BERTopic, topic_scores: Sequence[int], top_terms: int = 3) -> List[str]:
    labels: List[str] = []
    for topic_id, _score in topic_scores:
        words = topic_model.get_topic(topic_id)
        if not words:
            labels.append(f"Topic {topic_id}")
            continue
        descriptor = ", ".join(word for word, _ in words[:top_terms])
        labels.append(descriptor)
    return labels


def _summarize_segments(segmentation_df: pd.DataFrame) -> Dict[str, object]:
    if segmentation_df.empty:
        return {}

    total_customers = segmentation_df.shape[0]
    group_stats = segmentation_df.groupby("segment").agg(
        customers=("customer_id", "count"),
        avg_recency=("recency_days", "mean"),
        avg_frequency=("frequency", "mean"),
        avg_monetary=("monetary_value", "mean"),
        avg_order_value=("avg_order_value", "mean"),
    )

    group_stats["share"] = group_stats["customers"] / max(total_customers, 1)

    vip_segment = group_stats["avg_monetary"].idxmax()
    at_risk_segment = group_stats["avg_recency"].idxmax()

    summary = {
        "total_customers": float(total_customers),
        "vip_segment": int(vip_segment),
        "vip_share": float(group_stats.loc[vip_segment, "share"]),
        "at_risk_segment": int(at_risk_segment),
        "at_risk_share": float(group_stats.loc[at_risk_segment, "share"]),
    }

    profiles = (
        group_stats.reset_index()
        .rename(columns={"segment": "cluster"})
        .to_dict(orient="records")
    )

    return {"summary": summary, "profiles": profiles}


def _sanitize_for_json(value):
    if isinstance(value, dict):
        return {k: _sanitize_for_json(v) for k, v in value.items()}
    if isinstance(value, (list, tuple, set)):
        return [_sanitize_for_json(v) for v in value]
    if hasattr(value, "tolist"):
        return _sanitize_for_json(value.tolist())
    if isinstance(value, pd.Timestamp):
        return value.isoformat()
    if isinstance(value, (np.floating,)):
        value = float(value)
    if isinstance(value, (np.integer,)):
        return int(value)
    if isinstance(value, float):
        if math.isnan(value) or math.isinf(value):
            return None
        return value
    return value


def build_recommendations(
    sales_df: pd.DataFrame,
    forecast_payload: Dict[str, object],
    sentiment_df: pd.DataFrame,
    topic_model: BERTopic,
    positive_reviews: Sequence[str],
    negative_reviews: Sequence[str],
    segmentation_df: pd.DataFrame,
    target_col: str,
    date_col: str,
) -> List[str]:
    sales_summary = _summarize_sales(sales_df, forecast_payload, target_col, date_col)
    sentiment_summary = _summarize_sentiment(sentiment_df)

    positive_topics = _describe_topics(
        topic_model, get_topics_for_book(topic_model, positive_reviews)
    )
    negative_topics = _describe_topics(
        topic_model, get_topics_for_book(topic_model, negative_reviews)
    )

    topic_insights = {
        "top_positive_topics": positive_topics,
        "top_negative_topics": negative_topics,
    }

    segment_insights = _summarize_segments(segmentation_df) if not segmentation_df.empty else None
    segment_summary = segment_insights.get("summary") if segment_insights else None
    segment_profiles = segment_insights.get("profiles") if segment_insights else None

    recommendations = generate_manager_recommendations(
        sales_summary=sales_summary,
        sentiment_summary=sentiment_summary,
        topic_insights=topic_insights,
        segment_summary=segment_summary,
    )

    return {
        "sales_summary": sales_summary,
        "sentiment_summary": sentiment_summary,
        "topic_insights": topic_insights,
        "segment_summary": segment_summary,
        "segment_profiles": segment_profiles,
        "recommendations": recommendations,
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run the AI analytics pipeline.")
    parser.add_argument("--input-json", help="Optional JSON payload containing sales/orders/reviews arrays.")
    parser.add_argument("--output-json", help="Optional path to persist the pipeline output as JSON.")
    parser.add_argument(
        "--output-format",
        choices=["json", "text"],
        default="json",
        help="Format for stdout output.",
    )
    parser.add_argument("--sales-path", help="CSV with columns [date, daily_sales, ...].")
    parser.add_argument("--sales-date-col", default="date")
    parser.add_argument("--sales-target-col", default="daily_sales")
    parser.add_argument(
        "--orders-path",
        help="Optional CSV with orders for segmentation (customer_id, order_date, order_value).",
    )
    parser.add_argument("--reviews-path", help="CSV with columns [review_text, label].")
    parser.add_argument("--review-text-col", default="review_text")
    parser.add_argument("--sentiment-model-dir", default="ai/models/sentiment_finetuned_model")
    parser.add_argument("--topic-model-dir", default="ai/models/topic_model")
    parser.add_argument("--refresh-topic-model", action="store_true", help="Retrain BERTopic instead of loading from disk.")
    parser.add_argument("--topic-min-size", type=int, default=10)
    parser.add_argument(
        "--sentiment-sample",
        type=int,
        default=200,
        help="Number of sentiment predictions to include in the output (0 = all).",
    )
    parser.add_argument(
        "--segment-preview",
        type=int,
        default=200,
        help="Number of customer segmentation rows to include in the output (0 = none, -1 = all).",
    )
    return parser.parse_args()


def main():
    args = parse_args()
    start_time = time.time()

    sales_df, orders_df, reviews_df = _load_input_payload(args)

    if sales_df.empty:
        raise ValueError("Sales dataset is empty.")
    if args.sales_date_col not in sales_df.columns and "date" in sales_df.columns:
        sales_df = sales_df.rename(columns={"date": args.sales_date_col})
    if args.sales_target_col not in sales_df.columns and "daily_sales" in sales_df.columns:
        sales_df = sales_df.rename(columns={"daily_sales": args.sales_target_col})
    if args.sales_date_col not in sales_df.columns or args.sales_target_col not in sales_df.columns:
        raise KeyError(
            f"Sales data must contain columns `{args.sales_date_col}` and `{args.sales_target_col}`."
        )

    if not orders_df.empty:
        rename_map = {}
        if "order_date" not in orders_df.columns and "created_at" in orders_df.columns:
            rename_map["created_at"] = "order_date"
        if "order_value" not in orders_df.columns and "total_price" in orders_df.columns:
            rename_map["total_price"] = "order_value"
        if rename_map:
            orders_df = orders_df.rename(columns=rename_map)
    else:
        orders_df = pd.DataFrame(columns=["customer_id", "order_date", "order_value"])

    if reviews_df.empty:
        raise ValueError("Reviews dataset is empty.")
    if args.review_text_col not in reviews_df.columns and "text" in reviews_df.columns:
        reviews_df = reviews_df.rename(columns={"text": args.review_text_col})
    if args.review_text_col not in reviews_df.columns:
        raise KeyError(f"Reviews data must contain column `{args.review_text_col}`.")

    forecast_payload = train_forecasting_model(
        sales_df,
        target_col=args.sales_target_col,
        date_col=args.sales_date_col,
    )

    segmentation_df = pd.DataFrame()
    if not orders_df.empty:
        segmentation_df = train_segmentation_model(orders_df)

    sentiment_pipe = load_sentiment_model(args.sentiment_model_dir)
    review_texts = reviews_df[args.review_text_col].astype(str).tolist()
    sentiment_results = analyze_sentiment_batch(
        review_texts,
        sentiment_pipeline=sentiment_pipe,
    )

    if "rating" in reviews_df.columns:
        sentiment_results["rating"] = reviews_df["rating"].tolist()[: len(sentiment_results)]
    if "book_id" in reviews_df.columns:
        sentiment_results["book_id"] = reviews_df["book_id"].tolist()[: len(sentiment_results)]

    positive_mask = sentiment_results["label"].str.contains("POS", case=False, na=False)
    negative_mask = sentiment_results["label"].str.contains("NEG", case=False, na=False)

    positive_reviews = sentiment_results.loc[positive_mask, "text"].tolist()
    negative_reviews = sentiment_results.loc[negative_mask, "text"].tolist()

    topic_dir = Path(args.topic_model_dir)
    if args.refresh_topic_model or not topic_dir.exists():
        topic_model = train_topic_model(
            documents=review_texts,
            save_dir=str(topic_dir),
            min_topic_size=args.topic_min_size,
        )
    else:
        topic_model = BERTopic.load(str(topic_dir))

    recommendation_payload = build_recommendations(
        sales_df=sales_df,
        forecast_payload=forecast_payload,
        sentiment_df=sentiment_results,
        topic_model=topic_model,
        positive_reviews=positive_reviews,
        negative_reviews=negative_reviews,
        segmentation_df=segmentation_df,
        target_col=args.sales_target_col,
        date_col=args.sales_date_col,
    )

    sentiment_preview = sentiment_results
    if args.sentiment_sample and args.sentiment_sample > 0:
        sentiment_preview = sentiment_results.head(args.sentiment_sample)

    segment_preview = pd.DataFrame()
    if args.segment_preview != 0 and not segmentation_df.empty:
        if args.segment_preview > 0:
            segment_preview = segmentation_df.head(args.segment_preview)
        else:
            segment_preview = segmentation_df

    topic_overview = topic_model.get_topic_info()
    topic_records = topic_overview.head(20).to_dict(orient="records") if topic_overview is not None else []

    output_payload = {
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "runtime_seconds": round(time.time() - start_time, 2),
        "data_summary": {
            "sales_rows": int(sales_df.shape[0]),
            "order_rows": int(orders_df.shape[0]),
            "review_rows": int(reviews_df.shape[0]),
        },
        "forecast": {
            "metrics": forecast_payload["metrics"],
            "model_path": forecast_payload["model_path"],
            "feature_columns": forecast_payload["feature_columns"],
            "date_column": args.sales_date_col,
            "target_column": args.sales_target_col,
        },
        "sales_summary": recommendation_payload["sales_summary"],
        "sentiment": {
            "summary": recommendation_payload["sentiment_summary"],
            "total_records": int(sentiment_results.shape[0]),
            "predictions_sample": sentiment_preview.to_dict(orient="records"),
            "model_dir": str(args.sentiment_model_dir),
        },
        "topics": {
            "insights": recommendation_payload["topic_insights"],
            "overview": topic_records,
            "model_dir": str(topic_dir),
        },
        "segments": {
            "summary": recommendation_payload["segment_summary"],
            "profiles": recommendation_payload["segment_profiles"],
            "records_sample": segment_preview.to_dict(orient="records") if not segment_preview.empty else [],
        },
        "recommendations": recommendation_payload["recommendations"],
    }

    safe_output = _sanitize_for_json(output_payload)

    if args.output_json:
        output_path = Path(args.output_json)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(json.dumps(safe_output, ensure_ascii=False, indent=2), encoding="utf-8")

    if args.output_format == "json":
        print(json.dumps(safe_output, ensure_ascii=False))
    else:
        print("=== MANAGER RECOMMENDATIONS ===")
        for idx, recommendation in enumerate(safe_output["recommendations"], start=1):
            print(f"{idx}. {recommendation}")
        print("\nSales forecast metrics:", safe_output["forecast"]["metrics"])
        print("Sentiment summary:", safe_output["sentiment"]["summary"])
        if safe_output["segments"]["summary"]:
            print("Segment summary:", safe_output["segments"]["summary"])


if __name__ == "__main__":
    main()

