import type { DriftReport } from "../lib/types";
import { Panel, StatusDot } from "./ui";

const barColor: Record<string, string> = {
  stable: "#15734A",
  warning: "#9A6B00",
  drift: "#C23A2B",
};

export function DriftPanel({ drift }: { drift: DriftReport }) {
  const worst = [...drift.features].sort((a, b) => b.psi - a.psi)[0];
  const ndcgDelta = drift.rolling7dNdcg - drift.baselineNdcg;
  return (
    <Panel label="Drift monitor · Evidently" index="PSI">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-end gap-3">
          <span className="metric text-5xl text-ink">{worst.psi.toFixed(2)}</span>
          <span className="mb-1 font-mono text-[11px] text-ink-faint">
            max PSI
            <br />
            {worst.name}
          </span>
        </div>
        <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-eyebrow text-ink-soft">
          <StatusDot status={drift.status} pulse={drift.status !== "healthy"} />
          {drift.status}
        </span>
      </div>

      <ul className="flex flex-col gap-2">
        {drift.features.map((f) => (
          <li key={f.name} className="font-mono text-[11px]">
            <div className="flex justify-between text-ink-soft">
              <span>{f.name}</span>
              <span className="tabular-nums">{f.psi.toFixed(2)}</span>
            </div>
            <div className="mt-1 h-1.5 w-full rounded-[1px] bg-paper-deep">
              <div
                className="h-full rounded-[1px]"
                style={{ width: `${Math.min(100, (f.psi / 0.5) * 100)}%`, backgroundColor: barColor[f.status] }}
              />
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex justify-between border-t border-line pt-3 font-mono text-[11px] text-ink-soft">
        <span>7d NDCG@10</span>
        <span className={ndcgDelta < 0 ? "text-down" : "text-up"}>
          {drift.rolling7dNdcg.toFixed(3)} ({ndcgDelta >= 0 ? "+" : ""}
          {(ndcgDelta * 100).toFixed(1)}%)
        </span>
      </div>
    </Panel>
  );
}
