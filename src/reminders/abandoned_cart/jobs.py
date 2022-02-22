from apscheduler.triggers.cron import CronTrigger
from .service import AbandonedCartService
from .settings import abandoned_cart_reminder_settings

def register(scheduler):
    job = scheduler.add_job(AbandonedCartService().send_abandoned_cart_reminders,
                            CronTrigger.from_crontab(abandoned_cart_reminder_settings.crontab),
                            id="send_abandoned_cart_reminders")
    return job
