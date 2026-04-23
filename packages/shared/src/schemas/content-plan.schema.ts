import { z } from "zod";
import { PLATFORMS, PIECE_TYPES } from "../types/platform";

export const PlatformSchema = z.enum(PLATFORMS);
export const PieceTypeSchema = z.enum(PIECE_TYPES);
export const AspectRatioSchema = z.enum(["9:16", "1:1", "4:5", "16:9"]);

export const SourceSegmentSchema = z.object({
  assetId: z.string().uuid(),
  startSeconds: z.number().nonnegative(),
  endSeconds: z.number().positive(),
  note: z.string().optional(),
}).refine((s) => s.endSeconds > s.startSeconds, {
  message: "endSeconds must be greater than startSeconds",
});

export const VisualTreatmentSchema = z.object({
  aspectRatio: AspectRatioSchema,
  includeCaptions: z.boolean(),
  captionStyle: z.enum(["bold_center", "bottom_subtitle", "karaoke"]).optional(),
  colorGrade: z.string().optional(),
  textOverlays: z.array(z.object({
    text: z.string(),
    startSeconds: z.number().nonnegative(),
    endSeconds: z.number().positive(),
    position: z.enum(["top", "center", "bottom"]),
  })).optional(),
  musicVolume: z.number().min(0).max(1).optional(),
});

export const ContentPieceSchema = z.object({
  type: PieceTypeSchema,
  platform: PlatformSchema,
  sourceSegments: z.array(SourceSegmentSchema).min(1),
  hook: z.string().min(1).max(200),
  caption: z.string().min(1).max(2500),
  captionVariants: z.object({
    short: z.string().max(150).optional(),
    medium: z.string().max(500).optional(),
    long: z.string().max(2500).optional(),
    hebrew: z.string().optional(),
    english: z.string().optional(),
  }).optional(),
  hashtags: z.array(z.string().regex(/^#?[\w֐-׿]+$/)).max(30),
  musicBrief: z.string().optional(),
  visualTreatment: VisualTreatmentSchema,
  predictedPerformanceScore: z.number().min(0).max(100),
  rationale: z.string().min(10),
});

export const ContentPlanSchema = z.object({
  platform: PlatformSchema,
  pieces: z.array(ContentPieceSchema).min(1),
  generatedAt: z.string().datetime(),
  modelUsed: z.string(),
  sourceAssetIds: z.array(z.string().uuid()).min(1),
});

export type ContentPlanInput = z.input<typeof ContentPlanSchema>;
export type ContentPlanOutput = z.output<typeof ContentPlanSchema>;
