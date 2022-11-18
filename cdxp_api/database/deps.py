import math
from typing import Any, List, Literal, Optional, Tuple, Type, TypeVar, Union

from asyncpg.exceptions import ForeignKeyViolationError
from fastapi import Depends, Request
from sqlalchemy import asc, desc, func, select
from sqlalchemy.exc import IntegrityError, NoResultFound
from sqlalchemy.ext.asyncio import AsyncConnection, AsyncEngine, AsyncSession
from sqlalchemy.orm import joinedload
from sqlalchemy.sql import Select
from sqlmodel import SQLModel

from .._shared.models import Pagination

T = TypeVar("T", bound=SQLModel)


def get_async_engine(request: Request) -> AsyncEngine:
    return request.app.state.engine


async def yield_async_session(engine: AsyncEngine = Depends(get_async_engine)):
    session = CRUDSession(engine)
    try:
        yield session
    except BaseException:
        await session.rollback()
        raise
    finally:
        await session.close()


# FIXME: remove this class
# PLEASE STOP ADDING NEW CODE THAT USE THIS CLASS, use dao/separated repositories instead
class CRUDSession(AsyncSession):
    def __init__(
        self, bind: Optional[Union[AsyncConnection, AsyncEngine]] = Depends(get_async_engine)
    ):
        super().__init__(bind=bind)

    async def retrieve(self, entity: Type[T], id: Any) -> T:
        record = await self.get(entity, id)
        if not record:
            raise NoResultFound("No row was found when one was required")
        return record

    async def retrieve_detail(self, entity: Type[T], filter_by: dict) -> T:
        query = select(entity).filter_by(**filter_by).options(joinedload("*"))
        exec = await self.execute(query)
        return exec.unique().scalar_one()

    async def find_many(self, query: Select) -> List[Any]:
        exec = await self.execute(query)
        raw_records = exec.scalars().all()
        return raw_records

    def make_query(self, entity: Type[T], filter: dict = {}):
        conditions = [getattr(entity, k).ilike(f"%{v}%") for k, v in filter.items()]
        return select(entity).filter(*conditions) if conditions else select(entity)

    def make_sorting(
        self,
        query: Select,
        entity: Type[T],
        sort_by: str,
        sort_order: Literal["asc", "desc"] = "asc",
    ):
        fieldName = getattr(entity, sort_by, None)
        asc_or_desc = {"asc": asc, "desc": desc}[sort_order]
        return query.order_by(asc_or_desc(fieldName)) if fieldName else query

    async def make_pagination(
        self, query: Select, current_page: int = 1, page_size: int = 10
    ) -> Tuple[Select, Pagination]:
        total_items = await self.count(query)
        pagination = Pagination(
            current_page=current_page,
            page_size=page_size,
            skip=page_size * (current_page - 1),
            total_items=total_items,
            total_pages=math.ceil(total_items / page_size),
        )
        paginated_query = query.offset(pagination.skip).limit(pagination.page_size)
        return paginated_query, pagination

    async def count(self, query: Select) -> int:
        result = await self.execute(select([func.count()]).select_from(query))
        scalar = result.scalar()
        count = int(scalar) if scalar else 0
        return count

    async def create(self, instance: T) -> T:
        self.add(instance)
        await self.commit()
        await self.refresh(instance)
        return instance

    async def update(self, instance: T, update_values: dict) -> T:
        for key, value in update_values.items():
            setattr(instance, key, value)
        await self.commit()
        await self.refresh(instance)
        return instance

    async def delete_by_id(self, entity: Type[T], id: Any) -> T:
        record = await self.retrieve(entity, id)
        try:
            await self.delete(record)
            await self.commit()
            return record
        except IntegrityError as e:
            raise ForeignKeyViolationError("cannot delete record, may be still in use")
