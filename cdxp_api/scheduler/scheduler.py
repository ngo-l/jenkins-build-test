from datetime import datetime
import logging
import random
import json
import os
from cdxp_api.emarsys.service_legacy import EdmService

from apscheduler.jobstores.sqlalchemy import SQLAlchemyJobStore
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from sqlalchemy.engine.url import URL

from cdxp_api.emarsys.utils import load_parquet
from ..database.settings import DatabaseSettings
from .settings import SchedulerSettings
from .._shared.settings import common_settings
from ..emarsys.settings import emarsys_settings
from ..emarsys.service import emarsys_service
from ..audiences.repository import audience_repository
from ..notifications.repository import notification_repository
from ..users.repository import user_repository

dir_path = os.path.dirname(os.path.realpath(__file__))


def init():
    scheduler_setting = SchedulerSettings()
    database_settings = DatabaseSettings()
    url = URL.create(**database_settings.dict()).set(drivername="postgresql")
    return AsyncIOScheduler(
        jobstores={"default": SQLAlchemyJobStore(url=url)}, timezone=scheduler_setting.timezone
    )


# TODO: actual blast
def ad_hoc_blast(event_id, blast_file_path):
    df = load_parquet(blast_file_path)
    logging.debug(f"event_id: {event_id}, blast_file_path:{blast_file_path}, df: {df}")
    try:
        edm = EdmService(event_id=event_id, product_length=24)
        for i in range(0, len(df), edm.settings.chunk_size):
            chunk_df = df[i : i + edm.settings.chunk_size]
            logging.info(f"Sending Emarsys blasting chunk from {i} to {i + len(chunk_df)}")
            response = edm.blast(chunk_df.to_dict("records"))
            logging.info(f"Emarsys blasting chunk success: {response}")
    except Exception as e:
        logging.error(f"failed to blast event ID: {event_id}, {e}")


# TODO: review if this is the right placen to schedule blast or should move to another domain
def schedule_blast(event_id: str, target_datetime: datetime, blast_file_path: str):
    logging.debug(f"scheduling job: {event_id}, {target_datetime}, {blast_file_path}")
    # ad_hoc_blast(event_id, blast_file_path)
    job_id = f"scheduled_blast_{random.randint(1000, 50000)}"
    scheduler.add_job(
        ad_hoc_blast,
        args={event_id: event_id, blast_file_path: blast_file_path},
        coalesce=True,
        next_run_time=target_datetime,
        id=job_id,
    )
    return job_id


async def update_audience_seg_and_notification_status():

    updated_audience_segment_count = (
        await audience_repository.update_many_audience_segment_estimation_state()
    )

    if updated_audience_segment_count == 0:
        logging.info(
            f"cron job - update_audience_seg_and_notification_status: done at {datetime.now()}; No audience segments updated"
        )
        return

    logging.info(
        f"cron job - update_audience_seg_and_notification_status: {updated_audience_segment_count} audience segment(s) updated"
    )

    (
        updated_noti_service_count,
        updated_noti_service,
    ) = await notification_repository.set_notification_expiries()

    if updated_noti_service_count == 0:
        logging.info(
            f"cron job - update_audience_seg_and_notification_status: exited at {datetime.now()}; No audience segment export emails updated"
        )
        return

    logging.info(
        f"cron job - update_audience_seg_and_notification_status: {updated_noti_service_count} audience segment export emails updated"
    )

    user_ids = list(map(lambda x: x["user_id"], updated_noti_service))
    users = await user_repository.get_user_emails_and_full_names_by_uuid(user_ids)

    if len(users) == 0:
        logging.error(
            f"cron job - update_audience_seg_and_notification_status: exited at {datetime.now()}; User Not Found"
        )
        return

    contacts = []

    for user in users:
        audience_segment_urls = [
            common_settings.betta_audience_segment_url + str(record["audience_segment_id"])
            for record in updated_noti_service
            if user[0] == record["user_id"]
        ]
        contacts.append(
            {
                "external_id": user[1],
                "trigger_id": f"3301_{user[1]}",
                "data": {"urls": audience_segment_urls},
            }
        )

    payload = {"key_id": "3", "contacts": contacts}

    emarsys_service.trigger_external_event(
        event_id=emarsys_settings.failed_audience_segment_generation_event_id, payload=payload
    )

    logging.info(
        f"cron job - update_audience_seg_and_notification_status: done at {datetime.now()}"
    )
    return


def add_schedule_jobs(scheduler):
    """add your schedule jobs here which will be established right after start up"""
    scheduler.add_job(
        update_audience_seg_and_notification_status,
        trigger="interval",
        minutes=common_settings.cron_job_update_audience_segment_and_notification_status_freq_in_minute,
    )
    return


scheduler = init()
