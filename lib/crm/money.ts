export function dollarsToCents(value: number | string) { const parsed = typeof value === "number" ? value : Number(value); return Number.isFinite(parsed) ? Math.round(parsed * 100) : 0; }
export function centsToDollars(cents: number) { return Math.round(cents) / 100; }
export function lineTotalCents(quantity: number, unitPrice: number) { return Math.round(quantity * dollarsToCents(unitPrice)); }
export function formatCents(cents: number) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(centsToDollars(cents)); }
export function formatDollars(value: number | null) { return formatCents(dollarsToCents(value ?? 0)); }
