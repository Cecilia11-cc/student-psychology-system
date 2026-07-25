from datetime import date, datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class StudentBase(BaseModel):
    student_code: str = Field(max_length=32)
    full_name: str = Field(max_length=128)
    gender: Optional[str] = Field(None, pattern="^(male|female|other)$")
    birth_date: date
    grade_level: Optional[str] = None
    enrollment_date: Optional[date] = None
    medical_notes: Optional[str] = None
    special_needs: Optional[str] = None
    family_structure: Optional[str] = None
    socioeconomic_status: Optional[str] = None


class StudentCreate(StudentBase):
    school_id: UUID
    current_class_id: Optional[UUID] = None


class StudentUpdate(BaseModel):
    full_name: Optional[str] = None
    gender: Optional[str] = None
    grade_level: Optional[str] = None
    current_class_id: Optional[UUID] = None
    medical_notes: Optional[str] = None
    special_needs: Optional[str] = None
    family_structure: Optional[str] = None
    socioeconomic_status: Optional[str] = None
    is_active: Optional[bool] = None


class StudentResponse(BaseModel):
    id: UUID
    student_code: str
    full_name: str
    gender: Optional[str] = None
    birth_date: date
    school_id: UUID
    current_class_id: Optional[UUID] = None
    grade_level: Optional[str] = None
    enrollment_date: Optional[date] = None
    medical_notes: Optional[str] = None
    special_needs: Optional[str] = None
    family_structure: Optional[str] = None
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class StudentListResponse(StudentResponse):
    """Extends student with summary stats."""
    risk_level: Optional[str] = None
    risk_score: Optional[float] = None
    label_count: int = 0


class StudentProfileResponse(StudentResponse):
    """Full student profile with relationships."""
    risk_level: Optional[str] = None
    risk_score: Optional[float] = None
    labels: list[dict] = []
    recent_observations: list[dict] = []
    recent_incidents: list[dict] = []


class StudentParentLink(BaseModel):
    parent_id: UUID
    relationship_type: str = Field(pattern="^(father|mother|grandfather|grandmother|guardian|other)$")
    is_primary_contact: bool = False
    can_view_reports: bool = True
