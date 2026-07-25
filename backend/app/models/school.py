from sqlalchemy import Boolean, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin


class School(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "schools"

    name: Mapped[str] = mapped_column(String(256), nullable=False)
    school_type: Mapped[str] = mapped_column(
        String(20), nullable=False
    )  # kindergarten, elementary
    district: Mapped[str | None] = mapped_column(String(128), nullable=True)
    address: Mapped[str | None] = mapped_column(Text, nullable=True)
    contact_phone: Mapped[str | None] = mapped_column(String(20), nullable=True)

    # Relationships
    users = relationship("User", back_populates="school", lazy="selectin")
    classes = relationship("Class", back_populates="school", lazy="selectin")
    students = relationship("Student", back_populates="school", lazy="selectin")


class Class(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "classes"

    name: Mapped[str] = mapped_column(String(128), nullable=False)
    grade_level: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    school_id: Mapped[str] = mapped_column(ForeignKey("schools.id", ondelete="CASCADE"), nullable=False)
    homeroom_teacher_id: Mapped[str | None] = mapped_column(
        ForeignKey("users.id"), nullable=True
    )
    academic_year: Mapped[str] = mapped_column(String(9), nullable=False)
    student_count: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    # Relationships
    school = relationship("School", back_populates="classes", lazy="selectin")
    homeroom_teacher = relationship("User", back_populates="homeroom_class", lazy="selectin")
    students = relationship("Student", back_populates="current_class", lazy="selectin")
