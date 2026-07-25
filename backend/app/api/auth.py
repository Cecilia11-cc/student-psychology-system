from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.permissions import get_current_user, require_admin, require_all
from app.dependencies import get_db
from app.schemas.common import DataResponse
from app.schemas.user import (
    ChangePasswordRequest,
    LoginRequest,
    RefreshRequest,
    TokenResponse,
    UserCreate,
    UserResponse,
    UserUpdate,
)
from app.services import user_service

router = APIRouter(prefix="/auth", tags=["认证"])


@router.post("/login", response_model=DataResponse[TokenResponse])
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    user = await user_service.authenticate_user(db, data.username, data.password)
    tokens = await user_service.create_tokens_for_user(user)
    return DataResponse(
        data=TokenResponse(
            **tokens,
            user=UserResponse.model_validate(user),
        ),
        message="登录成功",
    )


@router.post("/refresh", response_model=DataResponse[dict])
async def refresh_token(data: RefreshRequest):
    from app.core.security import decode_token

    payload = decode_token(data.refresh_token)
    if not payload or payload.get("type") != "refresh":
        from app.core.exceptions import BadRequestException
        raise BadRequestException("无效的刷新令牌")

    from app.core.security import create_access_token
    token_data = {k: v for k, v in payload.items() if k not in ("exp", "type")}
    return DataResponse(data={"access_token": create_access_token(token_data)})


@router.get("/me", response_model=DataResponse[UserResponse])
async def get_me(
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    current_user = await user_service.get_user_by_id(db, user["sub"])
    return DataResponse(data=UserResponse.model_validate(current_user))


@router.post("/change-password", response_model=DataResponse)
async def change_password(
    data: ChangePasswordRequest,
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    from app.core.exceptions import BadRequestException
    from app.core.security import hash_password, verify_password

    current_user = await user_service.get_user_by_id(db, user["sub"])
    if not verify_password(data.old_password, current_user.password_hash):
        raise BadRequestException("原密码错误")
    current_user.password_hash = hash_password(data.new_password)
    await db.flush()
    return DataResponse(message="密码修改成功")


# Admin-only: user CRUD through /users endpoint
users_router = APIRouter(prefix="/users", tags=["用户管理"])


@users_router.get("", response_model=DataResponse)
async def list_users(
    page: int = 1,
    page_size: int = 20,
    role: str | None = None,
    school_id: str | None = None,
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(require_admin),
):
    users, total = await user_service.list_users(db, page, page_size, role, school_id)
    return DataResponse(
        data=[UserResponse.model_validate(u) for u in users],
        message="查询成功",
        # Note: pagination info would be added by middleware or in response wrapper
    )


@users_router.post("", response_model=DataResponse[UserResponse])
async def create_user(
    data: UserCreate,
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(require_admin),
):
    user = await user_service.create_user(db, data)
    return DataResponse(data=UserResponse.model_validate(user), message="用户创建成功")


@users_router.get("/{user_id}", response_model=DataResponse[UserResponse])
async def get_user(
    user_id: str,
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(require_all),
):
    from uuid import UUID
    user = await user_service.get_user_by_id(db, UUID(user_id))
    return DataResponse(data=UserResponse.model_validate(user))


@users_router.put("/{user_id}", response_model=DataResponse[UserResponse])
async def update_user(
    user_id: str,
    data: UserUpdate,
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(require_admin),
):
    from uuid import UUID
    user = await user_service.update_user(db, UUID(user_id), data)
    return DataResponse(data=UserResponse.model_validate(user), message="用户更新成功")
