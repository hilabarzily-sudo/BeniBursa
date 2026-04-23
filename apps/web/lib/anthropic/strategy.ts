import "server-only";
import {
  ContentPlanSchema,
  instagramPlaybook,
  type ContentPlan,
  type Platform,
} from "@benibursa/shared";
import { getAnthropicClient, MODELS } from "./client";

interface StrategyInput {
  project: {
    id: string;
    name: string;
    brand_voice: Record<string, unknown> | null;
    primary_language: string | null;
  };
  analyses: Array<{
    asset_id: string;
    scenes: unknown;
    transcript: string | null;
    summary: string | null;
    keywords: string[] | null;
    language: string | null;
    mood: string | null;
    color_palette: unknown;
  }>;
  platform: Platform;
}

const SYSTEM_PROMPT = `You are a senior social media strategist working in Hebrew and English.
You produce platform-native content plans from raw media analyses.

You MUST return a single JSON object matching the ContentPlan schema.
Do not include prose or markdown. Output valid JSON only.

Rules:
- Every sourceSegment endSeconds must be greater than startSeconds.
- Never invent scenes that don't exist in the analyses — only use segments
  the user actually uploaded.
- Hooks must be strong pattern interrupts, optimized for the first 2 seconds.
- Captions must be in the project's primary_language, with English variants when relevant.
- Every piece must have a rationale field explaining why it will perform well on the platform.
- Aim for MAXIMUM tactical output: extract 5-15 distinct pieces when the source material supports it.`;

export async function buildContentPlan(input: StrategyInput): Promise<ContentPlan> {
  const client = getAnthropicClient();

  const playbook = input.platform === "instagram" ? instagramPlaybook : instagramPlaybook;

  const userMessage = `Project: ${input.project.name}
Primary language: ${input.project.primary_language ?? "he"}
Brand voice: ${JSON.stringify(input.project.brand_voice ?? {})}
Target platform: ${input.platform}

Platform playbook (authoritative — follow these specs):
${JSON.stringify(playbook, null, 2)}

Raw material analyses:
${JSON.stringify(input.analyses, null, 2)}

Produce the MAXIMUM tactical ContentPlan. Output JSON matching this TypeScript type:

type ContentPlan = {
  platform: "${input.platform}";
  pieces: Array<{
    type: "reel" | "carousel" | "static_post" | "story" | "feed_grid";
    platform: "${input.platform}";
    sourceSegments: Array<{ assetId: string; startSeconds: number; endSeconds: number; note?: string }>;
    hook: string;
    caption: string;
    captionVariants?: { short?: string; medium?: string; long?: string; hebrew?: string; english?: string };
    hashtags: string[];
    musicBrief?: string;
    visualTreatment: {
      aspectRatio: "9:16" | "1:1" | "4:5" | "16:9";
      includeCaptions: boolean;
      captionStyle?: "bold_center" | "bottom_subtitle" | "karaoke";
      textOverlays?: Array<{ text: string; startSeconds: number; endSeconds: number; position: "top" | "center" | "bottom" }>;
    };
    predictedPerformanceScore: number;  // 0-100
    rationale: string;
  }>;
  generatedAt: string;  // ISO datetime
  modelUsed: string;
  sourceAssetIds: string[];
};

JSON:`;

  const response = await client.messages.create({
    model: MODELS.orchestrator,
    max_tokens: 8000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Claude returned no text content");
  }

  const raw = textBlock.text.trim();
  const jsonStart = raw.indexOf("{");
  const jsonEnd = raw.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error(`Claude did not return valid JSON: ${raw.slice(0, 200)}`);
  }
  const jsonText = raw.slice(jsonStart, jsonEnd + 1);

  const parsed = JSON.parse(jsonText);
  const withMeta = {
    ...parsed,
    generatedAt: parsed.generatedAt ?? new Date().toISOString(),
    modelUsed: MODELS.orchestrator,
    sourceAssetIds: parsed.sourceAssetIds ?? input.analyses.map((a) => a.asset_id),
  };

  const validated = ContentPlanSchema.parse(withMeta);
  return validated;
}
