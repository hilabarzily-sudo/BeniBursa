import { z } from "zod";

export const SceneSchema = z.object({
  index: z.number().int().nonnegative(),
  startSeconds: z.number().nonnegative(),
  endSeconds: z.number().positive(),
  description: z.string().optional(),
  keyframeUrl: z.string().url().optional(),
  aestheticScore: z.number().min(0).max(10).optional(),
  objects: z.array(z.string()).optional(),
  actions: z.array(z.string()).optional(),
  mood: z.string().optional(),
});

export const TranscriptSegmentSchema = z.object({
  startSeconds: z.number().nonnegative(),
  endSeconds: z.number().positive(),
  speaker: z.string().optional(),
  text: z.string(),
  confidence: z.number().min(0).max(1).optional(),
});

export const AnalysisSchema = z.object({
  assetId: z.string().uuid(),
  scenes: z.array(SceneSchema),
  transcript: z.string().optional(),
  transcriptSegments: z.array(TranscriptSegmentSchema),
  language: z.string().optional(),
  summary: z.string().optional(),
  keywords: z.array(z.string()),
  mood: z.string().optional(),
  colorPalette: z.array(z.string().regex(/^#[0-9a-fA-F]{6}$/)),
});

export type AnalysisInput = z.input<typeof AnalysisSchema>;
