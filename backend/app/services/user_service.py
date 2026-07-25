from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ConflictException, NotFoundException
from app.core.security import create_access_token, create_refresh_token, hash_password, verify_password
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate


async def get_user_by_id(db: AsyncSession, user_id: UUID) -> User:
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise NotFoundException("用户不存在")
    return user


async def get_user_by_username(db: AsyncSession, username: str) -> User | None:
    result = await db.execute(select(User).where(User.username == username))
    return result.scalar_one_or_none()


async def authenticate_user(db: AsyncSession, username: str, password: str) -> User:
    user = await get_user_by_username(db, username)
    if not user:
        raise NotFoundException("用户名或密码错误")
    if not verify_password(password, user.password_hash):
        raise NotFoundException("用户名或密码错误")
    if not user.is_active:
        raise NotFoundException("账户已被禁用")
    return user


async def create_tokens_for_user(user: User) -> dict:
    token_data = {
        "sub": str(user.id),
        "username": user.username,
        "role": user.role,
        "school_id": str(user.school_id) if user.school_id else None,
    }
    return {
        "access_token": create_access_token(token_data),
        "refresh_token": create_refresh_token(token_data),
        "token_type": "bearer",
    }


async def create_user(db: AsyncSession, data: UserCreate) -> User:
    existing = await get_user_by_username(db, data.username)
    if existing:
        raise ConflictException("用户名已存在")
    user = User(
        username=data.username,
        password_hash=hash_password(data.password),
        email=data.email,
        phone=data.phone,
        full_name=data.full_name,
        role=data.role,
    )
    db.add(user)
    await db.flush()
    await db.refresh(user)
    return user


async def update_user(db: AsyncSession, user_id: UUID, data: UserUpdate) -> User:
    user = await get_user_by_id(db, user_id)
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(user, key, value)
    await db.flush()
    await db.refresh(user)
    return user


async def list_users(
    db: AsyncSession,
    page: int = 1,
    page_size: int = 20,
    role: str | None = None,
    school_id: UUID | None = None,
) -> tuple[list[User], int]:
    query = select(User)
    count_query = select(User)

    if role:
        query = query.where(User.role == role)
        count_query = count_query.where(User.role == role)
    if school_id:
        query = query.where(User.school_id == school_id)
        count_query = count_query.where(User.school_id == school_id)

    # Count
    from sqlalchemy import func

    count_result = await db.execute(select(func.count()).select_from(count_query.subquery()))
    total = count_result.scalar() or 0

    # Paginate
    query = query.order_by(User.created_at.desc()).offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(query)
    users = list(result.scalars().all())

    return users, total
