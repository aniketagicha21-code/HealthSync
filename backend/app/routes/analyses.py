from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import db_session
from app.models import LabAnalysis, User
from app.schemas import AnalysisCreateResponse, MetricItem

router = APIRouter(prefix="/api/analyses", tags=["analyses"])


@router.get("/{analysis_id}", response_model=AnalysisCreateResponse)
def get_analysis(analysis_id: UUID, db: Session = Depends(db_session)):
    row = db.get(LabAnalysis, analysis_id)
    if not row:
        raise HTTPException(status_code=404, detail="Analysis not found")
    metrics = [MetricItem.model_validate(m) for m in (row.metrics_payload or [])]
    return AnalysisCreateResponse(
        id=row.id,
        user_id=row.user_id,
        pdf_filename=row.pdf_filename,
        overall_summary=row.overall_summary,
        doctor_questions=list(row.doctor_questions or []),
        metrics=metrics,
        created_at=row.created_at,
    )


@router.delete("/{analysis_id}", status_code=204)
def delete_analysis(analysis_id: UUID, user_id: UUID, db: Session = Depends(db_session)):
    row = db.get(LabAnalysis, analysis_id)
    if not row or row.user_id != user_id:
        raise HTTPException(status_code=404, detail="Analysis not found")
    db.delete(row)
    db.commit()
    return None
