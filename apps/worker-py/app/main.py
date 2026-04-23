from fastapi import Depends, FastAPI, Header, HTTPException

from .config import Settings, get_settings
from .routers import analyze, generate

app = FastAPI(
    title="BeniBursa Worker",
    description="ML analysis & generation pipeline",
    version="0.1.0",
)


async def verify_secret(
    x_worker_secret: str | None = Header(default=None),
    settings: Settings = Depends(get_settings),
) -> None:
    if x_worker_secret != settings.worker_secret:
        raise HTTPException(status_code=401, detail="Invalid worker secret")


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(analyze.router, prefix="/analyze", dependencies=[Depends(verify_secret)])
app.include_router(generate.router, prefix="/generate", dependencies=[Depends(verify_secret)])
