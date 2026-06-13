// Bundled demo data. The API client uses this when the live backend is
// unreachable so the dashboard always renders for portfolio/demo viewing.
import type {
  Customer,
  DriftReport,
  Experiment,
  LatencyMetrics,
  Recommendation,
  RecItem,
  RegistryModel,
} from "./types";

export const mockCustomers: Customer[] = [
  { id: "0641…a3f", handle: "Astrid L.", segment: "Loyal · Womenswear", purchases: 214, topCategory: "Knitwear" },
  { id: "1c9d…77b", handle: "Mateo R.", segment: "New · Menswear", purchases: 9, topCategory: "Trousers" },
  { id: "8ba2…e10", handle: "Yuki T.", segment: "High-value · Mixed", purchases: 488, topCategory: "Outerwear" },
  { id: "4f70…2dd", handle: "Noor A.", segment: "Lapsing · Womenswear", purchases: 63, topCategory: "Dresses" },
  { id: "a302…9c1", handle: "Ezra M.", segment: "Loyal · Kidswear", purchases: 151, topCategory: "Baby" },
];

const palette: Array<[string, string]> = [
  ["Off White", "#EDE7DA"],
  ["Ink Navy", "#1F2A44"],
  ["Camel", "#B0844E"],
  ["Sage", "#8A9A7B"],
  ["Oxblood", "#6E2A2A"],
  ["Dove Grey", "#A7A39B"],
  ["Klein", "#2A27D6"],
  ["Black", "#1A1A1E"],
  ["Rust", "#A85A32"],
  ["Powder", "#C9D2DD"],
  ["Ochre", "#C9912E"],
  ["Forest", "#2F4A3A"],
];

const catalog: Array<[string, string]> = [
  ["Ribbed Wool Cardigan", "Knitwear"],
  ["Tailored Wide Trouser", "Trousers"],
  ["Quilted Liner Coat", "Outerwear"],
  ["Bias-Cut Midi Dress", "Dresses"],
  ["Boxy Oxford Shirt", "Shirts"],
  ["Merino Crew Knit", "Knitwear"],
  ["Pleated Trench", "Outerwear"],
  ["Relaxed Denim", "Denim"],
  ["Silk Slip Skirt", "Skirts"],
  ["Cropped Blazer", "Tailoring"],
  ["Cashmere Beanie", "Accessories"],
  ["Leather Loafer", "Shoes"],
];

function seeded(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

export function mockRecommendation(customer: Customer): Recommendation {
  const rng = seeded(customer.id.length * 97 + customer.purchases);
  const k = 8;
  const items: RecItem[] = Array.from({ length: k }).map((_, i) => {
    const [name, category] = catalog[Math.floor(rng() * catalog.length)];
    const [colorName, colorHex] = palette[Math.floor(rng() * palette.length)];
    const score = Math.max(0.12, 0.97 - i * 0.085 - rng() * 0.04);
    return {
      articleId: `0${Math.floor(rng() * 9_000_000 + 1_000_000)}`,
      name,
      category,
      colorName,
      colorHex,
      price: Math.round((rng() * 60 + 12) * 100) / 100,
      rank: i + 1,
      score,
    };
  });
  const retrievalMs = Math.round(9 + rng() * 8);
  const rerankMs = Math.round(18 + rng() * 14);
  return {
    customer,
    retrieval: { candidates: 200, latencyMs: retrievalMs },
    rerank: { candidates: k, latencyMs: rerankMs },
    items,
    totalLatencyMs: retrievalMs + rerankMs + Math.round(6 + rng() * 10),
    modelVersion: "xgb-ranker:v7",
    variant: rng() > 0.5 ? "variant" : "control",
  };
}

export const mockRegistry: RegistryModel[] = [
  { name: "xgboost-ranker", version: 7, stage: "Production", ndcg10: 0.418, createdAt: "2026-06-09" },
  { name: "xgboost-ranker", version: 8, stage: "Staging", ndcg10: 0.431, createdAt: "2026-06-12" },
  { name: "two-tower", version: 5, stage: "Production", ndcg10: 0.372, createdAt: "2026-06-08" },
  { name: "als-baseline", version: 1, stage: "Archived", ndcg10: 0.243, createdAt: "2026-06-03" },
];

export const mockDrift: DriftReport = {
  status: "watch",
  features: [
    { name: "purchase_recency", psi: 0.07, status: "stable" },
    { name: "category_affinity", psi: 0.14, status: "stable" },
    { name: "avg_article_price", psi: 0.23, status: "warning" },
    { name: "sales_velocity_7d", psi: 0.41, status: "drift" },
    { name: "user_embedding", psi: 0.11, status: "stable" },
  ],
  embeddingCosineShift: 0.038,
  targetDrift: 0.061,
  rolling7dNdcg: 0.401,
  baselineNdcg: 0.418,
  lastRetrainAt: "2026-06-09 02:14 UTC",
};

export const mockExperiment: Experiment = {
  id: "exp-2026-06-ranker-v8",
  control: "xgb-ranker:v7",
  variant: "xgb-ranker:v8",
  liftPct: 3.1,
  pValue: 0.032,
  ci: [0.4, 5.8],
  samplesControl: 9120,
  samplesVariant: 9088,
  action: "promote",
  status: "Significant at p<0.05 — promote recommended",
};

export const mockLatency: LatencyMetrics = {
  p50: 41,
  p95: 118,
  p99: 142,
  rps: 1280,
  errorRate: 0.0006,
  histogram: [4, 9, 18, 31, 44, 52, 47, 33, 21, 12, 7, 4, 2, 1],
};
