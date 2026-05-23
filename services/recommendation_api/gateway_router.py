import os
from typing import Any

from dotenv import load_dotenv
from fastapi import FastAPI
from pydantic import BaseModel

load_dotenv()

app = FastAPI(title="TradeMatch BI Recommendation Gateway", version="0.1.0")


class RecommendationRequest(BaseModel):
    query: str
    market: str | None = None
    max_results: int = 5


@app.get("/health")
def health() -> dict[str, Any]:
    return {
        "status": "ok",
        "neo4j_uri": os.getenv("NEO4J_URI", "not-set"),
        "qdrant_url": os.getenv("QDRANT_URL", "not-set"),
    }


@app.get("/")
def root() -> dict[str, str]:
    return {
        "service": "TradeMatch BI Gateway",
        "docs": "/docs",
    }


@app.post("/recommend")
def recommend(payload: RecommendationRequest) -> dict[str, Any]:
    # Placeholder implementation for local bring-up.
    # Replace with your real litellm + qdrant + neo4j orchestration logic.
    return {
        "query": payload.query,
        "market": payload.market,
        "max_results": payload.max_results,
        "recommendations": [],
    }
