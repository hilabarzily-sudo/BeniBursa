import "server-only";
import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");
    client = new Anthropic({ apiKey });
  }
  return client;
}

export const MODELS = {
  orchestrator: "claude-sonnet-4-6",
  deepThinking: "claude-opus-4-7",
  fast: "claude-haiku-4-5-20251001",
} as const;
