import { EventSchemas, Inngest } from "inngest";
import type { ContentPlan } from "@benibursa/shared";

type Events = {
  "asset/uploaded": { data: { assetId: string; projectId: string } };
  "asset/analyzed": { data: { assetId: string; projectId: string } };
  "project/analysis-complete": { data: { projectId: string; assetIds: string[] } };
  "plan/generated": { data: { planId: string; projectId: string } };
  "piece/generation-requested": { data: { pieceId: string } };
  "piece/ready": { data: { pieceId: string; outputUrl: string } };
};

export const inngest = new Inngest({
  id: "benibursa",
  schemas: new EventSchemas().fromRecord<Events>(),
});

export type { ContentPlan };
