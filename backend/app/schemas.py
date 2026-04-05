from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, Field


class MetricItem(BaseModel):
    name: str
    category: str = Field(
        description="e.g. blood_count, metabolic_panel, lipid_panel, liver, kidney, thyroid, coagulation, urinalysis, other"
    )
    value: str
    unit: str | None = None
    normal_range: str
    status: Literal["normal", "high", "low", "critical", "unknown"]
    explanation: str


class AnalysisLLMResult(BaseModel):
    overall_summary: str
    metrics: list[MetricItem]
    doctor_questions: list[str]


class AnalysisCreateResponse(BaseModel):
    id: UUID
    user_id: UUID
    pdf_filename: str
    overall_summary: str
    doctor_questions: list[str]
    metrics: list[MetricItem]
    created_at: datetime


class AnalysisListItem(BaseModel):
    id: UUID
    pdf_filename: str
    created_at: datetime
    metric_count: int
    abnormal_count: int


class UserCreateResponse(BaseModel):
    id: UUID


class HealthResponse(BaseModel):
    status: str
    service: str
