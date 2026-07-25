"""
Multi-Factor Weighted Risk Scoring Engine.

Risk formula:
  Risk_Score = sum(weight_i × normalized_score_i) × severity_multiplier × recency_factor

Normalized to 0-100 scale. Risk levels:
  Low (0-25) → Moderate (26-50) → High (51-75) → Critical (76-100)
"""

import math
import numpy as np
from datetime import datetime, timezone, timedelta
from app.ml.weights import DEFAULT_DIMENSION_WEIGHTS, RISK_LEVELS


def classify_risk_level(score: float) -> tuple[str, str]:
    for lo, hi, level, label in RISK_LEVELS:
        if lo <= score <= hi:
            return level, label
    return "critical", "严重风险"


def apply_recency_decay(scores_with_dates: list[tuple[float, float, datetime]], half_life_days: float = 45.0) -> float:
    """Apply exponential recency decay to scores. More recent = higher weight."""
    if not scores_with_dates:
        return 0.0
    now = datetime.now(timezone.utc)
    weighted_sum = 0.0
    weight_sum = 0.0
    decay_rate = math.log(2) / half_life_days
    for score, weight, date in scores_with_dates:
        days_ago = (now - date).days
        decay = math.exp(-decay_rate * max(days_ago, 0))
        weighted_sum += score * weight * decay
        weight_sum += weight * decay
    return weighted_sum / max(weight_sum, 0.001)


def calculate_risk_score(
    dimension_scores: dict[str, float],       # {dim_code: normalized_score (0-100)}
    observation_count: int = 0,
    has_major_incident: bool = False,
    has_critical_incident: bool = False,
    has_self_harm: bool = False,
    weights: dict[str, float] | None = None,
) -> dict:
    """
    Calculate multi-factor weighted risk score.

    Args:
        dimension_scores: {dimension_code: 0-100 normalized score} where high=bad
        observation_count: number of observations used
        has_major_incident: major incident in period
        has_critical_incident: critical incident in period
        has_self_harm: self-harm incident present
        weights: optional custom weights, defaults to DEFAULT_DIMENSION_WEIGHTS

    Returns:
        dict with overall_risk_score, risk_level, risk_label, factor_breakdown, confidence
    """
    w = weights or DEFAULT_DIMENSION_WEIGHTS

    # Calculate weighted sum
    total_weight = 0.0
    weighted_sum = 0.0
    factor_breakdown = []

    for dim_code, score in dimension_scores.items():
        dim_weight = w.get(dim_code, 0.05)
        contribution = dim_weight * score
        weighted_sum += contribution
        total_weight += dim_weight
        factor_breakdown.append({
            "dimension_code": dim_code,
            "score": round(score, 2),
            "weight": dim_weight,
            "contribution": round(contribution, 2),
            "contribution_pct": 0.0,
        })

    # Normalize by total weight
    if total_weight > 0:
        base_score = weighted_sum / total_weight
    else:
        base_score = 0.0

    # Calculate contribution percentages
    if weighted_sum > 0:
        for f in factor_breakdown:
            f["contribution_pct"] = round(f["contribution"] / weighted_sum * 100, 2)

    # Sort by contribution descending
    factor_breakdown.sort(key=lambda x: x["contribution"], reverse=True)

    # Severity multiplier
    severity_multiplier = 1.0
    if has_critical_incident:
        severity_multiplier *= 2.0
    elif has_major_incident:
        severity_multiplier *= 1.5
    if has_self_harm:
        severity_multiplier *= 3.0

    overall_score = min(round(base_score * severity_multiplier, 2), 100.0)
    level, label = classify_risk_level(overall_score)

    # Confidence: increases with more observations (saturates at ~20 observations)
    confidence = round(1.0 - math.exp(-observation_count / 10.0), 3)

    return {
        "overall_risk_score": overall_score,
        "risk_level": level,
        "risk_label": label,
        "factor_breakdown": factor_breakdown,
        "top_factors": factor_breakdown[:3],
        "confidence": confidence,
        "observation_count": observation_count,
        "severity_multiplier": severity_multiplier,
    }
