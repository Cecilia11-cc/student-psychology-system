from typing import Any, Generic, TypeVar

from pydantic import BaseModel, Field

T = TypeVar("T")


class BaseResponse(BaseModel):
    success: bool = True
    message: str = "操作成功"


class DataResponse(BaseResponse, Generic[T]):
    data: T | None = None


class PaginatedResponse(BaseResponse):
    data: list[Any] = []
    pagination: dict = Field(
        default_factory=lambda: {
            "page": 1,
            "page_size": 20,
            "total": 0,
            "total_pages": 0,
        }
    )


class ErrorResponse(BaseModel):
    success: bool = False
    message: str
    detail: str | None = None
