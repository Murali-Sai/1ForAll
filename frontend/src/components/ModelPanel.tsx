import type { RegistryModel } from "../lib/types";
import { Panel } from "./ui";

const stageStyle: Record<RegistryModel["stage"], string> = {
  Production: "text-up",
  Staging: "text-signal",
  Archived: "text-ink-faint",
};

export function ModelPanel({ models }: { models: RegistryModel[] }) {
  const prod = models.find((m) => m.name === "xgboost-ranker" && m.stage === "Production");
  return (
    <Panel label="Model registry · MLflow" index="REG">
      <div className="mb-4 flex items-end gap-3">
        <span className="metric text-5xl text-ink">{prod ? prod.ndcg10.toFixed(3) : "—"}</span>
        <span className="mb-1 font-mono text-[11px] text-ink-faint">
          NDCG@10
          <br />
          production ranker
        </span>
      </div>
      <ul className="flex flex-col gap-2">
        {models.map((m) => (
          <li
            key={`${m.name}-${m.version}`}
            className="flex items-center justify-between border-t border-line pt-2 font-mono text-[11px]"
          >
            <span className="text-ink">
              {m.name}
              <span className="text-ink-faint"> v{m.version}</span>
            </span>
            <span className="flex items-center gap-3">
              <span className="tabular-nums text-ink-soft">{m.ndcg10.toFixed(3)}</span>
              <span className={`w-[72px] text-right uppercase tracking-eyebrow ${stageStyle[m.stage]}`}>
                {m.stage}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
