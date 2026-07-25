from datetime import date

from sqlalchemy import Boolean, Date, ForeignKey, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin


class Student(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "students"

    student_code: Mapped[str] = mapped_column(String(32), unique=True, nullable=False, index=True)
    full_name: Mapped[str] = mapped_column(String(128), nullable=False, index=True)
    gender: Mapped[str | None] = mapped_column(String(10), nullable=True)
    birth_date: Mapped[date] = mapped_column(Date, nullable=False)
    school_id: Mapped[str] = mapped_column(ForeignKey("schools.id"), nullable=False)
    current_class_id: Mapped[str | None] = mapped_column(
        ForeignKey("classes.id"), nullable=True
    )
    grade_level: Mapped[str | None] = mapped_column(String(20), nullable=True)
    enrollment_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    medical_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    special_needs: Mapped[str | None] = mapped_column(Text, nullable=True)
    family_structure: Mapped[str | None] = mapped_column(String(50), nullable=True)
    socioeconomic_status: Mapped[str | None] = mapped_column(String(50), nullable=True)
    profile_photo_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    # Relationships
    school = relationship("School", back_populates="students", lazy="selectin")
    current_class = relationship("Class", back_populates="students", lazy="selectin")
    parents = relationship("StudentParent", back_populates="student", lazy="selectin")
    observations = relationship("Observation", back_populates="student", lazy="selectin")
    assessments = relationship("Assessment", back_populates="student", lazy="selectin")
    incidents = relationship("IncidentReport", back_populates="student", lazy="selectin")
    risk_assessments = relationship("RiskAssessment", back_populates="student", lazy="selectin")
    learning_patterns = relationship("LearningPattern", back_populates="student", lazy="selectin")
    academic_records = relationship("AcademicRecord", back_populates="student", lazy="selectin")
    academic_predictions = relationship("AcademicPrediction", back_populates="student", lazy="selectin")
    intervention_plans = relationship("InterventionPlan", back_populates="student", lazy="selectin")
    intervention_suggestions = relationship("InterventionSuggestion", back_populates="student", lazy="selectin")
    reports = relationship("Report", back_populates="student", lazy="selectin")
    labels = relationship("StudentLabel", back_populates="student", lazy="selectin")


class StudentParent(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "student_parents"
    __table_args__ = (UniqueConstraint("student_id", "parent_id"),)

    student_id: Mapped[str] = mapped_column(
        ForeignKey("students.id", ondelete="CASCADE"), nullable=False
    )
    parent_id: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    relationship_type: Mapped[str] = mapped_column(String(30), nullable=False)
    is_primary_contact: Mapped[bool] = mapped_column(Boolean, default=False)
    can_view_reports: Mapped[bool] = mapped_column(Boolean, default=True)

    # Relationships
    student = relationship("Student", back_populates="parents", lazy="selectin")
    parent = relationship("User", back_populates="student_parents", lazy="selectin")
