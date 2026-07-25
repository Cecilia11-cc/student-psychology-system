"""Configurable weight definitions per behavioral dimension."""

DEFAULT_DIMENSION_WEIGHTS = {
    # Emotional (total: 0.30)
    "EMO_REG": 0.080, "EMO_EXP": 0.040, "EMO_EMP": 0.030,
    "EMO_ANX": 0.070, "EMO_MOOD": 0.050, "EMO_SELF": 0.030,
    # Behavioral (total: 0.25)
    "BEH_AGG": 0.070, "BEH_DISR": 0.050, "BEH_HYPR": 0.040,
    "BEH_ATTN": 0.050, "BEH_TASK": 0.020, "BEH_SELF": 0.010,
    "BEH_TRAN": 0.005, "BEH_STIM": 0.005,
    # Social (total: 0.20)
    "SOC_PEER": 0.050, "SOC_COOP": 0.030, "SOC_CONF": 0.030,
    "SOC_ISOL": 0.040, "SOC_RULE": 0.030, "SOC_COMM": 0.020,
    # Cognitive/Academic (total: 0.10)
    "COG_LANG": 0.025, "COG_PROB": 0.020, "COG_CURI": 0.010,
    "COG_MEM": 0.015, "COG_READ": 0.015, "COG_MATH": 0.015,
    # Developmental (total: 0.10)
    "DEV_MOTR": 0.030, "DEV_SPCH": 0.030, "DEV_SENS": 0.020,
    "DEV_SLEP": 0.010, "DEV_FOOD": 0.010,
    # Family (total: 0.05)
    "FAM_INV": 0.015, "FAM_STR": 0.020, "FAM_CONS": 0.010, "FAM_SCRE": 0.005,
}

RISK_LEVELS = [
    (0, 25, "low", "低风险"),
    (26, 50, "moderate", "中等风险"),
    (51, 75, "high", "高风险"),
    (76, 100, "critical", "严重风险"),
]

RISK_COLORS = {"low": "#52c41a", "moderate": "#faad14", "high": "#ff7a45", "critical": "#ff4d4f"}
