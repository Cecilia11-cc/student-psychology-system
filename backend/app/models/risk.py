from datetime import date, datetime

from sqlalchemy import Boolean, Date, DateTime, Float, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin


class RiskAssessment(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "risk_assessments"

    student_id: Mapped[str] = mapped_column(
        ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True
    )
    calculated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.now
    )
    overall_risk_score: Mapped[float] = mapped_column(Float, nullable=False)  # 0-100
    risk_level: Mapped[str] = mapped_column(
        String(20), nullable=False, index=True
    )  # low, moderate, high, critical
    risk_category: Mapped[str | None] = mapped_column(String(30), nullable=True)
    model_version: Mapped[str] = mapped_column(String(32), nullable=False)
    data_period_start: Mapped[date | None] = mapped_column(Date, nullable=True)
    data_period_end: Mapped[date | None] = mapped_column(Date, nullable=True)
    observation_count: Mapped[int] = mapped_column(Integer, default=0)
    confidence: Mapped[float] = mapped_column(Float, default=0.0)
    is_current: Mapped[bool] = mapped_column(Boolean, default=True, index=True)

    # Relationships
    student = relationship("Student", back_populates="risk_assessments", lazy="selectin")
    factors = relationship(
        "RiskFactorDetail",
        back_populates="risk_assessment",
        lazy="selectin",
        cascade="all, delete-orphan",
    )


class RiskFactorDetail(Base, UUIDMixin):
    __tablename__ = "risk_factor_details"

    risk_assessment_id: Mapped[str] = mapped_column(
        ForeignKey("risk_assessments.id", ondelete="CASCADE"), nullable=False
    )
    dimension_id: Mapped[str | None] = mapped_column(
        ForeignKey("behavioral_dimensions.id"), nullable=True
    )
    factor_name: Mapped[str] = mapped_column(String(128), nullable=False)
    score: Mapped[float] = mapped_column(Float, nullable=False)
    weight: Mapped[float] = mapped_column(Float, nullable=False)
    contribution_pct: Mapped[float | None] = mapped_column(Float, nullable=True)
    trend: Mapped[str | None] = mapped_column(String(10), nullable=True)
    supporting_evidence: Mapped[dict | None] = mapped_column(JSONB, nullable=True)

    # Relationships
    risk_assessment = relationship("RiskAssessment", back_populates="factors", lazy="selectin")
    dimension = relationship("BehavioralDimension", lazy="selectin")
