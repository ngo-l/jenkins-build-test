import logging

from datetime import datetime, timedelta
from typing import List
from uuid import UUID
from cdxp_api.campaigns.models import CampaignState

from fastapi import APIRouter, Depends, status
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import HTTPException
from pydantic import parse_obj_as
from sqlalchemy import select
from sqlalchemy import bindparam, update as sa_update
from sqlalchemy.orm import joinedload

from ..auth.deps import get_current_user
from ..auth.models import CurrentUser
from ..database.deps import CRUDSession
from .._shared.models import Creator, Page, PaginationQuery, SortingQuery
from ..database.schemas import (
    PlatformConfig,
    Version,
    VersionState,
)
from ..databricks.config import databricks_jobs_service, databricks_settings
from ..emarsys.tasks import trigger_edm
from ..scheduler import scheduler
from .legacy_models import (
    Campaign,
    CampaignCreate,
    CampaignFilter,
    CampaignRead,
    CampaignReadWithVersions,
    CampaignUpdate,
    CampaignEstimation,
    LaunchCallback,
)
from .settings import campaign_settings

router = APIRouter(prefix="/campaigns", tags=["Campaigns"])


@router.post("", response_model=CampaignRead)
async def create(
    create_record: CampaignCreate,
    current_user: CurrentUser = Depends(get_current_user),
    db: CRUDSession = Depends(),
):
    record = Campaign.parse_obj(create_record)
    record.creator = jsonable_encoder(Creator.parse_obj(current_user))
    db_record = await db.create(record)
    return db_record


@router.get("", response_model=Page[CampaignRead])
async def find_many(
    filter: CampaignFilter = Depends(),
    pagination_query: PaginationQuery = Depends(),
    sorting_query: SortingQuery = Depends(),
    db: CRUDSession = Depends(),
):
    query = db.make_query(Campaign, filter.dict(exclude_unset=True, exclude_none=True))
    if sorting_query.sort_by:
        query = db.make_sorting(query, Campaign, sorting_query.sort_by, sorting_query.sort_order)
    query, pagination = await db.make_pagination(
        query,
        current_page=pagination_query.current_page,
        page_size=pagination_query.page_size,
    )
    records = await db.find_many(query)
    records = parse_obj_as(List[CampaignRead], records)
    return Page(data=records, pagination=pagination)


@router.get("/{id}", response_model=CampaignReadWithVersions)
async def retrieve_one(
    id: UUID,
    db: CRUDSession = Depends(),
) -> Campaign:
    query = (
        select(Campaign)
        .filter_by(id=id)
        .options(
            joinedload(Campaign.versions).joinedload("*"),
        )
    )
    exec = await db.execute(query)
    result = exec.unique().scalar_one()
    return result


@router.put("/{id}", response_model=CampaignRead)
async def update(
    id: UUID,
    partial_record: CampaignUpdate,
    db: CRUDSession = Depends(),
):
    db_record = await db.retrieve(Campaign, id)
    # TODO: wrap by service layer and handle state channge by FSM
    # FIXME: missing state error
    if db_record.state in [CampaignState.Drafted, CampaignState.Failure, CampaignState.Cancelled]:
        # TODO: move in to FSM or use dispatcher to hook up state change
        updated_record = await db.update(db_record, partial_record.dict(exclude_unset=True))
        return updated_record


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete(
    id: UUID,
    db: CRUDSession = Depends(),
):
    await db.delete_by_id(Campaign, id)


# def validate_version(version: Version):
# min_datetime = datetime.now() + timedelta(
#     minutes=campaign_settings.schedule_minutes_in_advance
# )
# platform_config: PlatformConfig = PlatformConfig.parse_obj(
#     version.platform_config
# )  # type: ignore
# if platform_config.schedule_at < min_datetime:
#     raise HTTPException(
#         status.HTTP_409_CONFLICT,
#         f"schedule time for all versions should be at least {campaign_settings.schedule_minutes_in_advance} minutes from now",
#     )


def validate_campaign(campaign: Campaign = Depends(retrieve_one)):
    # FIXME: move to service layer, use as precondition of fsm state change
    if campaign.state == CampaignState.Processing:
        raise HTTPException(status.HTTP_409_CONFLICT, "Campaign has already started processing")
    if not campaign.versions:
        raise HTTPException(status.HTTP_409_CONFLICT, "No version in campaign")
    # for version in campaign.versions:
    #     validate_version(version)
    return campaign


