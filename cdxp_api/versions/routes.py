import logging
from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, status
from fastapi.encoders import jsonable_encoder
from sqlalchemy.sql.expression import select

from ..database.deps import CRUDSession
from .._shared.models import Page, PaginationQuery, SortingQuery
from ..database.schemas import AudienceSegment, PlatformConfig, Version
from .models import (
    SendTestMailRequest,
    VersionCreate,
    VersionEstimation,
    VersionFilter,
    VersionRead,
    VersionReadWithAudiences,
    VersionUpdate,
)
from ..emarsys.service import emarsys_service
from ..emarsys.settings import emarsys_settings

router = APIRouter(prefix="/versions", tags=["Versions"])


async def get_audience_by_ids(audience_ids: List[UUID], db: CRUDSession) -> List[AudienceSegment]:
    audience_query = select(AudienceSegment).filter(AudienceSegment.id.in_(audience_ids))
    audience_exec = await db.execute(audience_query)
    audiences = audience_exec.scalars().all()
    return audiences


@router.post("", response_model=VersionRead)
async def create(create_record: VersionCreate, db: CRUDSession = Depends()):
    instance = Version.parse_obj(create_record)

    instance.platform_config = jsonable_encoder(create_record.platform_config)
    instance.product_segments = jsonable_encoder(create_record.product_segments)

    audiences_include = await get_audience_by_ids(create_record.audience_segment_include_ids, db)
    instance.audience_segments_include = audiences_include

    audiences_exclude = await get_audience_by_ids(create_record.audience_segment_exclude_ids, db)
    instance.audience_segments_exclude = audiences_exclude

    return await db.create(instance)


@router.get("", response_model=Page[VersionRead])
async def find_many(
    filter: VersionFilter = Depends(),
    pagination_query: PaginationQuery = Depends(),
    sorting_query: SortingQuery = Depends(),
    db: CRUDSession = Depends(),
):
    query = db.make_query(Version, filter.dict(exclude_unset=True, exclude_none=True))
    if sorting_query.sort_by:
        query = db.make_sorting(query, Version, sorting_query.sort_by, sorting_query.sort_order)
    query, pagination = await db.make_pagination(
        query,
        current_page=pagination_query.current_page,
        page_size=pagination_query.page_size,
    )
    records = await db.find_many(query)
    return Page(data=records, pagination=pagination)


@router.get("/{id}", response_model=VersionReadWithAudiences)
async def retrieve_one(id: UUID, db: CRUDSession = Depends()):
    db_record = await db.retrieve_detail(Version, {"id": id})
    return db_record


@router.put("/{id}", response_model=VersionRead)
async def update(id: UUID, partial: VersionUpdate, db: CRUDSession = Depends()):
    instance = await db.retrieve_detail(Version, {"id": id})
    partial_record = partial.dict(exclude_unset=True, exclude_none=True)

    if partial.platform_config is not None:
        partial_record["platform_config"] = jsonable_encoder(partial.platform_config)

    if partial.product_segments is not None:
        partial_record["product_segments"] = jsonable_encoder(partial.product_segments)

    if partial.audience_segment_include_ids is not None:
        ids = partial_record.pop("audience_segment_include_ids")
        partial_record["audience_segments_include"] = await get_audience_by_ids(ids, db)

    if partial.audience_segment_exclude_ids is not None:
        ids = partial_record.pop("audience_segment_exclude_ids")
        partial_record["audience_segments_exclude"] = await get_audience_by_ids(ids, db)

    updated_record = await db.update(instance, partial_record)
    return updated_record


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete(id: UUID, db: CRUDSession = Depends()):
    await db.delete_by_id(Version, id)


@router.post("/{id}/test")
async def send_test_mail(
    id: UUID, send_test_mail_request: SendTestMailRequest, db: CRUDSession = Depends()
):
    # FIXME wrap by service layer
    email_addresses = send_test_mail_request.email_addresses
    logging.info(f"sending testing email, {id}, email_addresses: {email_addresses}")
    version = await db.retrieve_detail(Version, {"id": id})
    platform_config: PlatformConfig = PlatformConfig.parse_obj(version.platform_config)
    product_list_length = len(version.product_selection_matrix) * len(
        version.product_selection_matrix[0]
    )

    mock_products = {}
    for i in range(1, product_list_length + 1):
        mock_products[f"ATG_{i}"] = "BVO531"
        mock_products[f"Brand_{i}"] = "LA MER"
        mock_products[
            f"Prod_Desc_{i}"
        ] = "GENAISSANCE DE LA MER™ THE CONCENTRATED NIGHT BALM 50ML"

    mock_row = {"Subject_Line": "CDXP Test Mail", **mock_products}
    mock_data = list(
        map(lambda email_address: {**mock_row, "email": email_address}, email_addresses)
    )
    logging.debug(f"mock_data:{mock_data}")
    logging.debug(f"testing event_id: {platform_config.event_id}")
    blast_result = emarsys_service.blast(
        key_field_id=emarsys_settings.email_field_id,
        key_field="email",
        data=mock_data,
        event_id=platform_config.event_id,
        product_list_length=product_list_length,
        only_opt_in=False,
    )

    return blast_result
