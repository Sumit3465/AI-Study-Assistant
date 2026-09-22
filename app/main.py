import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.routes.study import router as study_router
from app.routes.chat import router as chat_router
from app.routes.quiz import router as quiz_router
from app.routes.revision import router as revision_router
from app.routes.auth import router as auth_router
from app.database import init_db

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

logger = logging.getLogger(__name__)

# Create DB tables on startup
init_db()

app = FastAPI(
    title="AI Study Assistant API",
    description="Backend API for the AI Study Assistant",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(chat_router)
app.include_router(study_router)
app.include_router(quiz_router)
app.include_router(revision_router)


# Serve frontend static files (CSS, JS)
app.mount("/static", StaticFiles(directory="frontend"), name="static")


@app.get("/")
def root():
    return FileResponse("frontend/auth.html")


@app.get("/dashboard")
def dashboard():
    return FileResponse("frontend/index.html")


@app.get("/health")
def health():
    return {"status": "healthy"}
