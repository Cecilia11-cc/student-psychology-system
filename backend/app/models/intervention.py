from datetime import date, datetime

from sqlalchemy import Boolean, Date, DateTime, Float, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin


class InterventionPlan(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "intervention_plans"

    student_id: Mapped[str] = mapped_column(
        ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True
    )
    created_by: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(256), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    target_dimensions: Mapped[dict] = mapped_column(JSONB, nullable=False, default=list)
    status: Mapped[str] = mapped_column(String(20), default="draft", index=True)
    start_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    target_end_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    actual_end_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    review_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    goals: Mapped[dict] = mapped_column(JSONB, nullable=False, default=list)
    strategies: Mapped[dict] = mapped_column(JSONB, nullable=False, default=list)
    effectiveness_rating: Mapped[float | None] = mapped_column(Float, nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Relationships
    student = relationship("Student", back_populates="intervention_plans", lazy="selectin")
    creator = relationship("User", back_populates="intervention_plans", lazy="selectin")


class InterventionSuggestion(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "intervention_suggestions"

    student_id: Mapped[str] = mapped_column(
        ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True
    )
    generated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.now
    )
    suggestion_type: Mapped[str | None] = mapped_column(String(30), nullable=True)
    title: Mapped[str] = mapped_column(String(256), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    evidence_rationale: Mapped[str | None] = mapped_column(Text, nullable=True)
    priority: Mapped[str | None] = mapped_column(String(10), nullable=True, index=True)
    source_method: Mapped[str | None] = mapped_column(String(20), nullable=True)
    similar_case_ids: Mapped[dict] = mapped_column(JSONB, default=list)
    similarity_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    expected_effectiveness: Mapped[float | None] = mapped_column(Float, nullable=True)
    is_adopted: Mapped[bool] = mapped_column(Boolean, default=False)
    adopted_plan_id: Mapped[str | None] = mapped_column(
        ForeignKey("intervention_plans.id"), nullable=True
    )

    # Relationships
    student = relationship("Student", back_populates="intervention_suggestions", lazy="selectin")
