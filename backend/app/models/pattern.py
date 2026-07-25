from datetime import date, datetime

from sqlalchemy import Boolean, Date, DateTime, Float, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin


class LearningPattern(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "learning_patterns"

    student_id: Mapped[str] = mapped_column(
        ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True
    )
    pattern_type: Mapped[str] = mapped_column(
        String(30), nullable=False, index=True
    )  # behavior_sequence, time_cluster, trend, trigger_response, peer_comparison
    pattern_name: Mapped[str] = mapped_column(String(256), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    confidence: Mapped[float] = mapped_column(Float, default=0.0)
    discovered_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.now
    )
    data_period_start: Mapped[date | None] = mapped_column(Date, nullable=True)
    data_period_end: Mapped[date | None] = mapped_column(Date, nullable=True)
    pattern_details: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)
    visualization_data: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    # Relationships
    student = relationship("Student", back_populates="learning_patterns", lazy="selectin")
