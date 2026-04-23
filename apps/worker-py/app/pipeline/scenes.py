from pathlib import Path

from pydantic import BaseModel
from scenedetect import ContentDetector, detect as pyscene_detect


class Scene(BaseModel):
    index: int
    startSeconds: float
    endSeconds: float
    description: str | None = None
    keyframeUrl: str | None = None
    aestheticScore: float | None = None
    objects: list[str] = []
    actions: list[str] = []
    mood: str | None = None


def detect(path: Path, threshold: float = 27.0) -> list[Scene]:
    scene_list = pyscene_detect(str(path), ContentDetector(threshold=threshold))
    return [
        Scene(
            index=i,
            startSeconds=start.get_seconds(),
            endSeconds=end.get_seconds(),
        )
        for i, (start, end) in enumerate(scene_list)
    ]
