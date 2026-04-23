import { inngest } from "../client";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { buildContentPlan } from "@/lib/anthropic/strategy";

/**
 * Step 2 of the pipeline.
 * After all assets in a project are analyzed, call Claude to produce a ContentPlan.
 *
 * Triggers when asset/analyzed fires — checks whether all assets in the project
 * are done; if so, proceeds to strategize.
 */
export const strategizeProject = inngest.createFunction(
  {
    id: "strategize-project",
    name: "Strategize project",
    retries: 2,
    concurrency: { limit: 3 },
  },
  { event: "asset/analyzed" },
  async ({ event, step }) => {
    const { projectId } = event.data;
    const admin = createAdminSupabaseClient();

    const ready = await step.run("check-all-assets-ready", async () => {
      const { data: assets, error } = await admin
        .from("assets")
        .select("id, status")
        .eq("project_id", projectId);
      if (error) throw new Error(error.message);
      const allDone = assets.every((a) => a.status === "analyzed");
      return { allDone, assetIds: assets.map((a) => a.id) };
    });

    if (!ready.allDone) return { skipped: "assets-still-analyzing" };

    const job = await step.run("create-strategy-job", async () => {
      const { data, error } = await admin
        .from("jobs")
        .insert({
          project_id: projectId,
          type: "strategize",
          status: "running",
          started_at: new Date().toISOString(),
        })
        .select("id")
        .single();
      if (error) throw new Error(error.message);
      return data;
    });

    const plan = await step.run("call-claude", async () => {
      const { data: project, error: projErr } = await admin
        .from("projects")
        .select("id, name, brand_voice, primary_language, target_platforms")
        .eq("id", projectId)
        .single();
      if (projErr || !project) throw new Error("Project not found");

      const { data: analyses, error: analysesErr } = await admin
        .from("analyses")
        .select(
          "asset_id, scenes, transcript, summary, keywords, language, mood, color_palette",
        )
        .in("asset_id", ready.assetIds);
      if (analysesErr) throw new Error(analysesErr.message);

      return buildContentPlan({
        project,
        analyses,
        platform: project.target_platforms?.[0] ?? "instagram",
      });
    });

    const planRecord = await step.run("persist-plan", async () => {
      const { data, error } = await admin
        .from("content_plans")
        .insert({
          project_id: projectId,
          platform: plan.platform,
          plan,
          source_asset_ids: ready.assetIds,
          model_used: plan.modelUsed,
        })
        .select("id")
        .single();
      if (error) throw new Error(error.message);

      const pieceRows = plan.pieces.map((piece) => ({
        plan_id: data.id,
        project_id: projectId,
        type: piece.type,
        platform: piece.platform,
        source_refs: piece.sourceSegments,
        hook: piece.hook,
        caption: piece.caption,
        caption_variants: piece.captionVariants ?? {},
        hashtags: piece.hashtags,
        music_brief: piece.musicBrief,
        visual_treatment: piece.visualTreatment,
        predicted_performance_score: piece.predictedPerformanceScore,
        rationale: piece.rationale,
        status: "planned" as const,
      }));

      const { error: piecesErr } = await admin.from("content_pieces").insert(pieceRows);
      if (piecesErr) throw new Error(piecesErr.message);

      await admin
        .from("jobs")
        .update({
          status: "completed",
          progress: 100,
          completed_at: new Date().toISOString(),
        })
        .eq("id", job.id);

      return data;
    });

    await step.sendEvent("plan-ready", {
      name: "plan/generated",
      data: { planId: planRecord.id, projectId },
    });

    return { planId: planRecord.id, pieceCount: plan.pieces.length };
  },
);
