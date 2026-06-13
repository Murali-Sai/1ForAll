// Shared types — mirror the FastAPI response schemas added in Phase 6/8/9.

export interface Customer {
  id: string;
  handle: string;
  segment: string;
  purchases: number;
  topCategory: string;
}

export interface RecItem {
  articleId: string;
  name: string;
  category: string;
  colorName: string;
  colorHex: string;
  price: number;
  rank: number;
  score: number; // 0..1 reranker confidence
}

export interface StageTiming {
  candidates: number;
  latencyMs: number;
}

export interface Recommendation {
  customer: Customer;
  retrieval: StageTiming; // Two-Tower -> FAISS
  rerank: StageTiming; // XGBoost LambdaRank
  items: RecItem[];
  totalLatencyMs: number;
  modelVersion: string;
  variant: "control" | "variant";
}

export interface RegistryModel {
  name: string;
  version: number;
  stage: "Production" | "Staging" | "Archived";
  ndcg10: number;
  createdAt: string;
}

export interface DriftFeature {
  name: string;
  psi: number;
  status: "stable" | "warning" | "drift";
}

export interface DriftReport {
  status: "healthy" | "watch" | "drifting";
  features: DriftFeature[];
  embeddingCosineShift: number;
  targetDrift: number;
  rolling7dNdcg: number;
  baselineNdcg: number;
  lastRetrainAt: string;
}

export interface Experiment {
  id: string;
  control: string;
  variant: string;
  liftPct: number;
  pValue: number;
  ci: [number, number];
  samplesControl: number;
  samplesVariant: number;
  action: "collecting" | "promote" | "rollback";
  status: string;
}

export interface LatencyMetrics {
  p50: number;
  p95: number;
  p99: number;
  rps: number;
  errorRate: number;
  histogram: number[]; // request latency distribution buckets
}
