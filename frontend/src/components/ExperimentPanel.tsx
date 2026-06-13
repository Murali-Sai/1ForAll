import type { Experiment } from "../lib/types";
import { compact } from "../lib/format";
import { Panel } from "./ui";

const actionStyle: Record<Experiment["action"], { text: string; label: string }> = {
  promote: { text: "text-up", label: "Promote variant" },
  rollback: { text: "text-down", label: "Roll back" },
  collecting: { text: "text-signal", label: "Collecting" },
};

export function ExperimentPanel({ exp }: { exp: Experiment }) {
  const a = actionStyle[exp.action];
  const significant = exp.pValue < 0.05;
  return (
    <Panel label="A/B experiment · z-test" index={exp.id.slice(-2).toUpperCase()}>
      <div className="mb-4 flex items-end gap-3">
        <span className={`metric text-5xl ${exp.liftPct >= 0 ? "text-ink" : "text-down"}`}>
          {exp.liftPct >= 0 ? "+" : ""}
          {exp.liftPct.toFixed(1)}%
        </span>
        <span className="mb-1 font-mono text-[11px] text-ink-faint">
          CTR lift
          <br />
          vs control
        </span>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-[11px]">
        <div className="flex justify-between border-t border-line pt-2">
          <dt className="text-ink-faint">p-value</dt>
          <dd className={significant ? "text-up" : "text-ink-soft"}>{exp.pValue.toFixed(3)}</dd>
        </div>
        <div className="flex justify-between border-t border-line pt-2">
          <dt className="text-ink-faint">95% CI</dt>
          <dd className="text-ink-soft">
            [{exp.ci[0].toFixed(1)}, {exp.ci[1].toFixed(1)}]
          </dd>
        </div>
        <div className="flex justify-between border-t border-line pt-2">
          <dt className="text-ink-faint">control n</dt>
          <dd className="text-ink-soft">{compact(exp.samplesControl)}</dd>
        </div>
        <div className="flex justify-between border-t border-line pt-2">
          <dt className="text-ink-faint">variant n</dt>
          <dd className="text-ink-soft">{compact(exp.samplesVariant)}</dd>
        </div>
      </dl>

      <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
        <span className="font-mono text-[11px] text-ink-soft">{exp.control} → {exp.variant}</span>
        <span className={`font-mono text-[11px] uppercase tracking-eyebrow ${a.text}`}>{a.label}</span>
      </div>
    </Panel>
  );
}
