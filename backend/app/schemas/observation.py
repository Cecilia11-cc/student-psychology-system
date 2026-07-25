from datetime import date, datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class ObservationScoreCreate(BaseModel):
    dimension_id: UUID
    score: float = Field(ge=0, le=100)
    raw_score: Optional[float] = None
    notes: Optional[str] = None


class ObservationCreate(BaseModel):
    student_id: UUID
    template_id: Optional[UUID] = None
    observation_date: date
    period: Optional[str] = Field(None, pattern="^(morning|afternoon|all_day|specific_activity)$")
    context: Optional[str] = None
    duration_minutes: Optional[int] = None
    narrative_notes: Optional[str] = None
    mood_at_observation: Optional[str] = None
    scores: list[ObservationScoreCreate] = []


class BatchObservationCreate(BaseModel):
    template_id: Optional[UUID] = None
    date: date
    observations: list[dict]  # [{student_id, scores: [{dimension_id, score}]}]


class ObservationScoreResponse(BaseModel):
    id: UUID
    dimension_id: UUID
    dimension_name: Optional[str] = None
    score: float
    raw_score: Optional[float] = None
    notes: Optional[str] = None

    model_config = {"from_attributes": True}


class ObservationResponse(BaseModel):
    id: UUID
    student_id: UUID
    teacher_id: UUID
    template_id: Optional[UUID] = None
    observation_date: date
    period: Optional[str] = None
    context: Optional[str] = None
    duration_minutes: Optional[int] = None
    narrative_notes: Optional[str] = None
    mood_at_observation: Optional[str] = None
    scores: list[ObservationScoreResponse] = []
    created_at: datetime

    model_config = {"from_attributes": True}


class ObservationTemplateCreate(BaseModel):
    name: str = Field(max_length=256)
    description: Optional[str] = None
    applicable_grade_levels: list[str] = []
    frequency: Optional[str] = None
    dimension_ids: list[UUID]
    custom_questions: list[dict] = []


class ObservationTemplateResponse(BaseModel):
    id: UUID
    name: str
    description: Optional[str] = None
    applicable_grade_levels: list = []
    frequency: Optional[str] = None
    dimension_ids: list = []
    custom_questions: list = []
    is_system: bool
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}
