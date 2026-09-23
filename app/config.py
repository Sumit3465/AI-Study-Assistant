import os
from dotenv import load_dotenv

load_dotenv()

FOUNDRY_PROJECT_ENDPOINT = os.getenv("FOUNDRY_PROJECT_ENDPOINT")
FOUNDRY_AGENT_NAME = os.getenv("FOUNDRY_AGENT_NAME")
FOUNDRY_AGENT_VERSION = os.getenv("FOUNDRY_AGENT_VERSION")

if not FOUNDRY_PROJECT_ENDPOINT:
    raise ValueError("FOUNDRY_PROJECT_ENDPOINT is not configured")

if not FOUNDRY_AGENT_NAME:
    raise ValueError("FOUNDRY_AGENT_NAME is not configured")