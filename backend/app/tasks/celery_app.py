from celery import Celery
from celery.schedules import crontab

from app.config import settings

celery_app = Celery(
    "student_psychology",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Asia/Shanghai",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutes max per task
    task_soft_time_limit=25 * 60,
)

# Scheduled tasks (to be enabled in later phases)
celery_app.conf.beat_schedule = {
    # "nightly-risk-recalculation": {
    #     "task": "app.tasks.analysis_tasks.recalculate_all_risks",
    #     "schedule": crontab(hour=2, minute=17),
    # },
}
