import logging
import pytz

from fastapi import APIRouter, HTTPException
from apscheduler.triggers.cron import CronTrigger
from datetime import datetime
from .models import UpdateJobRequest
from .scheduler import scheduler

router = APIRouter(prefix="/jobs")
logger = logging.getLogger(__name__)


def serialize_job(job):
    return {
        'Job ID': str(job.id),
        "Run Frequency": str(job.trigger),
        "Next Run": job.next_run_time.isoformat() if job.next_run_time else "none"
    }


@router.get("/")
async def get_scheduled_jobs():
    logger.debug('list all jobs')
    jobs = map(serialize_job, scheduler.get_jobs())

    return list(jobs)


@router.get("/time")
def get_current_time():
    current_datetime = datetime.now()
    curremt_datetime_tz = datetime.utcnow().replace(tzinfo=pytz.utc)

    return {
        'without-timezone': {
        'datetime': current_datetime.isoformat(),
        'timezone': current_datetime.tzinfo
    },
      'with-timezone': {
          'datetime': curremt_datetime_tz,
          'timezone': curremt_datetime_tz.tzinfo
      }
    }


@router.post("/{job_id}/reschedule")
async def reshcedule_job(job_id, update_job_request: UpdateJobRequest):
    logger.debug(f"reschedule job: {job_id}, {update_job_request}")
    try:
        cron_trigger = CronTrigger.from_crontab(update_job_request.cron)
    except ValueError as e:
        raise HTTPException(
            status_code=400, detail=f"Invalid cron expression: {str(e)}")
    job = scheduler.get_job(job_id)
    job.reschedule(cron_trigger)
    return serialize_job(job)


@router.post("/{job_id}/pause")
async def reshcedule_job(job_id):
    logger.debug(f"pause job: {job_id}")
    job = scheduler.get_job(job_id)
    job.pause()
    return serialize_job(job)


@router.post("/{job_id}/resume")
async def reshcedule_job(job_id):
    logger.debug(f"pause job: {job_id}")
    job = scheduler.get_job(job_id)
    job.resume()
    return serialize_job(job)
