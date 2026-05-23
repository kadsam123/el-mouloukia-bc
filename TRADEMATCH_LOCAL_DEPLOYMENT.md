# TradeMatch BI - Local Deployment and Transition Guide

This repository now includes a backend starter scaffold for local deployment.

## What was added

- docker-compose.yml
- requirements.txt
- .env.example
- services/recommendation_api/gateway_router.py
- services/matching_engine/
- services/knowledge_graph/
- services/ingestion/

## Important correction

For Python imports, folder names must use underscores, not hyphens.

Use:
- services/recommendation_api

Do not use:
- services/recommendation-api

## Step 1: Start Docker infrastructure

From project root:

```powershell
docker compose up -d
```

Check status:

```powershell
docker compose ps
```

Services:
- PostgreSQL: localhost:5432
- Qdrant: localhost:6333
- Neo4j Browser: http://localhost:7474

## Step 2: Create Python virtual environment

Windows PowerShell:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

## Step 3: Configure environment values

Create .env from .env.example and fill real API keys:

```powershell
Copy-Item .env.example .env
```

Set at least:
- OPENAI_API_KEY or GEMINI_API_KEY
- NEO4J_PASSWORD

## Step 4: Run API gateway

```powershell
uvicorn services.recommendation_api.gateway_router:app --reload --port 8000
```

Open:
- API root: http://127.0.0.1:8000
- Swagger docs: http://127.0.0.1:8000/docs
- Health check: http://127.0.0.1:8000/health

## Step 5: Bring your generated code

Replace placeholder logic in services/recommendation_api/gateway_router.py with your compiled implementation from the interactive spec.

Then place additional modules inside:
- services/matching_engine
- services/knowledge_graph
- services/ingestion

## Notes

- Keep secrets only in .env (never commit real keys).
- Use Docker volumes to preserve database state between restarts.
- Stop services when done:

```powershell
docker compose down
```
