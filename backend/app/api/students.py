from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.permissions import get_current_user, require_staff, require_all
from app.dependencies import get_db
from app.schemas.common import DataResponse, PaginatedResponse
from app.schemas.student import (
    StudentCreate,
    StudentListResponse,
    StudentParentLink,
    StudentProfileResponse,
    StudentResponse,
    StudentUpdate,
)
from app.services import student_service

router = APIRouter(prefix="/students", tags=["学生管理"])


@router.get("", response_model=PaginatedResponse)
async def list_students(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    class_id: UUID | None = None,
    school_id: UUID | None = None,
    grade_level: str | None = None,
    search: str | None = None,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(require_staff),
):
    # Teacher sees only their class; parent sees their children
    if current_user.get("role") == "teacher":
        # TODO: filter by teacher's class
        pass

    students, total = await student_service.list_students(
        db, page, page_size, class_id, school_id, grade_level, search
    )

    return PaginatedResponse(
        data=[StudentListResponse.model_validate(s) for s in students],
        pagination={
            "page": page,
            "page_size": page_size,
            "total": total,
            "total_pages": max(1, (total + page_size - 1) // page_size),
        },
    )


@router.post("", response_model=DataResponse[StudentResponse])
async def create_student(
    data: StudentCreate,
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(require_staff),
):
    student = await student_service.create_student(db, data)
    return DataResponse(data=StudentResponse.model_validate(student), message="学生创建成功")


@router.get("/{student_id}", response_model=DataResponse[StudentResponse])
async def get_student(
    student_id: UUID,
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(require_all),
):
    student = await student_service.get_student(db, student_id)
    return DataResponse(data=StudentResponse.model_validate(student))


@router.get("/{student_id}/profile", response_model=DataResponse[StudentProfileResponse])
async def get_student_profile(
    student_id: UUID,
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(require_all),
):
    student = await student_service.get_student_profile(db, student_id)
    profile = StudentProfileResponse.model_validate(student)
    # Add computed fields
    profile.labels = [
        {"id": str(sl.label.id), "name": sl.label.name_zh, "color": sl.label.color_hex}
        for sl in student.labels if sl.is_active
    ]
    return DataResponse(data=profile, message="查询成功")


@router.put("/{student_id}", response_model=DataResponse[StudentResponse])
async def update_student(
    student_id: UUID,
    data: StudentUpdate,
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(require_staff),
):
    student = await student_service.update_student(db, student_id, data)
    return DataResponse(data=StudentResponse.model_validate(student), message="学生更新成功")


@router.post("/{student_id}/parents", response_model=DataResponse)
async def link_parent(
    student_id: UUID,
    data: StudentParentLink,
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(require_staff),
):
    await student_service.link_parent(
        db, student_id, data.parent_id, data.relationship_type, data.is_primary_contact
    )
    return DataResponse(message="家长关联成功")
