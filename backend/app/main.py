from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import health
from app.routers import business_profile, compliance


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: place initialization here (e.g., DB pool) as phases require
    yield
    # Shutdown: cleanup here


app = FastAPI(title="ClearPath API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(business_profile.router)
app.include_router(compliance.router)
