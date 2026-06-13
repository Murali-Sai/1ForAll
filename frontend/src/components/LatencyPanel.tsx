import type { LatencyMetrics } from "../lib/types";
import { compact, ms } from "../lib/format";
import { Panel, Sparkbars } from "./ui";

export function LatencyPanel({ latency }: { latency: LatencyMetrics }) {
  return (
    <Panel label="Serving latency · Prometheus" index="P99">
      <div className="mb-4 flex items-end gap-3">
        <span className="metric text-5xl text-ink">{latency.p99}</span>
        <span className="mb-1 font-mono text-[11px] text-ink-faint">
          ms p99
          <br />
          under load
        </span>
      </div>

      <Sparkbars values={latency.histogram} />

      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-3 font-mono text-[11px]">
        <div>
          <div className="text-ink-faint">p50</div>
          <div className="text-ink">{ms(latency.p50)}</div>
        </div>
        <div>
          <div className="text-ink-faint">p95</div>
          <div className="text-ink">{ms(latency.p95)}</div>
        </div>
        <div>
          <div className="text-ink-faint">throughput</div>
          <div className="text-ink">{compact(latency.rps)} rps</div>
        </div>
      </div>
      <div className="mt-2 flex justify-between font-mono text-[11px] text-ink-soft">
        <span className="text-ink-faint">error rate</span>
        <span className={latency.errorRate > 0.01 ? "text-down" : "text-up"}>
          {(latency.errorRate * 100).toFixed(2)}%
        </span>
      </div>
    </Panel>
  );
}
