from fastapi import APIRouter, HTTPException

from app.models.schemas import QuizRequest, QuizResponse
from app.foundry import foundry_service

router = APIRouter(prefix="/api", tags=["Quiz"])


@router.post("/quiz", response_model=QuizResponse)
def generate_quiz(request: QuizRequest):

    try:
        result = foundry_service.generate_quiz(
            topic=request.topic
        )

        return QuizResponse(
            conversation_id=result["conversation_id"],
            quiz=result["quiz"]
        )

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Unable to generate the quiz."
        )