import type { DataSource } from "../lib/api";
import { ms } from "../lib/format";
import { StatusDot } from "./ui";

export function Masthead({
  dataSource,
  modelVersion,
  p99,
  experiments,
}: {
  dataSource: DataSource;
  modelVersion: string;
  p99: number;
  experiments: number;
}) {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-6 py-7 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <StatusDot status={dataSource === "live" ? "healthy" : "collecting"} pulse />
            <span className="eyebrow">
              {dataSource === "live" ? "Live · production traffic" : "Demo data · backend offline"}
            </span>
          </div>
          <h1 className="font-display text-[40px] font-medium leading-[0.95] tracking-tight text-ink md:text-[56px]">
            RetailRec
            <span className="font-display italic font-normal text-signal"> Control&nbsp;Plane</span>
          </h1>
          <p className="mt-2 max-w-xl font-sans text-sm text-ink-soft">
            Two-tower retrieval, learning-to-rank reranking, drift-triggered retraining, and
            statistical A/B rollout — one system deciding what serves, when it retrains, and why a
            variant rolls back.
          </p>
        </div>

        <dl className="flex shrink-0 gap-8 font-mono text-xs">
          <div>
            <dt className="text-ink-faint">SERVING</dt>
            <dd className="mt-1 text-ink">{modelVersion}</dd>
          </div>
          <div>
            <dt className="text-ink-faint">P99</dt>
            <dd className="mt-1 text-ink">{ms(p99)}</dd>
          </div>
          <div>
            <dt className="text-ink-faint">EXPERIMENTS</dt>
            <dd className="mt-1 text-ink">{experiments} running</dd>
          </div>
        </dl>
      </div>
    </header>
  );
}
