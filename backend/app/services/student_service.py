from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.exceptions import NotFoundException
from app.models.student import Student, StudentParent
from app.schemas.student import StudentCreate, StudentUpdate


async def get_student(db: AsyncSession, student_id: UUID) -> Student:
    result = await db.execute(
        select(Student)
        .options(selectinload(Student.current_class), selectinload(Student.school))
        .where(Student.id == student_id)
    )
    student = result.scalar_one_or_none()
    if not student:
        raise NotFoundException("学生不存在")
    return student


async def get_student_profile(db: AsyncSession, student_id: UUID) -> Student:
    result = await db.execute(
        select(Student)
        .options(
            selectinload(Student.current_class),
            selectinload(Student.school),
            selectinload(Student.labels),
            selectinload(Student.parents).selectinload(StudentParent.parent),
        )
        .where(Student.id == student_id)
    )
    student = result.scalar_one_or_none()
    if not student:
        raise NotFoundException("学生不存在")
    return student


async def list_students(
    db: AsyncSession,
    page: int = 1,
    page_size: int = 20,
    class_id: UUID | None = None,
    school_id: UUID | None = None,
    grade_level: str | None = None,
    search: str | None = None,
    is_active: bool = True,
) -> tuple[list[Student], int]:
    query = select(Student).options(
        selectinload(Student.current_class)
    )
    count_query = select(func.count()).select_from(Student)

    if class_id:
        query = query.where(Student.current_class_id == class_id)
        count_query = count_query.where(Student.current_class_id == class_id)
    if school_id:
        query = query.where(Student.school_id == school_id)
        count_query = count_query.where(Student.school_id == school_id)
    if grade_level:
        query = query.where(Student.grade_level == grade_level)
        count_query = count_query.where(Student.grade_level == grade_level)
    if search:
        query = query.where(Student.full_name.ilike(f"%{search}%"))
        count_query = count_query.where(Student.full_name.ilike(f"%{search}%"))

    query = query.where(Student.is_active == is_active)
    count_query = count_query.where(Student.is_active == is_active)

    # Count
    result = await db.execute(count_query)
    total = result.scalar() or 0

    # Paginate
    query = query.order_by(Student.full_name).offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(query)
    students = list(result.scalars().all())

    return students, total


async def create_student(db: AsyncSession, data: StudentCreate) -> Student:
    student = Student(**data.model_dump())
    db.add(student)
    await db.flush()
    await db.refresh(student)
    return student


async def update_student(db: AsyncSession, student_id: UUID, data: StudentUpdate) -> Student:
    student = await get_student(db, student_id)
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(student, key, value)
    await db.flush()
    await db.refresh(student)
    return student


async def link_parent(
    db: AsyncSession, student_id: UUID, parent_id: UUID, relationship_type: str,
    is_primary: bool = False
) -> StudentParent:
    link = StudentParent(
        student_id=student_id,
        parent_id=parent_id,
        relationship_type=relationship_type,
        is_primary_contact=is_primary,
    )
    db.add(link)
    await db.flush()
    return link
