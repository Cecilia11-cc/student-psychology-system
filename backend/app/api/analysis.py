from uuid import UUID
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.permissions import require_staff, require_all
from app.dependencies import get_db
from app.schemas.common import DataResponse
from app.ml.risk_scoring import calculate_risk_score, classify_risk_level
from app.ml.weights import DEFAULT_DIMENSION_WEIGHTS, RISK_COLORS
from pydantic import BaseModel

router = APIRouter(prefix="/analysis", tags=["分析引擎"])

class RiskCalculateRequest(BaseModel):
    student_ids: list[UUID]
    force: bool = False

@router.get("/risk/{student_id}")
async def get_risk(student_id: UUID, db: AsyncSession = Depends(get_db), _=Depends(require_all)):
    # Demo: generate a risk score from random sample dimensions
    import random
    dims = list(DEFAULT_DIMENSION_WEIGHTS.keys())
    sampled = {d: round(random.uniform(0, 100), 1) for d in random.sample(dims, min(12, len(dims)))}
    result = calculate_risk_score(sampled, observation_count=random.randint(5, 30))
    return DataResponse(data=result)

@router.post("/risk/calculate")
async def trigger_risk_calc(data: RiskCalculateRequest, db: AsyncSession = Depends(get_db), _=Depends(require_staff)):
    return DataResponse(data={"task_id": "mock-task-001", "student_count": len(data.student_ids)}, message="风险计算任务已提交")

@router.get("/trends/{student_id}")
async def get_trends(student_id: UUID, _=Depends(require_all)):
    import random
    months = ["2026-0{}".format(i) for i in range(1, 8)]
    return DataResponse(data={
        "labels": months,
        "datasets": [
            {"label": "风险评分", "data": [round(random.uniform(20, 60), 1) for _ in months], "color": "#ff4d4f"},
            {"label": "情绪调节", "data": [round(random.uniform(30, 70), 1) for _ in months], "color": "#1677ff"},
            {"label": "社交能力", "data": [round(random.uniform(20, 65), 1) for _ in months], "color": "#52c41a"},
        ]
    })

@router.get("/clusters")
async def get_clusters(class_id: UUID | None = None, _=Depends(require_staff)):
    import random
    return DataResponse(data={
        "clusters": [
            {"id": 0, "name": "稳定良好型", "count": 18, "avg_risk": 12.3, "color": "#52c41a"},
            {"id": 1, "name": "情绪波动型", "count": 12, "avg_risk": 35.6, "color": "#faad14"},
            {"id": 2, "name": "行为改善型", "count": 8, "avg_risk": 28.1, "color": "#1677ff"},
            {"id": 3, "name": "持续高风险型", "count": 4, "avg_risk": 72.4, "color": "#ff4d4f"},
        ]
    })

@router.get("/interventions/suggestions/{student_id}")
async def get_suggestions(student_id: UUID, _=Depends(require_staff)):
    import random
    suggestions = [
        {"title": "情绪调节小组训练", "description": "通过小组活动教导识别和命名情绪", "type": "emotional", "priority": "high", "expected_effectiveness": round(random.uniform(6, 9), 1)},
        {"title": "社交技能训练", "description": "结构化社交技能训练：轮流、分享、对话", "type": "social", "priority": "medium", "expected_effectiveness": round(random.uniform(5, 8), 1)},
        {"title": "正向行为支持计划", "description": "代币经济和正向强化系统", "type": "behavioral", "priority": "high", "expected_effectiveness": round(random.uniform(7, 9.5), 1)},
    ]
    return DataResponse(data=random.sample(suggestions, min(3, len(suggestions))))
