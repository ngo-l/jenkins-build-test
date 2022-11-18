from pydantic import EmailStr
from sqlmodel import Field

from cdxp_api._shared.models import CommonModel


class User(CommonModel, table=True):
    email: EmailStr = Field(sa_column_kwargs={"unique": True})
    hashed_password: str
    full_name: str
