from uuid import UUID

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.config import settings
from app.dependencies import db_session
from app.models import LabAnalysis, User
from app.schemas import AnalysisCreateResponse, MetricItem
from app.services.llm_analyze import analyze_lab_text
from app.services.pdf_extract import extract_text_from_pdf

router = APIRouter(tags=["analyze"])

MAX_BYTES = settings.max_upload_mb * 1024 * 1024
PDF_MAGIC = b"%PDF"


@router.post("/api/analyze", response_model=AnalysisCreateResponse)
async def analyze_report(
    user_id: UUID = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(db_session),
):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Please upload a PDF file")

    raw = await file.read()
    if len(raw) > MAX_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size is {settings.max_upload_mb} MB",
        )
    if not raw.startswith(PDF_MAGIC):
        raise HTTPException(status_code=400, detail="Invalid PDF file")

    try:
        text = extract_text_from_pdf(raw)
    except Exception as exc:
        raise HTTPException(
            status_code=422,
            detail=f"Could not read PDF: {exc!s}",
        ) from exc

    if not text or len(text.strip()) < 20:
        raise HTTPException(
            status_code=422,
            detail="Could not extract enough text from this PDF. Try a text-based PDF or a clearer scan.",
        )

    try:
        result = analyze_lab_text(text)
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Analysis service error: {exc!s}",
        ) from exc

    metrics_dump = [m.model_dump() for m in result.metrics]
    row = LabAnalysis(
        user_id=user_id,
        pdf_filename=file.filename,
        overall_summary=result.overall_summary,
        doctor_questions=result.doctor_questions,
        metrics_payload=metrics_dump,
    )
    db.add(row)
    db.commit()
    db.refresh(row)

    metrics = [MetricItem.model_validate(m) for m in metrics_dump]
    return AnalysisCreateResponse(
        id=row.id,
        user_id=row.user_id,
        pdf_filename=row.pdf_filename,
        overall_summary=row.overall_summary,
        doctor_questions=list(row.doctor_questions or []),
        metrics=metrics,
        created_at=row.created_at,
    )
