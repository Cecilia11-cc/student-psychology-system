from fastapi import APIRouter
from app.api.auth import router as auth_router, users_router
from app.api.students import router as students_router
from app.api.observations import router as observations_router, templates_router
from app.api.incidents import router as incidents_router
from app.api.analysis import router as analysis_router
from app.api.dashboard import router as dashboard_router

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(users_router)
api_router.include_router(students_router)
api_router.include_router(observations_router)
api_router.include_router(templates_router)
api_router.include_router(incidents_router)
api_router.include_router(analysis_router)
api_router.include_router(dashboard_router)
