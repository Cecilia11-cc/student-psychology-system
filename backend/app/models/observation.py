from datetime import date

from sqlalchemy import Date, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin


class ObservationTemplate(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "observation_templates"

    name: Mapped[str] = mapped_column(String(256), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    applicable_grade_levels: Mapped[dict] = mapped_column(JSONB, default=list)
    frequency: Mapped[str | None] = mapped_column(String(20), nullable=True)
    dimension_ids: Mapped[dict] = mapped_column(JSONB, nullable=False, default=list)
    custom_questions: Mapped[dict] = mapped_column(JSONB, default=list)
    created_by: Mapped[str | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    is_system: Mapped[bool] = mapped_column(default=False)
    is_active: Mapped[bool] = mapped_column(default=True)


class Observation(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "observations"

    student_id: Mapped[str] = mapped_column(
        ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True
    )
    teacher_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    template_id: Mapped[str | None] = mapped_column(
        ForeignKey("observation_templates.id"), nullable=True
    )
    observation_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    period: Mapped[str | None] = mapped_column(String(20), nullable=True)
    context: Mapped[str | None] = mapped_column(String(50), nullable=True)
    duration_minutes: Mapped[int | None] = mapped_column(Integer, nullable=True)
    narrative_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    mood_at_observation: Mapped[str | None] = mapped_column(String(30), nullable=True)

    # Relationships
    student = relationship("Student", back_populates="observations", lazy="selectin")
    teacher = relationship("User", back_populates="observations", lazy="selectin")
    scores = relationship(
        "ObservationScore", back_populates="observation", lazy="selectin", cascade="all, delete-orphan"
    )


class ObservationScore(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "observation_scores"
    __table_args__ = (UniqueConstraint("observation_id", "dimension_id"),)

    observation_id: Mapped[str] = mapped_column(
        ForeignKey("observations.id", ondelete="CASCADE"), nullable=False
    )
    dimension_id: Mapped[str] = mapped_column(
        ForeignKey("behavioral_dimensions.id"), nullable=False
    )
    score: Mapped[float] = mapped_column(nullable=False)  # 0-100 normalized
    raw_score: Mapped[float | None] = mapped_column(nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Relationships
    observation = relationship("Observation", back_populates="scores", lazy="selectin")
    dimension = relationship("BehavioralDimension", lazy="selectin")
