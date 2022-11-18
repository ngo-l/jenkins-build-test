from uuid import UUID

from fastapi import APIRouter, Depends, status
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import HTTPException

from ..audiences.models import EstimationCallback
from .._shared.utils import create_rule_schemas
from ..database.deps import CRUDSession
from .._shared.models import Page, PaginationQuery, SortingQuery
from ..database.schemas import EstimationState
from ..databricks.config import databricks, databricks_settings
from .models import (
    ProductSegment,
    ProductSegmentCreate,
    ProductSegmentFilter,
    ProductSegmentRead,
    ProductSegmentUpdate,
)
from .rules import ProductSegmentRuleGroup

router = APIRouter(prefix="/products/segments", tags=["Products"])


@router.get("/rules/schemas")
def rule_schema():
    return create_rule_schemas(ProductSegmentRuleGroup)


@router.post("", response_model=ProductSegmentRead)
async def create(
    create_record: ProductSegmentCreate,
    db: CRUDSession = Depends(),
):
    record = ProductSegment.parse_obj(create_record)
    # FIXME should be have better solution
    record.filters = jsonable_encoder(record.filters)
    db_record = await db.create(record)
    return db_record


@router.get("", response_model=Page[ProductSegmentRead])
async def find_many(
    filter: ProductSegmentFilter = Depends(),
    pagination_query: PaginationQuery = Depends(),
    sorting_query: SortingQuery = Depends(),
    db: CRUDSession = Depends(),
):
    query = db.make_query(ProductSegment, filter.dict(exclude_unset=True, exclude_none=True))
    if sorting_query.sort_by:
        query = db.make_sorting(
            query, ProductSegment, sorting_query.sort_by, sorting_query.sort_order
        )
    query, pagination = await db.make_pagination(
        query,
        current_page=pagination_query.current_page,
        page_size=pagination_query.page_size,
    )
    records = await db.find_many(query)
    return Page(data=records, pagination=pagination)


@router.get("/{id}", response_model=ProductSegmentRead)
async def retrieve_one(id: UUID, db: CRUDSession = Depends()):
    db_record = await db.retrieve_detail(ProductSegment, {"id": id})
    return db_record


@router.put("/{id}", response_model=ProductSegmentRead)
async def update(id: UUID, partial_record: ProductSegmentUpdate, db: CRUDSession = Depends()):
    db_record = await db.retrieve(ProductSegment, id)
    partial_json = partial_record.dict(exclude_unset=True)
    partial_json["filters"] = jsonable_encoder(partial_json["filters"])
    updated_record = await db.update(db_record, partial_json)
    return updated_record


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete(id: UUID, db: CRUDSession = Depends()):
    await db.delete_by_id(ProductSegment, id)
