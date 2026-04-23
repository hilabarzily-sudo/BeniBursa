# BeniBursa Worker

Python FastAPI service that runs the heavy ML pipeline (scene detection, Whisper transcription, Claude Vision, FFmpeg rendering) on behalf of the Node.js orchestrator.

## Requirements

- Python 3.11+
- `ffmpeg` on PATH

## Setup

```bash
cd apps/worker-py
python -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
cp .env.example .env
# fill in SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ANTHROPIC_API_KEY
```

## Run

```bash
uvicorn app.main:app --reload --port 8787
```

## Endpoints

| Method | Path       | Purpose                             |
|--------|------------|-------------------------------------|
| GET    | `/health`  | Liveness check                      |
| POST   | `/analyze` | Run full analysis on a source asset |
| POST   | `/generate`| Render a ContentPiece (reel only)   |

All endpoints except `/health` require `x-worker-secret` header.
