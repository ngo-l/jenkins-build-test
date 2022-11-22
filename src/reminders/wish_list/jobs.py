import pytz
from apscheduler.triggers.cron import CronTrigger
from .service import WishListService
from .settings import wish_list_reminder_settings

def register(scheduler):
    job = scheduler.add_job(WishListService().send_wish_list_reminders,
                            CronTrigger.from_crontab(wish_list_reminder_settings.crontab, timezone=pytz.utc),
                            id="send_wish_list_reminders")
    return job
