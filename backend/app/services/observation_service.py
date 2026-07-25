from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.exceptions import NotFoundException
from app.models.observation import Observation, ObservationScore, ObservationTemplate
from app.schemas.observation import (
    BatchObservationCreate,
    ObservationCreate,
    ObservationTemplateCreate,
)


async def list_observations(
    db: AsyncSession,
    page: int = 1,
    page_size: int = 20,
    student_id: UUID | None = None,
    teacher_id: UUID | None = None,
) -> tuple[list[Observation], int]:
    query = select(Observation).options(
        selectinload(Observation.scores).selectinload(ObservationScore.dimension)
    )
    count_query = select(func.count()).select_from(Observation)

    if student_id:
        query = query.where(Observation.student_id == student_id)
        count_query = count_query.where(Observation.student_id == student_id)
    if teacher_id:
        query = query.where(Observation.teacher_id == teacher_id)
        count_query = count_query.where(Observation.teacher_id == teacher_id)

    count_result = await db.execute(count_query)
    total = count_result.scalar() or 0

    query = (
        query.order_by(Observation.observation_date.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    result = await db.execute(query)
    return list(result.scalars().all()), total


async def create_observation(db: AsyncSession, data: ObservationCreate, teacher_id: UUID) -> Observation:
    obs = Observation(
        student_id=data.student_id,
        teacher_id=teacher_id,
        template_id=data.template_id,
        observation_date=data.observation_date,
        period=data.period,
        context=data.context,
        duration_minutes=data.duration_minutes,
        narrative_notes=data.narrative_notes,
        mood_at_observation=data.mood_at_observation,
    )
    db.add(obs)
    await db.flush()

    for score_data in data.scores:
        score = ObservationScore(
            observation_id=obs.id,
            dimension_id=score_data.dimension_id,
            score=score_data.score,
            raw_score=score_data.raw_score,
            notes=score_data.notes,
        )
        db.add(score)

    await db.flush()
    await db.refresh(obs)
    return obs


async def batch_create_observations(
    db: AsyncSession, data: BatchObservationCreate, teacher_id: UUID
) -> list[Observation]:
    observations = []
    for item in data.observations:
        obs_data = ObservationCreate(
            student_id=item["student_id"],
            template_id=data.template_id,
            observation_date=data.date,
            scores=[
                {"dimension_id": s["dimension_id"], "score": s["score"]}
                for s in item.get("scores", [])
            ],
        )
        obs = await create_observation(db, obs_data, teacher_id)
        observations.append(obs)
    return observations


async def get_observation(db: AsyncSession, obs_id: UUID) -> Observation:
    result = await db.execute(
        select(Observation)
        .options(selectinload(Observation.scores).selectinload(ObservationScore.dimension))
        .where(Observation.id == obs_id)
    )
    obs = result.scalar_one_or_none()
    if not obs:
        raise NotFoundException("观察记录不存在")
    return obs


async def list_templates(
    db: AsyncSession, is_active: bool = True
) -> list[ObservationTemplate]:
    query = select(ObservationTemplate)
    if is_active:
        query = query.where(ObservationTemplate.is_active == True)
    result = await db.execute(query.order_by(ObservationTemplate.name))
    return list(result.scalars().all())


async def create_template(
    db: AsyncSession, data: ObservationTemplateCreate, user_id: UUID
) -> ObservationTemplate:
    template = ObservationTemplate(
        name=data.name,
        description=data.description,
        applicable_grade_levels=data.applicable_grade_levels,
        frequency=data.frequency,
        dimension_ids=[str(d) for d in data.dimension_ids],
        custom_questions=data.custom_questions,
        created_by=user_id,
    )
    db.add(template)
    await db.flush()
    await db.refresh(template)
    return template
