from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.permissions import get_current_user, require_staff
from app.dependencies import get_db
from app.schemas.common import DataResponse, PaginatedResponse
from app.schemas.observation import (
    BatchObservationCreate,
    ObservationCreate,
    ObservationResponse,
    ObservationTemplateCreate,
    ObservationTemplateResponse,
)
from app.services import observation_service

router = APIRouter(prefix="/observations", tags=["观察记录"])


@router.get("", response_model=PaginatedResponse)
async def list_observations(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    student_id: UUID | None = None,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(require_staff),
):
    teacher_id = None
    if current_user.get("role") == "teacher":
        teacher_id = UUID(current_user["sub"])

    observations, total = await observation_service.list_observations(
        db, page, page_size, student_id, teacher_id
    )

    return PaginatedResponse(
        data=[ObservationResponse.model_validate(o) for o in observations],
        pagination={
            "page": page,
            "page_size": page_size,
            "total": total,
            "total_pages": max(1, (total + page_size - 1) // page_size),
        },
    )


@router.post("", response_model=DataResponse[ObservationResponse])
async def create_observation(
    data: ObservationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(require_staff),
):
    obs = await observation_service.create_observation(
        db, data, UUID(current_user["sub"])
    )
    # Reload with relationships
    obs = await observation_service.get_observation(db, obs.id)
    return DataResponse(
        data=ObservationResponse.model_validate(obs), message="观察记录成功"
    )


@router.post("/batch", response_model=DataResponse)
async def batch_create_observations(
    data: BatchObservationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(require_staff),
):
    observations = await observation_service.batch_create_observations(
        db, data, UUID(current_user["sub"])
    )
    return DataResponse(
        data={"count": len(observations)}, message=f"成功批量录入 {len(observations)} 条观察"
    )


@router.get("/{obs_id}", response_model=DataResponse[ObservationResponse])
async def get_observation(
    obs_id: UUID,
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(require_staff),
):
    obs = await observation_service.get_observation(db, obs_id)
    return DataResponse(data=ObservationResponse.model_validate(obs))


# Templates
templates_router = APIRouter(prefix="/observations/templates", tags=["观察模板"])


@templates_router.get("", response_model=DataResponse[list[ObservationTemplateResponse]])
async def list_templates(
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(require_staff),
):
    templates = await observation_service.list_templates(db)
    return DataResponse(
        data=[ObservationTemplateResponse.model_validate(t) for t in templates]
    )


@templates_router.post("", response_model=DataResponse[ObservationTemplateResponse])
async def create_template(
    data: ObservationTemplateCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(require_staff),
):
    template = await observation_service.create_template(
        db, data, UUID(current_user["sub"])
    )
    return DataResponse(
        data=ObservationTemplateResponse.model_validate(template), message="模板创建成功"
    )
