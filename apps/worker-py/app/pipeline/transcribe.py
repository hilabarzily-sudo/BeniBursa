from functools import lru_cache
from pathlib import Path

import whisper
from pydantic import BaseModel

from ..config import get_settings


class TranscriptSegment(BaseModel):
    startSeconds: float
    endSeconds: float
    speaker: str | None = None
    text: str
    confidence: float | None = None


@lru_cache(maxsize=1)
def _load_model():
    settings = get_settings()
    return whisper.load_model(settings.whisper_model)


def run(path: Path) -> tuple[str, list[TranscriptSegment], str | None]:
    """Returns (full_transcript, segments, detected_language)."""
    model = _load_model()
    result = model.transcribe(str(path), verbose=False)

    full_text = result["text"].strip()
    language = result.get("language")

    segments = [
        TranscriptSegment(
            startSeconds=seg["start"],
            endSeconds=seg["end"],
            text=seg["text"].strip(),
            confidence=seg.get("avg_logprob"),
        )
        for seg in result.get("segments", [])
    ]

    return full_text, segments, language
