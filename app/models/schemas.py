from pydantic import BaseModel, Field


class QuestionRequest(BaseModel):
    question: str = Field(
        ...,
        min_length = 2,
        ma_length = 200,
        description = "Question related to the study material"
    )

    conversation_id: str | None = Field(
        default =  None,
        description = "Existing conversation ID"
    )


class AnswerResponse(BaseModel):
    conversation_id: str
    answer: str