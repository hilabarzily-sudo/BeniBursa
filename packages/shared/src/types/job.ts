export type JobType = "analyze" | "strategize" | "generate" | "export";

export type JobStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export interface Job {
  id: string;
  projectId: string;
  type: JobType;
  status: JobStatus;
  progress: number;
  inngestRunId?: string;
  relatedAssetId?: string;
  relatedPieceId?: string;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  errorMessage?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}
