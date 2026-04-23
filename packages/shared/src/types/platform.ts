export const PLATFORMS = [
  "instagram",
  "tiktok",
  "facebook",
  "twitter",
  "linkedin",
  "youtube",
] as const;

export type Platform = (typeof PLATFORMS)[number];

export const PIECE_TYPES = [
  "reel",
  "carousel",
  "static_post",
  "story",
  "short",
  "thread",
  "feed_grid",
] as const;

export type PieceType = (typeof PIECE_TYPES)[number];

export type AspectRatio = "9:16" | "1:1" | "4:5" | "16:9";

export interface PlatformSpec {
  platform: Platform;
  pieceType: PieceType;
  aspectRatio: AspectRatio;
  minDurationSeconds?: number;
  maxDurationSeconds?: number;
  maxCaptionLength: number;
  maxHashtags: number;
  recommendedHookLength: number;
}
