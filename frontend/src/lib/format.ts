export const gbp = (n: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n);

export const pct = (n: number, digits = 1) => `${n.toFixed(digits)}%`;

export const compact = (n: number) =>
  new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n);

export const ms = (n: number) => `${Math.round(n)}ms`;
