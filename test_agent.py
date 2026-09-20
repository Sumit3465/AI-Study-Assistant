import os
from dotenv import load_dotenv
from azure.identity import DefaultAzureCredential
from azure.ai.projects import AIProjectClient

load_dotenv()

endpoint = os.getenv("FOUNDRY_PROJECT_ENDPOINT")
agent_name = os.getenv("FOUNDRY_AGENT_NAME")

project = AIProjectClient(
    endpoint=endpoint,
    credential=DefaultAzureCredential()
)

openai = project.get_openai_client(agent_name=agent_name)

conversation = openai.conversations.create()

response = openai.responses.create(
    conversation=conversation.id,
    input="Explain quantum entanglement according to my networking study material."
)

print("\nAgent Response:\n")
print(response.output_text)