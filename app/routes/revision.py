from fastapi import APIRouter, HTTPException, Depends

from app.models.schemas import RevisionNotesRequest, RevisionNotesResponse
from app.foundry import foundry_service
from app.auth import get_current_user
from app.database import User

router = APIRouter(prefix="/api", tags=["Revision"])


@router.post("/revision-notes", response_model=RevisionNotesResponse)
def generate_revision_notes(
    request: RevisionNotesRequest,
    current_user: User = Depends(get_current_user)
):
    try:
        result = foundry_service.generate_revision_notes(topic=request.topic)

        return RevisionNotesResponse(
            conversation_id=result["conversation_id"],
            notes=result["notes"]
        )

    except Exception:
        raise HTTPException(status_code=500, detail="Unable to generate revision notes.")
