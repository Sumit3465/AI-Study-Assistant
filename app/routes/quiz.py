from fastapi import APIRouter, HTTPException, Depends

from app.models.schemas import QuizRequest, QuizResponse
from app.foundry import foundry_service
from app.auth import get_current_user
from app.database import User

router = APIRouter(prefix="/api", tags=["Quiz"])


@router.post("/quiz", response_model=QuizResponse)
def generate_quiz(
    request: QuizRequest,
    current_user: User = Depends(get_current_user)
):
    try:
        result = foundry_service.generate_quiz(topic=request.topic)

        return QuizResponse(
            conversation_id=result["conversation_id"],
            quiz=result["quiz"]
        )

    except Exception:
        raise HTTPException(status_code=500, detail="Unable to generate the quiz.")
