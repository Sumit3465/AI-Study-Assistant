from azure.identity import DefaultAzureCredential
from azure.ai.projects import AIProjectClient
import os
from dotenv import load_dotenv

load_dotenv()
endpoint = os.getenv("FOUNDRY_PROJECT_ENDPOINT")

credential = DefaultAzureCredential()

client = AIProjectClient(
    endpoint=endpoint,
    credential=credential
)
print("Succesfully connected to Microsoft Foundry!")