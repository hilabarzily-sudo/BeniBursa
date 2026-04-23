export interface Scene {
  index: number;
  startSeconds: number;
  endSeconds: number;
  description?: string;
  keyframeUrl?: string;
  aestheticScore?: number;
  objects?: string[];
  actions?: string[];
  mood?: string;
}

export interface TranscriptSegment {
  startSeconds: number;
  endSeconds: number;
  speaker?: string;
  text: string;
  confidence?: number;
}

export interface AudioFeatures {
  hasMusic: boolean;
  hasSpeech: boolean;
  energy: number;
  tempo?: number;
  loudnessLufs?: number;
  dominantMood?: string;
}

export interface BrandSignals {
  vibe: string;
  targetAudience: string;
  styleKeywords: string[];
  colorPalette: string[];
  typographyHint?: string;
}

export interface Analysis {
  id: string;
  assetId: string;
  scenes: Scene[];
  transcript?: string;
  transcriptSegments: TranscriptSegment[];
  audioFeatures?: AudioFeatures;
  brandSignals?: BrandSignals;
  colorPalette: string[];
  ocrText?: string;
  summary?: string;
  keywords: string[];
  language?: string;
  mood?: string;
  completedAt?: string;
  createdAt: string;
}
