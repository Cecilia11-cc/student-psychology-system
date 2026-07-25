from datetime import date

from sqlalchemy import Boolean, Date, ForeignKey, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin


class Assessment(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "assessments"

    student_id: Mapped[str] = mapped_column(
        ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True
    )
    psychologist_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False)
    assessment_type: Mapped[str] = mapped_column(String(50), nullable=False)
    assessment_date: Mapped[date] = mapped_column(Date, nullable=False)
    assessment_period: Mapped[str | None] = mapped_column(String(50), nullable=True)
    overall_impression: Mapped[str | None] = mapped_column(Text, nullable=True)
    clinical_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="draft", index=True)
    is_confidential: Mapped[bool] = mapped_column(Boolean, default=True)

    # Relationships
    student = relationship("Student", back_populates="assessments", lazy="selectin")
    scores = relationship(
        "AssessmentScore", back_populates="assessment", lazy="selectin", cascade="all, delete-orphan"
    )


class AssessmentScore(Base, UUIDMixin):
    __tablename__ = "assessment_scores"
    __table_args__ = (UniqueConstraint("assessment_id", "dimension_id"),)

    assessment_id: Mapped[str] = mapped_column(
        ForeignKey("assessments.id", ondelete="CASCADE"), nullable=False
    )
    dimension_id: Mapped[str] = mapped_column(
        ForeignKey("behavioral_dimensions.id"), nullable=False
    )
    raw_score: Mapped[float | None] = mapped_column(nullable=True)
    normalized_score: Mapped[float | None] = mapped_column(nullable=True)
    percentile: Mapped[float | None] = mapped_column(nullable=True)
    clinical_range: Mapped[str | None] = mapped_column(String(20), nullable=True)
    interpretation: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Relationships
    assessment = relationship("Assessment", back_populates="scores", lazy="selectin")
    dimension = relationship("BehavioralDimension", lazy="selectin")
