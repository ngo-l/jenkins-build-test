from datetime import datetime
from typing import Generic, List, Literal, Optional, TypeVar
from uuid import UUID
from cdxp_api.database.sqltypes import CreatedAtColumn, UUIDColumn, UpdatedAtColumn

from fastapi import Query
from pydantic import validator
from pydantic.generics import GenericModel
from sqlmodel import Field

from .utils import APIModel, camel2snake

T = TypeVar("T", bound=APIModel)


# FIXME: eliminate junk custom methods for columns
class CommonModel(APIModel):
    id: Optional[UUID] = Field(sa_column=UUIDColumn(primary_key=True))
    created_at: Optional[datetime] = Field(None, sa_column=CreatedAtColumn())
    updated_at: Optional[datetime] = Field(None, sa_column=UpdatedAtColumn())


class SortingQuery(APIModel):
    sort_by: Optional[str]
    sort_order: Literal["asc", "desc"] = "asc"

    @validator("sort_by")
    def transform_sort(cls, v: str):
        return v and camel2snake(v)


class PaginationQuery(APIModel):
    current_page: int = Query(1, ge=1)
    page_size: int = Query(10, ge=10, le=100)


class Pagination(APIModel):
    current_page: int = Field(..., description="Current page number. Starts at 1.")
    page_size: int = Field(..., description="Current page size")
    total_pages: int = Field(..., description="Total number of pages in the collection")
    total_items: int = Field(..., description="Total number of items in the collection")
    skip: int = Field(..., description="Current page offset")


class Page(GenericModel, Generic[T]):
    data: List[T]
    pagination: Pagination


class Creator(APIModel):
    id: UUID
    full_name: str
    email: str