@router.post("/{id}/launch")
async def campaign_launch(
    id: UUID, campaign: Campaign = Depends(validate_campaign), db: CRUDSession = Depends()
):
    """
    Campaign: Drafted -> Processing
    Version: Drafted -> Processing
    """
    notebook_params = {
        "campaign_id": str(id),
        # "workflow_config": f"/mnt/shared/cdp/lc/config/workflow_config.json",
    }
    try:
        # Caveats: ALL audience segments linked in the versions under the campaign must be already estimated
        #   otherwise the existing data scientists' codes will fail
        databricks_jobs_service.run_now(
            job_id=databricks_settings.jobs.campaign_launch,
            notebook_params=notebook_params,
        )
    except Exception as e:
        logging.warning(f"Databricks Error: {e}")
        raise HTTPException(500, "databricks failure")

    # FIXME: move to FSM
    campaign.state = CampaignState.Processing
    exec = sa_update(Version).filter_by(campaign_id=id).values(state=VersionState.Processing)
    await db.execute(exec)
    await db.commit()

    return notebook_params


@router.post("/{id}/launch/callback")
async def campaign_launch_callback(
    callback: LaunchCallback,
    campaign: Campaign = Depends(retrieve_one),
    db: CRUDSession = Depends(),
):
    """
    Campaign: Processing
    Version: Processing -> Scheduled / Failure
    """
    if callback.error or not callback.results:
        logging.warning(f"call back error: {callback.error}")
        await db.update(campaign, {"state": VersionState.Failure})
        raise HTTPException(
            status.HTTP_409_CONFLICT,
            jsonable_encoder(callback.error.detail) if callback.error else "no callback result",
        )
    results = []
    for version in campaign.versions:
        id = str(version.id)
        if blob_path := next(
            (r.blob_path for r in callback.results if r.version == version.id), None
        ):
            product_length = len(version.product_selection_matrix) * len(
                version.product_selection_matrix[0]
            )
            platform_config: PlatformConfig = PlatformConfig.parse_obj(
                version.platform_config
            )  # type: ignore
            kwargs = {
                "blob_path": blob_path,
                "event_id": platform_config.event_id,
                "product_length": product_length,
                "version_id": id,
            }
            logging.debug(f"scheduler params: {kwargs}")
            run_date = platform_config.schedule_at

            # FIXME: no control over scheduled jobs
            scheduler.add_job(trigger_edm, "date", kwargs=kwargs, run_date=run_date, id=id)
            version.state = VersionState.Scheduled
            results.append(
                {
                    "id": id,
                    "version_name": version.name,
                    "state": VersionState.Scheduled,
                    "run_date": run_date,
                    "kwargs": kwargs,
                }
            )
        else:
            version.state = VersionState.Failure
            results.append(
                {
                    "id": id,
                    "version_name": version.name,
                    "state": VersionState.Failure,
                }
            )
    await db.commit()
    logging.debug(f"results: {results}")
    return results


@router.post("/{id}/estimate")
async def trigger_estimation(id: UUID):
    # TODO: update campaign AND version statuses

    notebook_params = {
        "campaign_id": str(id),
        # temp path
        "workflow_config": f"/mnt/shared/cdp/lc/config/workflow_config.json",
    }

    try:
        print("start invoking databricks job")
        databricks_jobs_service.run_now(
            job_id=databricks_settings.jobs.estimate_version_size,
            notebook_params=notebook_params,
        )
    except Exception as e:
        # FIXME: missing log of error details
        print(e)
        raise HTTPException(
            status.HTTP_503_SERVICE_UNAVAILABLE, "failed to invboke databricks job"
        )

    return notebook_params


@router.post("/{campaign_id}/estimate/callback")
async def campaign_versions_estimate_callback(
    campaign_id: UUID, estimations: CampaignEstimation, db: CRUDSession = Depends()
):
    # TODO throw error if campaign not found

    stmt = (
        sa_update(Version)
        .where(Version.id == bindparam("version_id") and Campaign.id == campaign_id)
        .values(audience_size=bindparam("audience_size"), product_size=bindparam("product_size"))
    )
    version_data = estimations.dict(exclude_unset=True, exclude_none=True)["versions"]

    await db.execute(stmt, version_data)
    await db.commit()

    # TODO return count of updated version
    return "OK"
