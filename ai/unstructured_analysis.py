"""
Utilities for working with unstructured customer feedback. The sentiment
pipeline assumes a fine-tuned Hugging Face model saved locally, while topic
modeling uses BERTopic with modern sentence transformers.
"""

from __future__ import annotations

from pathlib import Path
from typing import Iterable, List, Optional, Sequence, Tuple

import pandas as pd
from bertopic import BERTopic
from sentence_transformers import SentenceTransformer
from transformers import pipeline


def load_sentiment_model(
    model_path: str = "ai/models/sentiment_finetuned_model",
    fallback_model: str = "distilbert-base-uncased-finetuned-sst-2-english",
):
    """Load a fine-tuned Hugging Face sentiment-analysis pipeline.

    If the project-specific model is missing, gracefully fall back to a widely
    available public checkpoint so the pipeline can still run.
    """
    resolved_path = Path(model_path)
    if resolved_path.exists():
        print(f"Loading fine-tuned sentiment model from: {resolved_path}")
        return pipeline("sentiment-analysis", model=str(resolved_path), tokenizer=str(resolved_path))

    print(
        f"[Sentiment] Fine-tuned model not found at `{resolved_path}`. "
        f"Falling back to Hugging Face model `{fallback_model}`."
    )
    return pipeline("sentiment-analysis", model=fallback_model, tokenizer=fallback_model)


def analyze_sentiment_batch(
    texts: Sequence[str],
    sentiment_pipeline=None,
    model_path: str = "ai/models/sentiment_finetuned_model",
    fallback_model: str = "distilbert-base-uncased-finetuned-sst-2-english",
) -> pd.DataFrame:
    """Run batched sentiment analysis over a list of texts."""
    if not texts:
        return pd.DataFrame(columns=["text", "label", "score"])

    if sentiment_pipeline is None:
        try:
            sentiment_pipeline = load_sentiment_model(
                model_path=model_path, fallback_model=fallback_model
            )
        except FileNotFoundError:
            sentiment_pipeline = load_sentiment_model(
                model_path="ai/models/sentiment_finetuned_model", fallback_model=fallback_model
            )

    results = sentiment_pipeline(list(texts), truncation=True)
    output = pd.DataFrame(results)
    output.insert(0, "text", texts)
    return output


def train_topic_model(
    documents: Iterable[str],
    embedding_model_name: str = "sentence-transformers/all-MiniLM-L6-v2",
    save_dir: str = "ai/models/topic_model",
    min_topic_size: int = 10,
    verbose: bool = True,
) -> BERTopic:
    """Train a BERTopic model on the provided documents and persist it."""
    documents = [doc for doc in documents if isinstance(doc, str) and doc.strip()]
    if not documents:
        raise ValueError("No valid documents provided for topic modeling.")

    embedding_model = SentenceTransformer(embedding_model_name)
    topic_model = BERTopic(
        embedding_model=embedding_model,
        min_topic_size=min_topic_size,
        verbose=verbose,
    )

    topic_model.fit(documents)
    save_path = Path(save_dir)
    save_path.mkdir(parents=True, exist_ok=True)
    topic_model.save(str(save_path), serialization="safetensors", save_ctfidf=True)

    return topic_model


def get_topics_for_book(
    topic_model: BERTopic,
    documents: Sequence[str],
    top_n: int = 3,
) -> List[Tuple[int, float]]:
    """Derive the most representative topics for a collection of documents."""
    if topic_model is None:
        raise ValueError("A trained BERTopic model must be provided.")

    docs = [doc for doc in documents if isinstance(doc, str) and doc.strip()]
    if not docs:
        return []

    topics, probs = topic_model.transform(docs)
    topic_scores = {}
    for topic, prob in zip(topics, probs):
        if topic == -1:
            continue
        topic_scores[topic] = topic_scores.get(topic, 0.0) + float(prob)

    ranked_topics = sorted(topic_scores.items(), key=lambda item: item[1], reverse=True)
    return ranked_topics[:top_n]


__all__ = [
    "load_sentiment_model",
    "analyze_sentiment_batch",
    "train_topic_model",
    "get_topics_for_book",
]

