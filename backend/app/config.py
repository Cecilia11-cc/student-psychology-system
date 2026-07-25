from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # App
    APP_ENV: str = "development"
    APP_DEBUG: bool = True
    APP_NAME: str = "学生行为心理学分析系统"
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:80"

    # Database
    DATABASE_URL: str = (
        "postgresql+asyncpg://sps_user:sps_password_dev@localhost:5432/student_psychology"
    )
    DATABASE_URL_SYNC: str = (
        "postgresql://sps_user:sps_password_dev@localhost:5432/student_psychology"
    )

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # JWT
    JWT_SECRET_KEY: str = "change-me-to-a-random-secret-key-at-least-32-chars"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # MinIO
    MINIO_ENDPOINT: str = "localhost:9000"
    MINIO_ACCESS_KEY: str = "minioadmin"
    MINIO_SECRET_KEY: str = "minioadmin_dev"
    MINIO_BUCKET: str = "student-reports"
    MINIO_SECURE: bool = False

    # Celery
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"

    model_config = {"env_file": ".env", "case_sensitive": True}


settings = Settings()
