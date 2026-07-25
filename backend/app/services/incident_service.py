from uuid import UUID
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.exceptions import NotFoundException
from app.models.incident import IncidentReport
from datetime import datetime, timezone

async def list_incidents(db: AsyncSession, page: int = 1, page_size: int = 20, student_id: UUID | None = None):
    query = select(IncidentReport)
    count_q = select(func.count()).select_from(IncidentReport)
    if student_id:
        query = query.where(IncidentReport.student_id == student_id)
        count_q = count_q.where(IncidentReport.student_id == student_id)
    total = (await db.execute(count_q)).scalar() or 0
    result = await db.execute(query.order_by(IncidentReport.incident_date.desc()).offset((page-1)*page_size).limit(page_size))
    return list(result.scalars().all()), total

async def create_incident(db: AsyncSession, data, reporter_id: UUID):
    inc = IncidentReport(
        student_id=data.student_id, reporter_id=reporter_id,
        incident_date=datetime.now(timezone.utc), incident_type=data.incident_type,
        severity=data.severity, location=data.location, description=data.description,
        antecedents=data.antecedents, consequences=data.consequences, action_taken=data.action_taken,
    )
    db.add(inc); await db.flush(); await db.refresh(inc)
    return inc

async def update_incident(db: AsyncSession, incident_id: UUID, data):
    result = await db.execute(select(IncidentReport).where(IncidentReport.id == incident_id))
    inc = result.scalar_one_or_none()
    if not inc: raise NotFoundException("事件不存在")
    update = data.model_dump(exclude_unset=True)
    for k, v in update.items(): setattr(inc, k, v)
    if data.is_resolved: inc.resolved_at = datetime.now(timezone.utc)
    await db.flush(); await db.refresh(inc)
    return inc
