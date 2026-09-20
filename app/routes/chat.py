from fastapi import APIRouter, HTTPException

from app.models.schemas import QuestionRequest, AnswerResponse
from app.foundry import foundry_service


router = APIRouter(prefix="/api", tags=["Chat"])


@router.post("/ask", response_model=AnswerResponse)
def ask_question(request: QuestionRequest):

    try:
        result = foundry_service.ask(
            question=request.question,
            conversation_id=request.conversation_id
        )

        return AnswerResponse(
            conversation_id=result["conversation_id"],
            answer=result["answer"]
        )

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Unable to process the study question."
        )