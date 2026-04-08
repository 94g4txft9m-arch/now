"""
STRINGS — FastAPI backend.

- Lokálne: `python3 main.py` alebo `npm run dev:api` → http://127.0.0.1:8000
- Vercel: natívna podpora FastAPI cez `app` v koreňovom main.py (bez Mangum).

Všetky HTTP endpointy sú pod prefixom /api, aby sa neprekrývali s Next.js (stránka /).
"""

import os

from dotenv import load_dotenv
from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
CORS_ORIGINS = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000,http://127.0.0.1:3330",
).split(",")

api_router = APIRouter(prefix="/api")


@api_router.get("/health")
def health():
    return {"status": "ok", "environment": ENVIRONMENT}


@api_router.get("/")
def api_root():
    return {
        "service": "STRINGS API",
        "docs": "/api/docs",
        "health": "/api/health",
    }


app = FastAPI(
    title="STRINGS API",
    version="1.0.0",
    description="FastAPI backend pre projekt STRINGS / now.",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
    redoc_url="/api/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in CORS_ORIGINS if o.strip()] or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=os.getenv("HOST", "127.0.0.1"),
        port=int(os.getenv("PORT", "8000")),
        reload=True,
    )
