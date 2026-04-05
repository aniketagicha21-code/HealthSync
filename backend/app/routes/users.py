from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import db_session
from app.models import LabAnalysis, User
from app.schemas import AnalysisListItem, UserCreateResponse

router = APIRouter(prefix="/api/users", tags=["users"])


@router.post("", response_model=UserCreateResponse)
def create_user(db: Session = Depends(db_session)):
    user = User()
    db.add(user)
    db.commit()
    db.refresh(user)
    return UserCreateResponse(id=user.id)


@router.get("/{user_id}/analyses", response_model=list[AnalysisListItem])
def list_user_analyses(user_id: UUID, db: Session = Depends(db_session)):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    analyses = (
        db.query(LabAnalysis)
        .filter(LabAnalysis.user_id == user_id)
        .order_by(LabAnalysis.created_at.desc())
        .all()
    )
    out: list[AnalysisListItem] = []
    for a in analyses:
        metrics = a.metrics_payload or []
        abnormal = sum(
            1
            for m in metrics
            if isinstance(m, dict) and m.get("status") not in ("normal", None)
        )
        out.append(
            AnalysisListItem(
                id=a.id,
                pdf_filename=a.pdf_filename,
                created_at=a.created_at,
                metric_count=len(metrics),
                abnormal_count=abnormal,
            )
        )
    return out
