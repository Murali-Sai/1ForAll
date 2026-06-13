import type { ReactNode } from "react";

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`eyebrow ${className}`}>{children}</p>;
}

export function Panel({
  label,
  index,
  children,
  className = "",
}: {
  label: string;
  index?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`panel flex flex-col p-5 ${className}`}>
      <header className="mb-4 flex items-baseline justify-between">
        <Eyebrow>{label}</Eyebrow>
        {index && <span className="font-mono text-[11px] text-ink-faint">{index}</span>}
      </header>
      {children}
    </section>
  );
}

const statusColor: Record<string, string> = {
  healthy: "bg-up",
  stable: "bg-up",
  promote: "bg-up",
  watch: "bg-warn",
  warning: "bg-warn",
  collecting: "bg-signal",
  drifting: "bg-down",
  drift: "bg-down",
  rollback: "bg-down",
};

export function StatusDot({ status, pulse = false }: { status: string; pulse?: boolean }) {
  const color = statusColor[status] ?? "bg-ink-faint";
  return (
    <span className="relative inline-flex h-2.5 w-2.5">
      {pulse && (
        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${color}`} />
      )}
      <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${color}`} />
    </span>
  );
}

// Tiny vertical-bar histogram used for the latency distribution.
export function Sparkbars({ values, color = "#2A27D6" }: { values: number[]; color?: string }) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex h-16 items-end gap-[3px]">
      {values.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-[1px] transition-[height] duration-500"
          style={{ height: `${Math.max(4, (v / max) * 100)}%`, backgroundColor: color, opacity: 0.35 + (v / max) * 0.65 }}
        />
      ))}
    </div>
  );
}
