import { useEffect, useState } from "react";
import {
  getCustomers,
  getDataSource,
  getDrift,
  getExperiment,
  getLatency,
  getRecommendation,
  getRegistry,
  type DataSource,
} from "./lib/api";
import { mockRecommendation } from "./lib/mock";
import {
  mockCustomers,
  mockDrift,
  mockExperiment,
  mockLatency,
  mockRegistry,
} from "./lib/mock";
import type {
  Customer,
  DriftReport,
  Experiment,
  LatencyMetrics,
  Recommendation,
  RegistryModel,
} from "./lib/types";
import { DriftPanel } from "./components/DriftPanel";
import { ExperimentPanel } from "./components/ExperimentPanel";
import { LatencyPanel } from "./components/LatencyPanel";
import { Masthead } from "./components/Masthead";
import { ModelPanel } from "./components/ModelPanel";
import { PipelineRunway } from "./components/PipelineRunway";
import { Eyebrow } from "./components/ui";

export default function App() {
  // Seed from bundled demo data for an instant first paint; live probes upgrade it.
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [selected, setSelected] = useState<Customer>(mockCustomers[0]);
  const [rec, setRec] = useState<Recommendation | null>(mockRecommendation(mockCustomers[0]));
  const [registry, setRegistry] = useState<RegistryModel[]>(mockRegistry);
  const [drift, setDrift] = useState<DriftReport>(mockDrift);
  const [experiment, setExperiment] = useState<Experiment>(mockExperiment);
  const [latency, setLatency] = useState<LatencyMetrics>(mockLatency);
  const [source, setSource] = useState<DataSource>("demo");

  // Probe the backend once on mount; falls back to demo data transparently.
  useEffect(() => {
    let alive = true;
    (async () => {
      const [cs, reg, dr, exp, lat] = await Promise.all([
        getCustomers(),
        getRegistry(),
        getDrift(),
        getExperiment(),
        getLatency(),
      ]);
      if (!alive) return;
      setCustomers(cs);
      setRegistry(reg);
      setDrift(dr);
      setExperiment(exp);
      setLatency(lat);
      setSource(getDataSource());
    })();
    return () => {
      alive = false;
    };
  }, []);

  function selectCustomer(c: Customer) {
    setSelected(c);
    setRec(mockRecommendation(c)); // instant, then upgrade if live
    getRecommendation(c).then((r) => setRec(r));
  }

  return (
    <div className="min-h-screen">
      <Masthead
        dataSource={source}
        modelVersion={rec?.modelVersion ?? "—"}
        p99={latency.p99}
        experiments={experiment.action === "rollback" ? 0 : 1}
      />

      <main className="mx-auto flex max-w-[1400px] flex-col gap-8 px-6 py-8">
        <PipelineRunway
          customers={customers}
          selected={selected}
          onSelect={selectCustomer}
          rec={rec}
        />

        <div>
          <div className="mb-3 flex items-center gap-3">
            <Eyebrow>The MLOps loop</Eyebrow>
            <span className="rule flex-1" />
            <span className="font-mono text-[11px] text-ink-faint">
              drift → retrain → eval gate → A/B → promote
            </span>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            <ModelPanel models={registry} />
            <DriftPanel drift={drift} />
            <ExperimentPanel exp={experiment} />
            <LatencyPanel latency={latency} />
          </div>
        </div>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-6 py-6 font-mono text-[11px] text-ink-faint md:flex-row md:items-center md:justify-between">
          <span>
            RetailRec MLOps · two-tower retrieval + XGBoost ranking on H&amp;M (1.37M users · 105K
            items · 31M transactions)
          </span>
          <span>Murali Sai Buddakkagari Venkata · murali140824@gmail.com</span>
        </div>
      </footer>
    </div>
  );
}
