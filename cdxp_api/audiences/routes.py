from asyncio.log import logger
from uuid import UUID
from cdxp_api.auth.deps import get_current_user
from cdxp_api.auth.models import CurrentUser

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.encoders import jsonable_encoder

from ..database.deps import CRUDSession
from .._shared.models import Page, PaginationQuery, SortingQuery

from .service import audience_service
from .models import (
    AudienceSegment,
    AudienceSegmentCreate,
    AudienceSegmentFilter,
    AudienceSegmentRead,
    AudienceSegmentUpdate,
    EstimationCallback,
    EstimationState,
)

router = APIRouter(prefix="/audiences/segments", tags=["Audiences"])


@router.post("", response_model=AudienceSegmentRead)
async def create(
    create_record: AudienceSegmentCreate,
    db: CRUDSession = Depends(),
):
    record = AudienceSegment.parse_obj(create_record)
    # FIXME should have better solution by auto binding
    record.filters = jsonable_encoder(record.filters)
    db_record = await db.create(record)

    # FIXME invoke databricks jobs to estimate audience size
    await trigger_estimation(db_record.id, db)

    return db_record


@router.post("/{id}/export")
# FIXME: manage by workflow
async def export(
    id: UUID, db: CRUDSession = Depends(), user: CurrentUser = Depends(get_current_user)
):

    # TODO: save requesters
    logger.debug(f"user: {user.id} requested to export audience segment")
    await audience_service.register_export_recipients(db, id, user.id)

    # FIXME: remove db session from route
    await audience_service.generate_audience_segment(db, id)

    return "OK"


# TODO: Filter by is_testing_list
@router.get("", response_model=Page[AudienceSegmentRead])
async def find_many(
    filter: AudienceSegmentFilter = Depends(),
    pagination_query: PaginationQuery = Depends(),
    sorting_query: SortingQuery = Depends(),
    db: CRUDSession = Depends(),
):
    query = db.make_query(AudienceSegment, filter.dict(exclude_unset=True, exclude_none=True))
    if sorting_query.sort_by:
        query = db.make_sorting(
            query, AudienceSegment, sorting_query.sort_by, sorting_query.sort_order
        )
    query, pagination = await db.make_pagination(
        query,
        current_page=pagination_query.current_page,
        page_size=pagination_query.page_size,
    )
    records = await db.find_many(query)
    return Page(data=records, pagination=pagination)


@router.get("/{id}", response_model=AudienceSegmentRead)
async def retrieve_one(
    id: UUID,
    db: CRUDSession = Depends(),
):
    db_record = await db.retrieve_detail(AudienceSegment, {"id": id})
    return db_record


@router.put("/{id}", response_model=AudienceSegmentRead)
async def update(
    id: UUID,
    partial_record: AudienceSegmentUpdate,
    db: CRUDSession = Depends(),
):
    db_record = await db.retrieve(AudienceSegment, id)
    partial_json = partial_record.dict(exclude_unset=True)
    partial_json["filters"] = jsonable_encoder(partial_json["filters"])
    updated_record = await db.update(db_record, partial_json)

    # FIXME invoke databricks jobs to estimate audience size
    await trigger_estimation(id, db)

    return updated_record


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete(
    id: UUID,
    db: CRUDSession = Depends(),
):
    await db.delete_by_id(AudienceSegment, id)


# FIXME wrap by service layer
@router.post("/{id}/estimate")
async def trigger_estimation(
    id: UUID,
    db: CRUDSession = Depends(),
):
    await audience_service.generate_audience_segment(db, id)
    return "OK"


@router.post("/{id}/estimate/callback")
async def estimation_callback(
    id: UUID,
    callback: EstimationCallback,
    db: CRUDSession = Depends(),
):
    db_record = await db.retrieve_detail(AudienceSegment, {"id": id})
    if callback.error or not callback.result:
        updated_record = await db.update(db_record, {"estimation_state": EstimationState.Failure})
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "databricks callback failure")
    updated_record = await db.update(
        db_record, {"estimation_state": EstimationState.Available, "size": callback.result.size}
    )
    call_list = await audience_service.generate_call_list(id)

    await audience_service.send_call_list(id, call_list)

    return {"id": str(id), "estimation_state": updated_record.estimation_state}
