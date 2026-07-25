from sqlalchemy import Boolean, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDMixin


class BehavioralDimension(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "behavioral_dimensions"

    code: Mapped[str] = mapped_column(String(32), unique=True, nullable=False, index=True)
    name_zh: Mapped[str] = mapped_column(String(128), nullable=False)
    name_en: Mapped[str | None] = mapped_column(String(128), nullable=True)
    category: Mapped[str] = mapped_column(
        String(30), nullable=False, index=True
    )  # social, emotional, cognitive, behavioral, developmental, academic, family, physical
    applicable_age_range: Mapped[str | None] = mapped_column(
        String(20), nullable=True
    )  # kindergarten, elementary, both
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    scoring_scale: Mapped[dict] = mapped_column(
        JSONB,
        nullable=False,
        default=lambda: [
            {"level": 1, "label_zh": "从不", "label_en": "Never"},
            {"level": 2, "label_zh": "偶尔", "label_en": "Rarely"},
            {"level": 3, "label_zh": "有时", "label_en": "Sometimes"},
            {"level": 4, "label_zh": "经常", "label_en": "Often"},
            {"level": 5, "label_zh": "总是", "label_en": "Always"},
        ],
    )
    is_negative_indicator: Mapped[bool] = mapped_column(Boolean, default=False)
    weight_default: Mapped[float] = mapped_column(default=0.100)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
