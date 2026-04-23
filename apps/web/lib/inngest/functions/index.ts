import { analyzeAsset } from "./analyze";
import { strategizeProject } from "./strategize";
import { fanoutPieceGeneration, generatePiece } from "./generate";

export const functions = [
  analyzeAsset,
  strategizeProject,
  fanoutPieceGeneration,
  generatePiece,
];
