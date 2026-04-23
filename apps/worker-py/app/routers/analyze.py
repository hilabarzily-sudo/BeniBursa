from typing import Any, Literal

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, HttpUrl

from ..pipeline import download, media_info, scenes, transcribe, vision

router = APIRouter()


class AnalyzeRequest(BaseModel):
    assetId: str
    assetType: Literal["video", "image", "audio"]
    sourceUrl: HttpUrl


class AnalyzeResponse(BaseModel):
    scenes: list[dict[str, Any]]
    transcript: str | None = None
    transcriptSegments: list[dict[str, Any]] = []
    aestheticScores: list[dict[str, Any]] = []
    audioFeatures: dict[str, Any] = {}
    brandSignals: dict[str, Any] = {}
    colorPalette: list[str] = []
    ocrText: str | None = None
    summary: str | None = None
    keywords: list[str] = []
    language: str | None = None
    mood: str | None = None


@router.post("", response_model=AnalyzeResponse)
async def analyze(req: AnalyzeRequest) -> AnalyzeResponse:
    try:
        local_path = await download.fetch_to_local(str(req.sourceUrl), req.assetId)

        if req.assetType == "video":
            info = media_info.probe(local_path)
            scene_list = scenes.detect(local_path)
            transcript, segments, language = transcribe.run(local_path)
            vision_summary = await vision.summarize_scenes(local_path, scene_list)

            return AnalyzeResponse(
                scenes=[s.model_dump() for s in scene_list],
                transcript=transcript,
                transcriptSegments=[s.model_dump() for s in segments],
                colorPalette=vision_summary.color_palette,
                summary=vision_summary.summary,
                keywords=vision_summary.keywords,
                language=language,
                mood=vision_summary.mood,
                audioFeatures={
                    "hasSpeech": transcript is not None and len(transcript) > 10,
                    "durationSeconds": info.duration_seconds,
                },
            )

        if req.assetType == "image":
            vision_summary = await vision.summarize_image(local_path)
            return AnalyzeResponse(
                scenes=[],
                colorPalette=vision_summary.color_palette,
                summary=vision_summary.summary,
                keywords=vision_summary.keywords,
                mood=vision_summary.mood,
            )

        if req.assetType == "audio":
            transcript, segments, language = transcribe.run(local_path)
            return AnalyzeResponse(
                scenes=[],
                transcript=transcript,
                transcriptSegments=[s.model_dump() for s in segments],
                language=language,
            )

        raise HTTPException(status_code=400, detail=f"Unknown asset type: {req.assetType}")

    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
