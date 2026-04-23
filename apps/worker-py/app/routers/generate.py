from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ..pipeline import render_reel

router = APIRouter()


class GenerateRequest(BaseModel):
    pieceId: str
    type: str
    platform: str
    sourceRefs: list[dict[str, Any]]
    hook: str
    caption: str
    visualTreatment: dict[str, Any]


class GenerateResponse(BaseModel):
    outputUrl: str
    thumbnailUrl: str | None = None
    modelUsed: str = "ffmpeg-pipeline"
    costUsd: float = 0.0
    durationMs: int | None = None


@router.post("", response_model=GenerateResponse)
async def generate(req: GenerateRequest) -> GenerateResponse:
    if req.type != "reel":
        raise HTTPException(
            status_code=501,
            detail=f"Generation for type '{req.type}' not implemented yet (MVP: reel only)",
        )

    try:
        result = await render_reel.render(
            piece_id=req.pieceId,
            source_refs=req.sourceRefs,
            hook=req.hook,
            caption=req.caption,
            visual_treatment=req.visualTreatment,
        )
        return GenerateResponse(
            outputUrl=result.output_url,
            thumbnailUrl=result.thumbnail_url,
            durationMs=result.duration_ms,
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
