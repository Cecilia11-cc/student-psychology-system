from uuid import UUID
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.permissions import require_staff
from app.dependencies import get_db
from app.schemas.common import DataResponse, PaginatedResponse
from app.services import incident_service
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/incidents", tags=["事件报告"])

class IncidentCreate(BaseModel):
    student_id: UUID
    incident_type: str
    severity: str | None = None
    location: str | None = None
    description: str
    antecedents: str | None = None
    consequences: str | None = None
    action_taken: str | None = None

class IncidentUpdate(BaseModel):
    follow_up_notes: str | None = None
    is_resolved: bool | None = None
    action_taken: str | None = None

@router.get("")
async def list_incidents(
    page: int = Query(1, ge=1), page_size: int = Query(20, ge=1, le=100),
    student_id: UUID | None = None,
    db: AsyncSession = Depends(get_db), _=Depends(require_staff),
):
    incidents, total = await incident_service.list_incidents(db, page, page_size, student_id)
    return PaginatedResponse(data=incidents, pagination={"page": page, "page_size": page_size, "total": total, "total_pages": max(1, (total+page_size-1)//page_size)})

@router.post("")
async def create_incident(data: IncidentCreate, db: AsyncSession = Depends(get_db), user=Depends(require_staff)):
    inc = await incident_service.create_incident(db, data, UUID(user["sub"]))
    return DataResponse(data={"id": str(inc.id)}, message="事件报告成功")

@router.put("/{incident_id}")
async def update_incident(incident_id: UUID, data: IncidentUpdate, db: AsyncSession = Depends(get_db), _=Depends(require_staff)):
    inc = await incident_service.update_incident(db, incident_id, data)
    return DataResponse(data={"id": str(inc.id)}, message="更新成功")
