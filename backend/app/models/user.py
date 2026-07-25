from sqlalchemy import Boolean, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin


class User(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "users"

    username: Mapped[str] = mapped_column(String(64), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(256), nullable=False)
    email: Mapped[str | None] = mapped_column(String(128), unique=True, nullable=True)
    phone: Mapped[str | None] = mapped_column(String(20), nullable=True)
    full_name: Mapped[str] = mapped_column(String(128), nullable=False)
    role: Mapped[str] = mapped_column(
        String(20), nullable=False, index=True
    )  # admin, teacher, psychologist, parent
    school_id: Mapped[str | None] = mapped_column(ForeignKey("schools.id"), nullable=True)
    avatar_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    data_access_level: Mapped[str] = mapped_column(
        String(20), default="own"
    )  # own_class, own_school, all, own_children

    # Relationships
    school = relationship("School", back_populates="users", lazy="selectin")
    homeroom_class = relationship("Class", back_populates="homeroom_teacher", lazy="selectin")
    observations = relationship("Observation", back_populates="teacher", lazy="selectin")
    incidents = relationship("IncidentReport", back_populates="reporter", lazy="selectin")
    student_parents = relationship("StudentParent", back_populates="parent", lazy="selectin")
    intervention_plans = relationship("InterventionPlan", back_populates="creator", lazy="selectin")
    reports = relationship("Report", back_populates="generator", lazy="selectin")
