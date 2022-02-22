from apscheduler.schedulers.asyncio import AsyncIOScheduler

from src.reminders.abandoned_cart.jobs import register

scheduler = AsyncIOScheduler()

def init_scheduler(app):
    @app.on_event('startup')
    def init():        
        register(scheduler)

        scheduler.start()
