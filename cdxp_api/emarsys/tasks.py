import logging
from typing import Optional
from uuid import UUID
from cdxp_api.campaigns.models import Campaign, CampaignState

import dask.dataframe as dd
from pandas import DataFrame
from sqlalchemy.engine.url import URL
from sqlalchemy.ext.asyncio.engine import create_async_engine

from ..database.deps import CRUDSession
from ..database.schemas import Version, VersionState
from ..database.settings import DatabaseSettings
from .service_legacy import EdmService


async def renew_campaign_state(db: CRUDSession, campaign_id: UUID):
    logging.info("Updating Campaign overall state...")
    campaign = await db.retrieve_detail(Campaign, {"id": campaign_id})
    version_states = [v.state for v in campaign.versions]
    logging.debug(f"Version states: {version_states}")

    if VersionState.Drafted in version_states:
        logging.warning("Unknown drafted version found but not yet launched.")
        version_states = [v.state for v in campaign.versions if v.state != VersionState.Drafted]

    if VersionState.Blasting in version_states or VersionState.Scheduled in version_states:
        logging.info("Some version is still running")
        return
    elif VersionState.Failure in version_states:
        logging.warning("Some version failed")
        await db.update(campaign, {"state": CampaignState.Failure})
        return
    elif VersionState.Cancelled in version_states:
        logging.warning("Some version is cancelled")
        await db.update(campaign, {"state": CampaignState.Cancelled})
        return
    elif all([s == VersionState.Done for s in version_states]):
        await db.update(campaign, {"state": CampaignState.Done})
        return
    else:
        logging.warning("Unknown campaign state")
        return


# FIXME: connecting to the service should not need version id, should have teh data and external event only
async def trigger_edm(*, blob_path: str, event_id: int, product_length: int, version_id: str):
    engine = create_async_engine(URL.create(**DatabaseSettings().dict()))
    logging.info("Connecting to database...")
    async with CRUDSession(engine) as db:
        version = await db.retrieve(Version, version_id)
        await db.update(version, {"state": VersionState.Blasting})

        if blob_path.startswith("/mnt/"):
            blob_path = blob_path[5:]
        abfs_path = blob_path if blob_path.startswith("abfs://") else f"abfs://{blob_path}"

        df: Optional[DataFrame] = None
        logging.info(f"Starting campaign version {version_id}")
        try:
            logging.info(f"Retreiving data from blob storage {abfs_path}")
            df = dd.read_parquet(abfs_path).compute()
            logging.info(f"Retreiving data success, data shape: {df.shape}")
        except Exception as e:
            logging.warning(f"retrieve data failure: {e}. Aborted.")
            await db.update(version, {"state": VersionState.Failure})
            await renew_campaign_state(db, version.campaign_id)
            return

        try:
            logging.info(f"Triggering Emarsys blasting event {event_id}")

            # TODO: migrate as the EdmService and EmarsysService are invalid relationship
            edm_service = EdmService(event_id=event_id, product_length=product_length)

            for i in range(0, len(df), edm_service.settings.chunk_size):
                chunk_df = df[i : i + edm_service.settings.chunk_size]
                logging.info(f"Sending Emarsys blasting chunk from {i} to {i + len(chunk_df)}")
                response = edm_service.blast(chunk_df.to_dict("records"))
                logging.info(f"Emarsys blasting chunk success: {response}")
            await db.update(version, {"state": VersionState.Done})
        except Exception as e:
            logging.warning(f"Emarsys blasting failure: {e}. Aborted.")
            await db.update(version, {"state": VersionState.Failure})
            await renew_campaign_state(db, version.campaign_id)
            return
        logging.info(f"Campaign version {version_id} complete")
        await renew_campaign_state(db, version.campaign_id)

    await engine.dispose()
