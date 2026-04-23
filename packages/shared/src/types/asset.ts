export type AssetType = "video" | "image" | "audio";

export type AssetStatus =
  | "pending"
  | "uploading"
  | "uploaded"
  | "analyzing"
  | "analyzed"
  | "failed";

export interface Asset {
  id: string;
  projectId: string;
  type: AssetType;
  filename: string;
  storagePath: string;
  storageBucket: string;
  durationSeconds?: number;
  resolution?: string;
  codec?: string;
  sizeBytes?: number;
  status: AssetStatus;
  metadata: Record<string, unknown>;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}
