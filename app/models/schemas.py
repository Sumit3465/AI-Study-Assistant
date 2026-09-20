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

class SummarizeRequest(BaseModel):
    topic: str = Field(
        ...,
        min_length=2,
        max_length=2000,
        description="Topic or study material to summarize"
    )


class SummaryResponse(BaseModel):
    summary: str
    conversation_id: str

class QuizRequest(BaseModel):
    topic: str = Field(
        ...,
        min_length=2,
        max_length=2000,
        description="Topic for generating quiz questions"
    )


class QuizResponse(BaseModel):
    conversation_id: str
    quiz: str

class RevisionNotesRequest(BaseModel):
    topic: str = Field(
        ...,
        min_length=2,
        max_length=2000,
        description="Topic for generating revision notes"
    )


class RevisionNotesResponse(BaseModel):
    conversation_id: str
    notes: str