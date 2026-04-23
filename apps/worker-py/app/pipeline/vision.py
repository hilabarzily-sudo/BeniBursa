"""Vision understanding via Claude.

Extracts brand signals, mood, color palette, and summary from keyframes.
For MVP we use Claude Vision directly — can later swap to Twelve Labs for video-native.
"""

from __future__ import annotations

import base64
import json
import subprocess
from dataclasses import dataclass
from pathlib import Path

from anthropic import Anthropic

from ..config import get_settings
from .scenes import Scene


@dataclass
class VisionSummary:
    summary: str
    keywords: list[str]
    mood: str
    color_palette: list[str]


def _extract_keyframe(video_path: Path, timestamp: float, output_path: Path) -> None:
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-ss",
            str(timestamp),
            "-i",
            str(video_path),
            "-frames:v",
            "1",
            "-q:v",
            "3",
            str(output_path),
        ],
        check=True,
        capture_output=True,
    )


def _encode_image(path: Path) -> str:
    return base64.standard_b64encode(path.read_bytes()).decode("utf-8")


def _get_client() -> Anthropic:
    settings = get_settings()
    if not settings.anthropic_api_key:
        raise RuntimeError("ANTHROPIC_API_KEY not configured in worker")
    return Anthropic(api_key=settings.anthropic_api_key)


_VISION_SYSTEM = """You analyze still frames extracted from social media source material.
Return STRICT JSON matching this schema:
{
  "summary": "1-2 sentence description",
  "keywords": ["list", "of", "keywords"],
  "mood": "single mood word",
  "colorPalette": ["#rrggbb", ...up to 5]
}
No prose. No markdown. JSON only."""


def _parse_json(raw: str) -> dict:
    raw = raw.strip()
    start = raw.find("{")
    end = raw.rfind("}")
    if start == -1 or end == -1:
        raise ValueError(f"Non-JSON response: {raw[:200]}")
    return json.loads(raw[start : end + 1])


async def summarize_scenes(video_path: Path, scenes: list[Scene]) -> VisionSummary:
    settings = get_settings()
    if not settings.anthropic_api_key:
        return VisionSummary(
            summary="(Claude API key not configured — vision analysis skipped)",
            keywords=[],
            mood="unknown",
            color_palette=[],
        )

    # sample up to 4 keyframes spread across the video
    sample_count = min(4, len(scenes)) if scenes else 0
    if sample_count == 0:
        return VisionSummary(summary="", keywords=[], mood="unknown", color_palette=[])

    step = max(1, len(scenes) // sample_count)
    sampled = scenes[::step][:sample_count]

    images = []
    for idx, scene in enumerate(sampled):
        kf_path = settings.work_dir / f"kf_{video_path.stem}_{idx}.jpg"
        mid = (scene.startSeconds + scene.endSeconds) / 2
        _extract_keyframe(video_path, mid, kf_path)
        images.append(
            {
                "type": "image",
                "source": {
                    "type": "base64",
                    "media_type": "image/jpeg",
                    "data": _encode_image(kf_path),
                },
            }
        )

    client = _get_client()
    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=1000,
        system=_VISION_SYSTEM,
        messages=[
            {
                "role": "user",
                "content": [
                    *images,
                    {
                        "type": "text",
                        "text": "Analyze these keyframes together. Return JSON per the schema.",
                    },
                ],
            }
        ],
    )

    text = next((b.text for b in response.content if b.type == "text"), "")
    parsed = _parse_json(text)
    return VisionSummary(
        summary=parsed.get("summary", ""),
        keywords=parsed.get("keywords", []),
        mood=parsed.get("mood", "unknown"),
        color_palette=parsed.get("colorPalette", []),
    )


async def summarize_image(image_path: Path) -> VisionSummary:
    settings = get_settings()
    if not settings.anthropic_api_key:
        return VisionSummary(
            summary="(Claude API key not configured — vision analysis skipped)",
            keywords=[],
            mood="unknown",
            color_palette=[],
        )

    client = _get_client()
    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=1000,
        system=_VISION_SYSTEM,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": "image/jpeg",
                            "data": _encode_image(image_path),
                        },
                    },
                    {"type": "text", "text": "Analyze this image. Return JSON per the schema."},
                ],
            }
        ],
    )

    text = next((b.text for b in response.content if b.type == "text"), "")
    parsed = _parse_json(text)
    return VisionSummary(
        summary=parsed.get("summary", ""),
        keywords=parsed.get("keywords", []),
        mood=parsed.get("mood", "unknown"),
        color_palette=parsed.get("colorPalette", []),
    )
