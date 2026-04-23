import { inngest } from "../client";
import { createAdminSupabaseClient } from "@/lib/supabase/server";

/**
 * Step 1 of the pipeline.
 * Triggered when an asset finishes uploading.
 * Delegates the heavy ML work to the Python worker and persists the result.
 */
export const analyzeAsset = inngest.createFunction(
  {
    id: "analyze-asset",
    name: "Analyze asset",
    retries: 2,
    concurrency: { limit: 5 },
  },
  { event: "asset/uploaded" },
  async ({ event, step }) => {
    const { assetId, projectId } = event.data;
    const admin = createAdminSupabaseClient();

    const job = await step.run("create-job-record", async () => {
      const { data, error } = await admin
        .from("jobs")
        .insert({
          project_id: projectId,
          type: "analyze",
          status: "running",
          related_asset_id: assetId,
          started_at: new Date().toISOString(),
        })
        .select("id")
        .single();
      if (error) throw new Error(error.message);
      await admin.from("assets").update({ status: "analyzing" }).eq("id", assetId);
      return data;
    });

    const signedUrl = await step.run("get-signed-url", async () => {
      const { data: asset, error } = await admin
        .from("assets")
        .select("storage_path, storage_bucket, type")
        .eq("id", assetId)
        .single();
      if (error || !asset) throw new Error("Asset not found");

      const { data: signed, error: signErr } = await admin.storage
        .from(asset.storage_bucket)
        .createSignedUrl(asset.storage_path, 60 * 60);
      if (signErr) throw new Error(signErr.message);

      return { url: signed.signedUrl, type: asset.type };
    });

    const analysis = await step.run("call-python-worker", async () => {
      const workerUrl = process.env.WORKER_URL ?? "http://localhost:8787";
      const workerSecret = process.env.WORKER_SECRET ?? "dev-shared-secret-change-me";

      const res = await fetch(`${workerUrl}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-worker-secret": workerSecret,
        },
        body: JSON.stringify({
          assetId,
          assetType: signedUrl.type,
          sourceUrl: signedUrl.url,
        }),
      });
      if (!res.ok) throw new Error(`Worker failed: ${res.status} ${await res.text()}`);
      return res.json();
    });

    await step.run("persist-analysis", async () => {
      const { error } = await admin.from("analyses").insert({
        asset_id: assetId,
        scenes: analysis.scenes ?? [],
        transcript: analysis.transcript,
        transcript_segments: analysis.transcriptSegments ?? [],
        aesthetic_scores: analysis.aestheticScores ?? [],
        audio_features: analysis.audioFeatures ?? {},
        brand_signals: analysis.brandSignals ?? {},
        color_palette: analysis.colorPalette ?? [],
        ocr_text: analysis.ocrText,
        summary: analysis.summary,
        keywords: analysis.keywords ?? [],
        language: analysis.language,
        mood: analysis.mood,
        completed_at: new Date().toISOString(),
      });
      if (error) throw new Error(error.message);

      await admin.from("assets").update({ status: "analyzed" }).eq("id", assetId);
      await admin
        .from("jobs")
        .update({
          status: "completed",
          progress: 100,
          completed_at: new Date().toISOString(),
        })
        .eq("id", job.id);
    });

    await step.sendEvent("fanout-analyzed", {
      name: "asset/analyzed",
      data: { assetId, projectId },
    });

    return { assetId, jobId: job.id };
  },
);
