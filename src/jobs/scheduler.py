import logging
import pytz

from apscheduler.schedulers.asyncio import AsyncIOScheduler

from src._shared.settings import common_settings
from src.reminders.abandoned_cart.jobs import register as register_abandoned_cart_jobs
from src.reminders.wish_list.jobs import register as register_wish_list_jobs

scheduler = AsyncIOScheduler(
    timezone=pytz.utc
    )

def init_scheduler(app):
    @app.on_event('startup')
    def init():
        if not common_settings.enable_cron:
            logging.info("cron job disabled")
            return
        
        # TODO: create annotation for IoC and register jobs from component
        register_abandoned_cart_jobs(scheduler)
        register_wish_list_jobs(scheduler)

        scheduler.start()
