from datetime import date, datetime

from sqlalchemy import Boolean, Date, DateTime, Float, ForeignKey, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin


class AcademicRecord(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "academic_records"
    __table_args__ = (UniqueConstraint("student_id", "subject", "exam_type", "exam_date"),)

    student_id: Mapped[str] = mapped_column(
        ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True
    )
    subject: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    exam_type: Mapped[str | None] = mapped_column(String(30), nullable=True)
    score: Mapped[float] = mapped_column(Float, nullable=False)
    max_score: Mapped[float] = mapped_column(Float, default=100)
    exam_date: Mapped[date] = mapped_column(Date, nullable=False)
    term: Mapped[str] = mapped_column(String(20), nullable=False)
    teacher_comment: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Relationships
    student = relationship("Student", back_populates="academic_records", lazy="selectin")


class AcademicPrediction(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "academic_predictions"

    student_id: Mapped[str] = mapped_column(
        ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True
    )
    subject: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    predicted_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    confidence_lower: Mapped[float | None] = mapped_column(Float, nullable=True)
    confidence_upper: Mapped[float | None] = mapped_column(Float, nullable=True)
    at_risk: Mapped[bool] = mapped_column(Boolean, default=False)
    prediction_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.now
    )
    target_term: Mapped[str | None] = mapped_column(String(20), nullable=True)
    model_version: Mapped[str | None] = mapped_column(String(32), nullable=True)
    feature_importance: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    is_current: Mapped[bool] = mapped_column(Boolean, default=True)

    # Relationships
    student = relationship("Student", back_populates="academic_predictions", lazy="selectin")
