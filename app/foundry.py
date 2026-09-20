from azure.identity import DefaultAzureCredential
from azure.ai.projects import AIProjectClient

from app.config import (
    FOUNDRY_PROJECT_ENDPOINT,
    FOUNDRY_AGENT_NAME
)


class FoundryService:

    def __init__(self):
        self.project = AIProjectClient(
            endpoint=FOUNDRY_PROJECT_ENDPOINT,
            credential=DefaultAzureCredential()
        )

        self.openai = self.project.get_openai_client(
            agent_name=FOUNDRY_AGENT_NAME
        )

    def create_conversation(self):
        conversation = self.openai.conversations.create()
        return conversation.id

    def ask(self, question: str, conversation_id: str | None = None):

        if conversation_id is None:
            conversation_id = self.create_conversation()

        response = self.openai.responses.create(
            conversation=conversation_id,
            input=question
        )

        return {
            "conversation_id": conversation_id,
            "answer": response.output_text
        }

    def summarize(self, topic: str):

        conversation_id = self.create_conversation()

        prompt = f"""
Create a clear and concise study summary about: {topic}

Use only the available study material from the knowledge base.

Structure the summary with:
- Main idea
- Important concepts
- Key points
- Important terms or examples

Do not add information that is not supported by the study material.
If the topic is not covered in the study material, clearly say that it is not available.
"""

        response = self.openai.responses.create(
            conversation=conversation_id,
            input=prompt
        )

        return {
            "conversation_id": conversation_id,
            "summary": response.output_text
        }


foundry_service = FoundryService()