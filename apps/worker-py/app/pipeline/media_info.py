from dataclasses import dataclass
from pathlib import Path

import ffmpeg


@dataclass
class MediaInfo:
    duration_seconds: float
    width: int | None
    height: int | None
    codec: str | None
    has_audio: bool


def probe(path: Path) -> MediaInfo:
    data = ffmpeg.probe(str(path))
    video_stream = next((s for s in data["streams"] if s["codec_type"] == "video"), None)
    audio_stream = next((s for s in data["streams"] if s["codec_type"] == "audio"), None)
    duration = float(data["format"].get("duration", 0))

    return MediaInfo(
        duration_seconds=duration,
        width=int(video_stream["width"]) if video_stream else None,
        height=int(video_stream["height"]) if video_stream else None,
        codec=video_stream["codec_name"] if video_stream else None,
        has_audio=audio_stream is not None,
    )
