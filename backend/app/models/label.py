from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin


class Label(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "labels"

    name_zh: Mapped[str] = mapped_column(String(128), unique=True, nullable=False)
    name_en: Mapped[str | None] = mapped_column(String(128), nullable=True)
    category: Mapped[str | None] = mapped_column(String(30), nullable=True, index=True)
    color_hex: Mapped[str] = mapped_column(String(7), default="#1890ff")
    icon: Mapped[str | None] = mapped_column(String(64), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_system: Mapped[bool] = mapped_column(Boolean, default=False)
    auto_assign_rules: Mapped[dict | None] = mapped_column(JSONB, nullable=True)

    # Relationships
    student_labels = relationship("StudentLabel", back_populates="label", lazy="selectin")


class StudentLabel(Base, UUIDMixin):
    __tablename__ = "student_labels"
    __table_args__ = (UniqueConstraint("student_id", "label_id"),)

    student_id: Mapped[str] = mapped_column(
        ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True
    )
    label_id: Mapped[str] = mapped_column(
        ForeignKey("labels.id", ondelete="CASCADE"), nullable=False
    )
    assigned_by: Mapped[str] = mapped_column(String(30), default="system")
    assigned_by_user_id: Mapped[str | None] = mapped_column(
        ForeignKey("users.id"), nullable=True
    )
    assigned_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.now
    )
    confidence: Mapped[float] = mapped_column(Float, default=1.0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, index=True)
    deactivated_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Relationships
    student = relationship("Student", back_populates="labels", lazy="selectin")
    label = relationship("Label", back_populates="student_labels", lazy="selectin")
