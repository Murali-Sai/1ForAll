// Typed API client. Each call hits the live FastAPI backend (proxied at /api)
// and transparently falls back to bundled mock data when it's unreachable —
// so the dashboard is always demoable, and goes live automatically once the
// serving + monitoring + experiment endpoints land (Phases 6/8/9).
import {
  mockCustomers,
  mockDrift,
  mockExperiment,
  mockLatency,
  mockRecommendation,
  mockRegistry,
} from "./mock";
import type {
  Customer,
  DriftReport,
  Experiment,
  LatencyMetrics,
  Recommendation,
  RegistryModel,
} from "./types";

export type DataSource = "live" | "demo";

let dataSource: DataSource = "demo";
export const getDataSource = (): DataSource => dataSource;

async function tryFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`/api${path}`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(1500),
    });
    if (!res.ok) return null;
    dataSource = "live";
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function getCustomers(): Promise<Customer[]> {
  return (await tryFetch<Customer[]>("/customers")) ?? mockCustomers;
}

export async function getRecommendation(customer: Customer): Promise<Recommendation> {
  return (
    (await tryFetch<Recommendation>(`/recommend/${encodeURIComponent(customer.id)}`)) ??
    mockRecommendation(customer)
  );
}

export async function getRegistry(): Promise<RegistryModel[]> {
  return (await tryFetch<RegistryModel[]>("/models")) ?? mockRegistry;
}

export async function getDrift(): Promise<DriftReport> {
  return (await tryFetch<DriftReport>("/monitoring/drift")) ?? mockDrift;
}

export async function getExperiment(): Promise<Experiment> {
  return (await tryFetch<Experiment>("/experiments/active")) ?? mockExperiment;
}

export async function getLatency(): Promise<LatencyMetrics> {
  return (await tryFetch<LatencyMetrics>("/metrics/latency")) ?? mockLatency;
}
