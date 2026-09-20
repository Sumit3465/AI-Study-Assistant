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
            "answer": response.output_test
        }


foundry_service = FoundryService()