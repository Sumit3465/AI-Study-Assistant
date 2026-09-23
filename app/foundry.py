
from azure.ai.projects import AIProjectClient
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

    def generate_quiz(self, topic: str):

        conversation_id = self.create_conversation()

        prompt = f"""
Create a quiz about: {topic}

Use only the available study material from the knowledge base.

Important instructions for topic retrieval:
- If the requested topic contains multiple concepts joined by words such as
  "and", "or", or commas, treat each concept as a separate related topic.
- Retrieve and use relevant study material for all requested concepts.
- Combine the retrieved information into one quiz covering the requested topic.
- Do not require the exact combined phrase to appear in the study material.
- For example, if the topic is "TCP and UDP", retrieve information about
  both TCP and UDP and create questions covering both.
- If none of the requested concepts are covered by the study material,
  clearly say that the topic is not available.

Create 5 multiple-choice questions.

For each question provide:
- Question
- 4 options labeled A, B, C, D
- Correct answer
- Short explanation

Make the questions suitable for a college student studying for an exam.

Do not add information that is not supported by the study material.
"""

        response = self.openai.responses.create(
            conversation=conversation_id,
            input=prompt
        )

        return {
            "conversation_id": conversation_id,
            "quiz": response.output_text
        }

    def generate_revision_notes(self, topic: str):

        conversation_id = self.create_conversation()

        prompt = f"""
Create concise exam-oriented revision notes about: {topic}

Use only the available study material from the knowledge base.

Structure the notes with:
- Topic overview
- Key concepts
- Important definitions
- Important points to remember
- Protocols, examples, or comparisons if relevant
- Quick exam revision points

Keep the notes clear, concise, and easy to revise.

Do not add information that is not supported by the study material.
If the topic is not covered in the study material, clearly say that the topic is not available.
"""

        response = self.openai.responses.create(
            conversation=conversation_id,
            input=prompt
        )

        return {
            "conversation_id": conversation_id,
            "notes": response.output_text
        }


foundry_service = FoundryService()
