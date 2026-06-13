import type { RecItem } from "../lib/types";
import { gbp } from "../lib/format";

export function ProductCard({ item, delay = 0 }: { item: RecItem; delay?: number }) {
  return (
    <article
      className="group w-[160px] shrink-0 animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Swatch — the garment colour stands in for product imagery (H&M colour_group). */}
      <div
        className="relative h-[200px] w-full overflow-hidden rounded-[3px] border border-line transition-transform duration-300 group-hover:-translate-y-1"
        style={{ backgroundColor: item.colorHex }}
      >
        <span className="absolute left-0 top-0 bg-paper px-2 py-1 font-display text-lg font-medium leading-none text-ink">
          {item.rank}
        </span>
        {/* Confidence meter pinned to the base of the swatch */}
        <div className="absolute inset-x-0 bottom-0 h-1.5 bg-black/10">
          <div className="h-full bg-paper/85" style={{ width: `${item.score * 100}%` }} />
        </div>
      </div>

      <div className="mt-2.5">
        <p className="eyebrow">{item.category}</p>
        <h4 className="mt-1 font-sans text-[13px] font-medium leading-tight text-ink">{item.name}</h4>
        <div className="mt-1.5 flex items-center justify-between">
          <span className="font-mono text-xs text-ink-soft">{gbp(item.price)}</span>
          <span className="font-mono text-[11px] text-signal">{item.score.toFixed(2)}</span>
        </div>
        <p className="mt-0.5 font-mono text-[10px] text-ink-faint">
          <span className="tag-dot align-middle" style={{ backgroundColor: item.colorHex }} /> {item.colorName}
        </p>
      </div>
    </article>
  );
}
