"""Reel renderer — MVP FFmpeg pipeline.

Takes source segments, concatenates, reframes to 9:16, burns captions, exports MP4.
Uploads result to Supabase Storage `outputs` bucket and returns a public URL.
"""

from __future__ import annotations

import subprocess
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from supabase import Client, create_client

from ..config import get_settings


@dataclass
class RenderResult:
    output_url: str
    thumbnail_url: str | None
    duration_ms: int


def _supabase_client() -> Client:
    settings = get_settings()
    if not settings.supabase_url or not settings.supabase_service_role_key:
        raise RuntimeError("Supabase credentials missing in worker")
    return create_client(settings.supabase_url, settings.supabase_service_role_key)


async def _fetch_asset_url(asset_id: str) -> str:
    client = _supabase_client()
    row = (
        client.table("assets")
        .select("storage_path, storage_bucket")
        .eq("id", asset_id)
        .single()
        .execute()
    )
    bucket = row.data["storage_bucket"]
    path = row.data["storage_path"]
    signed = client.storage.from_(bucket).create_signed_url(path, 3600)
    return signed["signedURL"] if "signedURL" in signed else signed["signed_url"]


def _ffmpeg_trim_and_reframe(
    input_url: str, start: float, end: float, output_path: Path
) -> None:
    """Trim segment and reframe to 9:16 (1080x1920) with scale+crop."""
    duration = end - start
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-ss",
            str(start),
            "-i",
            input_url,
            "-t",
            str(duration),
            "-vf",
            "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920",
            "-c:v",
            "libx264",
            "-preset",
            "fast",
            "-crf",
            "22",
            "-c:a",
            "aac",
            "-b:a",
            "128k",
            str(output_path),
        ],
        check=True,
        capture_output=True,
    )


def _ffmpeg_concat(segments: list[Path], output_path: Path) -> None:
    list_file = output_path.parent / f"{output_path.stem}_concat.txt"
    list_file.write_text("\n".join(f"file '{p.absolute()}'" for p in segments))
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-f",
            "concat",
            "-safe",
            "0",
            "-i",
            str(list_file),
            "-c",
            "copy",
            str(output_path),
        ],
        check=True,
        capture_output=True,
    )


def _ffmpeg_burn_caption(input_path: Path, caption: str, output_path: Path) -> None:
    escaped = caption.replace("'", "\\'").replace(":", "\\:")
    drawtext = (
        f"drawtext=text='{escaped}':"
        "fontcolor=white:fontsize=56:box=1:boxcolor=black@0.6:boxborderw=20:"
        "x=(w-text_w)/2:y=h-text_h-120"
    )
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-i",
            str(input_path),
            "-vf",
            drawtext,
            "-c:a",
            "copy",
            str(output_path),
        ],
        check=True,
        capture_output=True,
    )


def _ffmpeg_thumbnail(input_path: Path, output_path: Path) -> None:
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-i",
            str(input_path),
            "-ss",
            "0.5",
            "-frames:v",
            "1",
            "-q:v",
            "3",
            str(output_path),
        ],
        check=True,
        capture_output=True,
    )


async def render(
    piece_id: str,
    source_refs: list[dict[str, Any]],
    hook: str,
    caption: str,
    visual_treatment: dict[str, Any],
) -> RenderResult:
    import time

    start_time = time.time()
    settings = get_settings()
    work = settings.work_dir / piece_id
    work.mkdir(parents=True, exist_ok=True)

    # 1. Trim each segment
    segment_files: list[Path] = []
    for i, ref in enumerate(source_refs):
        url = await _fetch_asset_url(ref["assetId"])
        seg_out = work / f"seg_{i}.mp4"
        _ffmpeg_trim_and_reframe(url, ref["startSeconds"], ref["endSeconds"], seg_out)
        segment_files.append(seg_out)

    # 2. Concat
    concat_out = work / "concat.mp4"
    if len(segment_files) == 1:
        concat_out = segment_files[0]
    else:
        _ffmpeg_concat(segment_files, concat_out)

    # 3. Burn caption (hook)
    final_out = work / "final.mp4"
    if visual_treatment.get("includeCaptions", True):
        _ffmpeg_burn_caption(concat_out, hook, final_out)
    else:
        final_out = concat_out

    # 4. Thumbnail
    thumb_out = work / "thumb.jpg"
    _ffmpeg_thumbnail(final_out, thumb_out)

    # 5. Upload outputs
    client = _supabase_client()
    output_key = f"outputs/{piece_id}.mp4"
    thumb_key = f"thumbnails/{piece_id}.jpg"

    client.storage.from_("outputs").upload(
        path=output_key,
        file=final_out.read_bytes(),
        file_options={"content-type": "video/mp4", "upsert": "true"},
    )
    client.storage.from_("thumbnails").upload(
        path=thumb_key,
        file=thumb_out.read_bytes(),
        file_options={"content-type": "image/jpeg", "upsert": "true"},
    )

    output_url = client.storage.from_("outputs").get_public_url(output_key)
    thumb_url = client.storage.from_("thumbnails").get_public_url(thumb_key)

    return RenderResult(
        output_url=output_url,
        thumbnail_url=thumb_url,
        duration_ms=int((time.time() - start_time) * 1000),
    )
