from uuid import UUID
from fastapi import APIRouter, Depends, Query
from app.core.permissions import require_staff, require_all
from app.schemas.common import DataResponse

router = APIRouter(prefix="/dashboard", tags=["仪表盘"])

@router.get("/overview")
async def get_overview(_=Depends(require_all)):
    return DataResponse(data={
        "total_students": 42,
        "today_observations": 15,
        "observation_completion_rate": 66.7,
        "risk_alerts": 3,
        "pending_incidents": 2,
        "active_interventions": 5,
        "observation_trend": [12, 18, 15, 20, 22, 15, 10],
        "risk_distribution": {"low": 32, "moderate": 7, "high": 2, "critical": 1},
    })

@router.get("/risk-distribution")
async def risk_dist(class_id: UUID | None = None, school_id: UUID | None = None, _=Depends(require_staff)):
    return DataResponse(data={
        "labels": ["低风险", "中等风险", "高风险", "严重风险"],
        "values": [32, 7, 2, 1],
        "colors": ["#52c41a", "#faad14", "#ff7a45", "#ff4d4f"],
    })

@router.get("/heatmap")
async def heatmap(class_id: UUID | None = None, _=Depends(require_staff)):
    import random
    dims = ["情绪调节", "注意力", "同伴关系", "规则遵守", "攻击行为", "多动冲动", "焦虑表现", "学习能力", "合作能力", "活动转换"]
    students = [f"学生{i}" for i in range(1, 43)]
    return DataResponse(data={
        "dimensions": dims,
        "students": students[:15],
        "data": [[round(random.uniform(0, 100), 0) for _ in dims] for _ in range(15)],
    })

@router.get("/intervention-stats")
async def intervention_stats(_=Depends(require_staff)):
    return DataResponse(data={
        "total_active": 5,
        "total_completed": 12,
        "avg_effectiveness": 7.3,
        "by_type": {"behavioral": 8, "emotional": 5, "social": 3, "academic": 1},
    })
