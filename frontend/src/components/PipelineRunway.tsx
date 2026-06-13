import type { Customer, Recommendation } from "../lib/types";
import { ms } from "../lib/format";
import { ProductCard } from "./ProductCard";
import { Eyebrow } from "./ui";

function Station({
  index,
  title,
  sub,
  latency,
  accent = false,
}: {
  index: string;
  title: string;
  sub: string;
  latency: number;
  accent?: boolean;
}) {
  return (
    <div className="flex min-w-[150px] flex-1 flex-col gap-1">
      <Eyebrow>{index}</Eyebrow>
      <h3
        className={`font-display text-xl leading-tight ${accent ? "italic text-signal" : "text-ink"}`}
      >
        {title}
      </h3>
      <p className="font-sans text-xs text-ink-soft">{sub}</p>
      <p className="mt-1 font-mono text-[11px] text-ink-faint">{ms(latency)}</p>
    </div>
  );
}

function Connector() {
  return (
    <div className="hidden items-center px-2 md:flex" aria-hidden>
      <svg width="48" height="12" viewBox="0 0 48 12" fill="none">
        <line x1="0" y1="6" x2="40" y2="6" stroke="#2A27D6" strokeWidth="1.5" strokeDasharray="3 3" />
        <path d="M40 1.5 L47 6 L40 10.5" stroke="#2A27D6" strokeWidth="1.5" fill="none" />
      </svg>
    </div>
  );
}

export function PipelineRunway({
  customers,
  selected,
  onSelect,
  rec,
}: {
  customers: Customer[];
  selected: Customer;
  onSelect: (c: Customer) => void;
  rec: Recommendation | null;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
      {/* Shopper selector */}
      <div className="panel p-4">
        <Eyebrow className="mb-3">Select a shopper</Eyebrow>
        <ul className="flex flex-col gap-1.5">
          {customers.map((c) => {
            const active = c.id === selected.id;
            return (
              <li key={c.id}>
                <button
                  onClick={() => onSelect(c)}
                  aria-pressed={active}
                  className={`w-full rounded-[3px] border px-3 py-2.5 text-left transition-colors focus-visible:focus-ring ${
                    active
                      ? "border-signal bg-signal text-paper"
                      : "border-line bg-paper/40 text-ink hover:border-ink-faint"
                  }`}
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-sans text-sm font-medium">{c.handle}</span>
                    <span className={`font-mono text-[10px] ${active ? "text-paper/70" : "text-ink-faint"}`}>
                      {c.purchases}×
                    </span>
                  </div>
                  <span className={`font-mono text-[10px] ${active ? "text-paper/80" : "text-ink-faint"}`}>
                    {c.segment}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Runway */}
      <div className="panel flex flex-col p-5">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Eyebrow>Two-stage ranking pipeline</Eyebrow>
          {rec && (
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <span
                className={`rounded-[2px] px-2 py-0.5 ${
                  rec.variant === "variant" ? "bg-signal text-paper" : "border border-line text-ink-soft"
                }`}
              >
                {rec.variant === "variant" ? "A/B · variant" : "A/B · control"}
              </span>
              <span className="text-ink-soft">{rec.modelVersion}</span>
              <span className="text-ink">
                end-to-end <span className="font-display text-base">{ms(rec.totalLatencyMs)}</span>
              </span>
            </div>
          )}
        </div>

        {/* Stage flow */}
        <div className="flex flex-col gap-4 border-b border-line pb-5 md:flex-row md:items-center">
          <Station
            index="S0"
            title={selected.handle}
            sub={`${selected.topCategory} · ${selected.segment.split(" · ")[0]}`}
            latency={0}
          />
          <Connector />
          <Station
            index="S1 · Retrieval"
            title="Two-Tower → FAISS"
            sub={`${rec?.retrieval.candidates ?? 200} candidates · IVFFlat ANN`}
            latency={rec?.retrieval.latencyMs ?? 0}
            accent
          />
          <Connector />
          <Station
            index="S2 · Rerank"
            title="XGBoost LambdaRank"
            sub={`top ${rec?.items.length ?? 8} · rank:ndcg`}
            latency={rec?.rerank.latencyMs ?? 0}
            accent
          />
        </div>

        {/* Lookbook */}
        <div className="mt-5">
          <Eyebrow className="mb-3">Recommended · the lookbook</Eyebrow>
          <div key={selected.id} className="flex gap-4 overflow-x-auto pb-2">
            {rec?.items.map((item, i) => (
              <ProductCard key={`${selected.id}-${item.rank}`} item={item} delay={i * 55} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
