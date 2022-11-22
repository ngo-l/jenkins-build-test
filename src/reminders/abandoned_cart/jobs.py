import pytz
from apscheduler.triggers.cron import CronTrigger
from .service import BlastType, abandoned_cart_service
from .settings import abandoned_cart_reminder_settings


def register(scheduler):
    for blast_type in BlastType:
        scheduler.add_job(
            abandoned_cart_service.send_abandoned_cart_reminders,
            args={blast_type},
            trigger=CronTrigger.from_crontab(
                blast_type.value['cron'], timezone=pytz.utc),
            coalesce=True,
            id=f'Abandoned_cart_{blast_type.name}'
        )
