import json

from openai import OpenAI

from app.config import settings
from app.prompt import SYSTEM_PROMPT, user_content_from_lab_text
from app.schemas import AnalysisLLMResult


def analyze_lab_text(lab_text: str) -> AnalysisLLMResult:
    if not settings.openai_api_key or not settings.openai_api_key.strip():
        raise ValueError("OPENAI_API_KEY is not configured")
    client = OpenAI(api_key=settings.openai_api_key)
    user_msg = user_content_from_lab_text(lab_text)
    completion = client.chat.completions.create(
        model="gpt-4o",
        temperature=0.2,
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_msg},
        ],
    )
    raw = completion.choices[0].message.content or "{}"
    data = json.loads(raw)
    return AnalysisLLMResult.model_validate(data)
