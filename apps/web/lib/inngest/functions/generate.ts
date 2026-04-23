import { inngest } from "../client";
import { createAdminSupabaseClient } from "@/lib/supabase/server";

/**
 * Step 3 of the pipeline.
 * When a plan is generated, fan out a generation job per piece.
 * Each piece is sent to the Python worker for rendering (FFmpeg, captions, etc).
 */
export const fanoutPieceGeneration = inngest.createFunction(
  {
    id: "fanout-piece-generation",
    name: "Fanout piece generation",
  },
  { event: "plan/generated" },
  async ({ event, step }) => {
    const { planId } = event.data;
    const admin = createAdminSupabaseClient();

    const pieces = await step.run("fetch-pieces", async () => {
      const { data, error } = await admin
        .from("content_pieces")
        .select("id")
        .eq("plan_id", planId)
        .eq("status", "planned");
      if (error) throw new Error(error.message);
      return data;
    });

    await step.sendEvent(
      "dispatch-generations",
      pieces.map((p) => ({
        name: "piece/generation-requested" as const,
        data: { pieceId: p.id },
      })),
    );

    return { dispatched: pieces.length };
  },
);

/**
 * Per-piece generation. Renders the actual output file.
 * For Phase 1 (MVP) we only handle `reel` type via FFmpeg in the Python worker.
 */
export const generatePiece = inngest.createFunction(
  {
    id: "generate-piece",
    name: "Generate piece",
    retries: 2,
    concurrency: { limit: 3 },
  },
  { event: "piece/generation-requested" },
  async ({ event, step }) => {
    const { pieceId } = event.data;
    const admin = createAdminSupabaseClient();

    const piece = await step.run("load-piece", async () => {
      const { data, error } = await admin
        .from("content_pieces")
        .select("*, content_plans!inner(project_id)")
        .eq("id", pieceId)
        .single();
      if (error || !data) throw new Error("Piece not found");
      await admin.from("content_pieces").update({ status: "generating" }).eq("id", pieceId);
      return data;
    });

    const output = await step.run("call-python-generator", async () => {
      const workerUrl = process.env.WORKER_URL ?? "http://localhost:8787";
      const workerSecret = process.env.WORKER_SECRET ?? "dev-shared-secret-change-me";

      const res = await fetch(`${workerUrl}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-worker-secret": workerSecret,
        },
        body: JSON.stringify({
          pieceId,
          type: piece.type,
          platform: piece.platform,
          sourceRefs: piece.source_refs,
          hook: piece.hook,
          caption: piece.caption,
          visualTreatment: piece.visual_treatment,
        }),
      });
      if (!res.ok) throw new Error(`Generator failed: ${await res.text()}`);
      return res.json();
    });

    await step.run("persist-output", async () => {
      await admin
        .from("content_pieces")
        .update({
          status: "ready",
          output_url: output.outputUrl,
          thumbnail_url: output.thumbnailUrl,
        })
        .eq("id", pieceId);

      await admin.from("generations").insert({
        piece_id: pieceId,
        model_used: output.modelUsed ?? "ffmpeg-pipeline",
        cost_usd: output.costUsd ?? 0,
        duration_ms: output.durationMs,
        output_url: output.outputUrl,
      });
    });

    await step.sendEvent("piece-ready", {
      name: "piece/ready",
      data: { pieceId, outputUrl: output.outputUrl },
    });

    return { pieceId, outputUrl: output.outputUrl };
  },
);
