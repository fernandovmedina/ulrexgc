export type LocalRecord = { id: string; created_at: string; updated_at: string; [key: string]: unknown };
export type LocalTableAdapter = { read: () => LocalRecord[]; write: (records: LocalRecord[]) => void };

type DeleteRule = { table: string; key: string; action: "cascade" | "set-null" | "restrict" };

export const deleteRules: Record<string, readonly DeleteRule[]> = {
  profiles: [
    { table: "clients", key: "profile_id", action: "set-null" }, { table: "leads", key: "assigned_to", action: "set-null" },
    { table: "opportunities", key: "owner_id", action: "set-null" }, { table: "activities", key: "assigned_to", action: "set-null" },
    { table: "calendar_events", key: "owner_id", action: "set-null" }, { table: "team_members", key: "profile_id", action: "set-null" },
  ],
  clients: [
    { table: "opportunities", key: "client_id", action: "cascade" }, { table: "activities", key: "client_id", action: "cascade" },
    { table: "quotes", key: "client_id", action: "restrict" }, { table: "invoices", key: "client_id", action: "restrict" },
    { table: "calendar_events", key: "client_id", action: "set-null" },
  ],
  leads: [
    { table: "opportunities", key: "lead_id", action: "set-null" }, { table: "activities", key: "lead_id", action: "cascade" },
    { table: "calendar_events", key: "lead_id", action: "set-null" },
  ],
  opportunities: [
    { table: "activities", key: "opportunity_id", action: "cascade" }, { table: "quotes", key: "opportunity_id", action: "set-null" },
  ],
  quotes: [
    { table: "quote_items", key: "quote_id", action: "cascade" }, { table: "invoices", key: "quote_id", action: "set-null" },
  ],
  products: [
    { table: "quote_items", key: "product_id", action: "set-null" }, { table: "invoice_items", key: "product_id", action: "set-null" },
  ],
  invoices: [{ table: "invoice_items", key: "invoice_id", action: "cascade" }],
  calendar_events: [],
  team_members: [],
  settings: [],
};

export function deleteLocalRecord(table: string, id: string, adapters: Record<string, LocalTableAdapter>) {
  const rules = deleteRules[table] ?? [];
  for (const rule of rules.filter((item) => item.action === "restrict")) {
    if (adapters[rule.table]?.read().some((record) => record[rule.key] === id)) throw new Error(`Cannot delete this ${table.replace(/s$/, "")} because ${rule.table.replace(/_/g, " ")} still reference it.`);
  }
  for (const rule of rules.filter((item) => item.action === "cascade")) {
    for (const record of adapters[rule.table]?.read().filter((item) => item[rule.key] === id) ?? []) deleteLocalRecord(rule.table, record.id, adapters);
  }
  const changedAt = new Date().toISOString();
  for (const rule of rules.filter((item) => item.action === "set-null")) {
    const adapter = adapters[rule.table];
    if (adapter) adapter.write(adapter.read().map((record) => record[rule.key] === id ? { ...record, [rule.key]: null, updated_at: changedAt } : record));
  }
  const adapter = adapters[table];
  if (adapter) adapter.write(adapter.read().filter((record) => record.id !== id));
}
