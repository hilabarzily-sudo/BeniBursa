from pathlib import Path

import httpx

from ..config import get_settings


async def fetch_to_local(source_url: str, asset_id: str) -> Path:
    """Downloads a signed URL to local disk for processing."""
    settings = get_settings()
    ext = source_url.split("?")[0].rsplit(".", 1)[-1].lower() or "bin"
    local_path = settings.work_dir / f"{asset_id}.{ext}"

    async with httpx.AsyncClient(timeout=httpx.Timeout(300.0)) as client:
        async with client.stream("GET", source_url) as response:
            response.raise_for_status()
            with local_path.open("wb") as f:
                async for chunk in response.aiter_bytes(chunk_size=1024 * 1024):
                    f.write(chunk)

    return local_path
