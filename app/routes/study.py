from fastapi import APIRouter, HTTPException

from app.models.schemas import SummarizeRequest, SummaryResponse
from app.foundry import foundry_service

router = APIRouter(prefix="/api", tags=["Study"])


@router.post("/summarize", response_model=SummaryResponse)
def summarize_topic(request: SummarizeRequest):

    try:
        result = foundry_service.summarize(
            topic=request.topic
        )

        return SummaryResponse(
            conversation_id=result["conversation_id"],
            summary=result["summary"]
        )

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Unable to summarize the study material."
        )