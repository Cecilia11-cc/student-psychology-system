from enum import Enum
from typing import List

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.security import decode_token

security_scheme = HTTPBearer()


class Role(str, Enum):
    ADMIN = "admin"
    TEACHER = "teacher"
    PSYCHOLOGIST = "psychologist"
    PARENT = "parent"


class DataAccessLevel(str, Enum):
    OWN_CLASS = "own_class"
    OWN_SCHOOL = "own_school"
    ALL = "all"
    OWN_CHILDREN = "own_children"


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
) -> dict:
    """Validate JWT token and return current user payload."""
    payload = decode_token(credentials.credentials)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="无效的认证令牌",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="无效的令牌类型",
        )
    return payload


def require_roles(*roles: Role):
    """Dependency factory: require one of the given roles."""

    async def role_checker(user: dict = Depends(get_current_user)) -> dict:
        user_role = user.get("role")
        if user_role not in [r.value for r in roles]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="您没有权限执行此操作",
            )
        return user

    return role_checker


# Common permission shortcuts
require_admin = require_roles(Role.ADMIN)
require_teacher = require_roles(Role.TEACHER)
require_psychologist = require_roles(Role.PSYCHOLOGIST)
require_parent = require_roles(Role.PARENT)
require_staff = require_roles(Role.ADMIN, Role.TEACHER, Role.PSYCHOLOGIST)
require_all = require_roles(Role.ADMIN, Role.TEACHER, Role.PSYCHOLOGIST, Role.PARENT)
