"""
Utilities for structured data analysis workflows, including sales forecasting
and customer segmentation. The feature-engineering approach takes inspiration
from public Olist analyses, but the implementation is custom to this project.
"""

from __future__ import annotations

from pathlib import Path
from typing import Dict, Iterable, Optional, Tuple

import joblib
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.metrics import mean_absolute_error, mean_squared_error
from sklearn.preprocessing import StandardScaler
from xgboost import XGBRegressor


def _ensure_parent_dir(path: Path) -> None:
    """Create parent directories for a path if they do not exist."""
    path.parent.mkdir(parents=True, exist_ok=True)


def _prepare_sales_features(
    sales_df: pd.DataFrame,
    target_col: str,
    date_col: str,
    lag_steps: Iterable[int],
    window_sizes: Iterable[int],
) -> Tuple[pd.DataFrame, Iterable[str]]:
    """Create lagged, rolling, and calendar features for time-series forecasting."""
    df = sales_df.copy()
    if date_col not in df or target_col not in df:
        raise KeyError(f"Columns `{date_col}` and `{target_col}` must be present.")

    df[date_col] = pd.to_datetime(df[date_col], errors="coerce")
    df = df.dropna(subset=[date_col, target_col]).sort_values(date_col)

    for lag in lag_steps:
        df[f"lag_{lag}"] = df[target_col].shift(lag)

    for window in window_sizes:
        df[f"rolling_mean_{window}"] = df[target_col].shift(1).rolling(window).mean()
        df[f"rolling_std_{window}"] = df[target_col].shift(1).rolling(window).std()

    dt = df[date_col].dt
    df["dayofweek"] = dt.dayofweek
    df["weekofyear"] = dt.isocalendar().week.astype(int)
    df["month"] = dt.month
    df["quarter"] = dt.quarter
    df["year"] = dt.year
    df["dayofmonth"] = dt.day
    df["is_weekend"] = df["dayofweek"].isin([5, 6]).astype(int)

    df = df.dropna()
    feature_cols = [col for col in df.columns if col not in {target_col, date_col}]
    return df, feature_cols


def train_forecasting_model(
    sales_data_df: pd.DataFrame,
    target_col: str = "daily_sales",
    date_col: str = "date",
    lag_steps: Iterable[int] = (1, 7, 14, 28),
    window_sizes: Iterable[int] = (7, 14, 28),
    model_path: str = "ai/models/sales_forecaster.pkl",
    test_size: float = 0.2,
    random_state: Optional[int] = 42,
) -> Dict[str, object]:
    """
    Train an XGBoost regressor for daily sales forecasting.

    Returns
    -------
    dict
        Dictionary containing evaluation metrics, the held-out forecast frame,
        model path, and the feature columns used during training.
    """
    feature_df, feature_cols = _prepare_sales_features(
        sales_data_df, target_col, date_col, lag_steps, window_sizes
    )

    if feature_df.empty:
        raise ValueError("Not enough data after feature engineering; check lag/window sizes.")

    split_index = int(len(feature_df) * (1 - test_size))
    if split_index <= 0 or split_index >= len(feature_df):
        raise ValueError("Adjust `test_size`; it yields an empty train or test set.")

    X_train = feature_df.iloc[:split_index][feature_cols]
    y_train = feature_df.iloc[:split_index][target_col]
    X_test = feature_df.iloc[split_index:][feature_cols]
    y_test = feature_df.iloc[split_index:][target_col]

    model = XGBRegressor(
        objective="reg:squarederror",
        n_estimators=600,
        learning_rate=0.05,
        max_depth=6,
        subsample=0.9,
        colsample_bytree=0.9,
        reg_lambda=1.0,
        reg_alpha=0.1,
        min_child_weight=3,
        random_state=random_state,
    )

    model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)
    predictions = model.predict(X_test)

    metrics = {
        "mae": float(mean_absolute_error(y_test, predictions)),
        "rmse": float(np.sqrt(mean_squared_error(y_test, predictions))),
        "mape": float(np.mean(np.abs((y_test - predictions) / np.clip(y_test, 1e-6, None)))),
    }

    model_output_path = Path(model_path)
    _ensure_parent_dir(model_output_path)
    joblib.dump({"model": model, "feature_columns": list(feature_cols)}, model_output_path)

    forecast_frame = feature_df.iloc[split_index:].copy()
    forecast_frame = forecast_frame[[date_col, target_col]]
    forecast_frame["prediction"] = predictions
    forecast_records = forecast_frame.reset_index(drop=True).to_dict(orient="records")

    return {
        "metrics": metrics,
        "forecast": forecast_records,
        "model_path": str(model_output_path),
        "feature_columns": list(feature_cols),
        "forecast_df": forecast_frame,
    }


def train_segmentation_model(
    orders_df: pd.DataFrame,
    customer_id_col: str = "customer_id",
    order_date_col: str = "order_date",
    monetary_value_col: str = "order_value",
    n_clusters: int = 4,
    scaler_path: str = "ai/models/customer_scaler.pkl",
    model_path: str = "ai/models/customer_segmenter.pkl",
    random_state: Optional[int] = 42,
) -> pd.DataFrame:
    """Train a KMeans model using RFM-inspired customer features."""
    df = orders_df.copy()
    missing = {customer_id_col, order_date_col, monetary_value_col} - set(df.columns)
    if missing:
        raise KeyError(f"Missing required columns: {missing}")

    df[order_date_col] = pd.to_datetime(df[order_date_col], errors="coerce")
    df = df.dropna(subset=[order_date_col, monetary_value_col, customer_id_col])

    snapshot_date = df[order_date_col].max() + pd.Timedelta(days=1)
    rfm = df.groupby(customer_id_col).agg(
        recency_days=(order_date_col, lambda x: (snapshot_date - x.max()).days),
        frequency=(order_date_col, "count"),
        monetary_value=(monetary_value_col, "sum"),
        avg_order_value=(monetary_value_col, "mean"),
    )

    scaler = StandardScaler()
    scaled_features = scaler.fit_transform(rfm)

    kmeans = KMeans(n_clusters=n_clusters, random_state=random_state, n_init="auto")
    kmeans.fit(scaled_features)

    rfm["segment"] = kmeans.labels_
    rfm["segment_size"] = rfm.groupby("segment")["segment"].transform("count")

    _ensure_parent_dir(Path(model_path))
    joblib.dump(scaler, scaler_path)
    joblib.dump(kmeans, model_path)

    return rfm.reset_index()


__all__ = ["train_forecasting_model", "train_segmentation_model"]

