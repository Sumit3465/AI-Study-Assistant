from fastapi import APIRouter, HTTPException, Depends

from app.models.schemas import SummarizeRequest, SummaryResponse
from app.foundry import foundry_service
from app.auth import get_current_user
from app.database import User

router = APIRouter(prefix="/api", tags=["Study"])


@router.post("/summarize", response_model=SummaryResponse)
def summarize_topic(
    request: SummarizeRequest,
    current_user: User = Depends(get_current_user)
):
    try:
        result = foundry_service.summarize(topic=request.topic)

        return SummaryResponse(
            conversation_id=result["conversation_id"],
            summary=result["summary"]
        )

    except Exception:
        raise HTTPException(status_code=500, detail="Unable to summarize the study material.")
