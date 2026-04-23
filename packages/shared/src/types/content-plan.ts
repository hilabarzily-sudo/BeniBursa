import type { Platform, PieceType, AspectRatio } from "./platform";

export interface SourceSegment {
  assetId: string;
  startSeconds: number;
  endSeconds: number;
  note?: string;
}

export interface VisualTreatment {
  aspectRatio: AspectRatio;
  includeCaptions: boolean;
  captionStyle?: "bold_center" | "bottom_subtitle" | "karaoke";
  colorGrade?: string;
  textOverlays?: Array<{
    text: string;
    startSeconds: number;
    endSeconds: number;
    position: "top" | "center" | "bottom";
  }>;
  musicVolume?: number;
}

export interface ContentPiece {
  id?: string;
  type: PieceType;
  platform: Platform;
  sourceSegments: SourceSegment[];
  hook: string;
  caption: string;
  captionVariants?: {
    short?: string;
    medium?: string;
    long?: string;
    hebrew?: string;
    english?: string;
  };
  hashtags: string[];
  musicBrief?: string;
  visualTreatment: VisualTreatment;
  predictedPerformanceScore: number;
  rationale: string;
}

export interface ContentPlan {
  platform: Platform;
  pieces: ContentPiece[];
  generatedAt: string;
  modelUsed: string;
  sourceAssetIds: string[];
}
