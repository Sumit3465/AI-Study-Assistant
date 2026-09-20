from fastapi import APIRouter, HTTPException

from app.models.schemas import RevisionNotesRequest, RevisionNotesResponse
from app.foundry import foundry_service

router = APIRouter(prefix="/api", tags=["Revision"])


@router.post("/revision-notes", response_model=RevisionNotesResponse)
def generate_revision_notes(request: RevisionNotesRequest):

    try:
        result = foundry_service.generate_revision_notes(
            topic=request.topic
        )

        return RevisionNotesResponse(
            conversation_id=result["conversation_id"],
            notes=result["notes"]
        )

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Unable to generate revision notes."
        )