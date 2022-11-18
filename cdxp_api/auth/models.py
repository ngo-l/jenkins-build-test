from typing import List
from uuid import UUID

from pydantic import EmailStr, SecretStr, validator

from .._shared.utils import APIModel, camel2snake


class CurrentUser(APIModel):
    id: UUID
    email: EmailStr
    full_name: str
    avatar: str = ""
    role: str = "Admin"
    ability: List[dict] = [{"action": "manage", "subject": "all"}]

    @validator("avatar", always=True)
    def generate_avatar_url(cls, v: str, values: dict):
        return (
            f"https://avatars.dicebear.com/api/initials/{camel2snake(full_name)}.svg"
            if (full_name := values.get("full_name")) and not v
            else v
        )


class Password(SecretStr):
    min_length = 8


class UserRead(CurrentUser):
    ...


class UserCreate(APIModel):
    email: EmailStr
    password: Password
    full_name: str


class LoginRequest(APIModel):
    email: EmailStr
    password: Password


class LoginResponse(APIModel):
    access_token: str
    token_type: str = "bearer"
