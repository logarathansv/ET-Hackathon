from __future__ import annotations

import logging
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load .env early so backend services and imported MCP tools can read keys.
PROJECT_ROOT = Path(__file__).resolve().parents[1]
load_dotenv(PROJECT_ROOT / ".env")

from backend.routes.debate import router as debate_router
from backend.routes.market import router as market_router
from backend.routes.radar import router as radar_router
from backend.routes.simulate import router as simulate_router
from backend.routes.trace import router as trace_router
from backend.routes.analyze import router as analysis_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

app = FastAPI(title="AI Investor Copilot Backend")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(radar_router)
app.include_router(market_router)
app.include_router(debate_router)
app.include_router(trace_router)
app.include_router(simulate_router)
app.include_router(analysis_router)
