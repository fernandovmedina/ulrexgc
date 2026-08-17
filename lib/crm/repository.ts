import { getSupabaseClient } from "@/lib/supabase/client";
import { getAdminChoiceOptions } from "@/lib/crm/choices";
import { deleteLocalRecord, type LocalRecord, type LocalTableAdapter } from "@/lib/crm/relationships";
import { commitLocalSalesDocument, rollbackFailureError, type RollbackFailure } from "@/lib/crm/transactions";
import type { Activity, CalendarEvent, Client, DashboardData, EntityCreate, EntityUpdate, Invoice, InvoiceItem, Lead, LeadInput, LeadStatus, LeadUpdate, Opportunity, Product, Profile, Quote, QuoteItem, TeamMember, WorkspaceSettings } from "@/lib/crm/types";

type TimestampedEntity = { id: string; created_at: string; updated_at: string };
export interface ResourceRepository<T extends TimestampedEntity, TCreate = EntityCreate<T>, TUpdate = EntityUpdate<T>> {
  list(): Promise<T[]>;
  get(id: string): Promise<T | null>;
  create(input: TCreate): Promise<T>;
  update(id: string, input: TUpdate): Promise<T>;
  remove(id: string): Promise<void>;
}

export interface CrmRepository {
  profiles: ResourceRepository<Profile>;
  clients: ResourceRepository<Client>;
  leads: ResourceRepository<Lead, LeadInput, LeadUpdate>;
  opportunities: ResourceRepository<Opportunity>;
  activities: ResourceRepository<Activity>;
  quotes: ResourceRepository<Quote>;
  quoteItems: ResourceRepository<QuoteItem>;
  products: ResourceRepository<Product>;
  invoices: ResourceRepository<Invoice>;
  invoiceItems: ResourceRepository<InvoiceItem>;
  calendarEvents: ResourceRepository<CalendarEvent>;
  teamMembers: ResourceRepository<TeamMember>;
  settings: ResourceRepository<WorkspaceSettings>;
  listLeads(): Promise<Lead[]>;
  getLead(id: string): Promise<Lead | null>;
  createLead(input: LeadInput): Promise<Lead>;
  updateLead(id: string, input: LeadUpdate): Promise<Lead>;
  deleteLead(id: string): Promise<void>;
  getDashboardData(): Promise<DashboardData>;
  saveQuoteDocument(id: string | undefined, input: EntityCreate<Quote>, items: Array<Omit<EntityCreate<QuoteItem>, "quote_id"> & { id?: string }>): Promise<{ document: Quote; items: QuoteItem[] }>;
  saveInvoiceDocument(id: string | undefined, input: EntityCreate<Invoice>, items: Array<Omit<EntityCreate<InvoiceItem>, "invoice_id"> & { id?: string }>): Promise<{ document: Invoice; items: InvoiceItem[] }>;
}

const now = Date.now();
const localAdapters: Record<string, LocalTableAdapter> = {};
const stamp = (daysAgo: number) => new Date(now - daysAgo * 86400000).toISOString();
const seedProfiles: Profile[] = [{ id: "demo-profile-admin", email: "admin@ulrexgc.com", full_name: "Demo Ulrex Admin", role: "admin", created_at: stamp(30), updated_at: stamp(1) }];
const seedClients: Client[] = [
  { id: "demo-client-1", profile_id: null, name: "Demo Rivera Residence", email: "rivera@example.test", phone: "(210) 555-0111", company: null, address: "San Antonio, TX", notes: "Residential remodeling client used for local CRM demonstration.", created_at: stamp(20), updated_at: stamp(2) },
  { id: "demo-client-2", profile_id: null, name: "Demo Alamo Retail", email: "facilities@example.test", phone: "(210) 555-0112", company: "Demo Alamo Retail LLC", address: "New Braunfels, TX", notes: "Commercial tenant improvement account.", created_at: stamp(18), updated_at: stamp(3) },
];
const seedLeads: Lead[] = [
  { id: "demo-lead-1", service_line: "residential_remodeling_additions", project_details: "Kitchen layout update and finish planning.", property_type: "residential", property_address: "San Antonio, TX", timeline: "1_3_months", budget: "50k_100k", first_name: "Demo", last_name: "Homeowner", email: "demo.homeowner@example.test", phone: "(210) 555-0101", preferred_contact: "email", status: "new", source: "website", assigned_to: null, notes: null, language: "en", created_at: stamp(1), updated_at: stamp(1) },
  { id: "demo-lead-2", service_line: "commercial_construction", project_details: "Tenant improvement planning for an operating retail space.", property_type: "commercial", property_address: "San Antonio, TX", timeline: "3_6_months", budget: "100k_250k", first_name: "Demo", last_name: "Property Manager", email: "demo.manager@example.test", phone: "(210) 555-0102", preferred_contact: "phone", status: "qualified", source: "referral", assigned_to: null, notes: "Internal demonstration record.", language: "en", created_at: stamp(8), updated_at: stamp(2) },
];
const seedOpportunities: Opportunity[] = [
  { id: "demo-opportunity-1", client_id: "demo-client-1", lead_id: "demo-lead-1", title: "Demo Rivera Kitchen Remodel", value: 78000, status: "open", expected_close_date: new Date(now + 21 * 86400000).toISOString().slice(0, 10), owner_id: null, notes: "Scope review pending.", created_at: stamp(12), updated_at: stamp(1) },
  { id: "demo-opportunity-2", client_id: "demo-client-2", lead_id: "demo-lead-2", title: "Demo Alamo Retail Build-out", value: 165000, status: "won", expected_close_date: new Date(now - 5 * 86400000).toISOString().slice(0, 10), owner_id: null, notes: "Approved for scheduling.", created_at: stamp(16), updated_at: stamp(5) },
];
const seedActivities: Activity[] = [
  { id: "demo-activity-1", lead_id: null, client_id: "demo-client-1", opportunity_id: null, assigned_to: null, type: "call", subject: "Demo scope follow-up", details: "Confirm appliance selections and access window.", due_at: new Date(now + 2 * 86400000).toISOString(), completed_at: null, created_at: stamp(2), updated_at: stamp(2) },
  { id: "demo-activity-2", lead_id: null, client_id: null, opportunity_id: "demo-opportunity-2", assigned_to: null, type: "meeting", subject: "Demo preconstruction meeting", details: "Review operating-hours phasing.", due_at: new Date(now - 2 * 86400000).toISOString(), completed_at: null, created_at: stamp(6), updated_at: stamp(3) },
  { id: "demo-activity-3", lead_id: "demo-lead-2", client_id: null, opportunity_id: null, assigned_to: null, type: "email", subject: "Demo qualification summary", details: "Sent summary and requested site documents.", due_at: stamp(7), completed_at: stamp(7), created_at: stamp(9), updated_at: stamp(7) },
];
const seedProducts: Product[] = [
  { id: "demo-product-1", name: "Demo General Construction Labor", description: "Demonstration labor line item.", sku: "DEMO-LABOR", unit_price: 125, active: true, created_at: stamp(25), updated_at: stamp(4) },
  { id: "demo-product-2", name: "Demo Custom Cabinetry", description: "Built-to-order cabinetry allowance.", sku: "DEMO-CAB", unit_price: 18000.25, active: true, created_at: stamp(24), updated_at: stamp(4) },
  { id: "demo-product-3", name: "Demo Finish Package", description: "Archived demonstration finish package.", sku: "DEMO-FIN", unit_price: 8500.5, active: false, created_at: stamp(23), updated_at: stamp(4) },
];
const seedQuotes: Quote[] = [{ id: "demo-quote-1", client_id: "demo-client-2", opportunity_id: "demo-opportunity-2", quote_number: "DEMO-Q-1001", status: "accepted", subtotal: 30500.25, tax: 2516.27, total: 33016.52, valid_until: new Date(now + 10 * 86400000).toISOString().slice(0, 10), notes: "Internal demonstration quote.", created_at: stamp(10), updated_at: stamp(5) }];
const seedQuoteItems: QuoteItem[] = [
  { id: "demo-quote-item-1", quote_id: "demo-quote-1", product_id: "demo-product-1", description: "Demo General Construction Labor", quantity: 100, unit_price: 125, line_total: 12500, created_at: stamp(10), updated_at: stamp(10) },
  { id: "demo-quote-item-2", quote_id: "demo-quote-1", product_id: "demo-product-2", description: "Demo Custom Cabinetry", quantity: 1, unit_price: 18000.25, line_total: 18000.25, created_at: stamp(10), updated_at: stamp(10) },
];
const seedInvoices: Invoice[] = [{ id: "demo-invoice-1", client_id: "demo-client-2", quote_id: "demo-quote-1", invoice_number: "DEMO-INV-1001", status: "sent", subtotal: 30500.25, tax: 2516.27, total: 33016.52, due_date: new Date(now + 20 * 86400000).toISOString().slice(0, 10), paid_at: null, notes: "Internal demonstration invoice.", created_at: stamp(4), updated_at: stamp(4) }];
const seedInvoiceItems: InvoiceItem[] = [
  { id: "demo-invoice-item-1", invoice_id: "demo-invoice-1", product_id: "demo-product-1", description: "Demo General Construction Labor", quantity: 100, unit_price: 125, line_total: 12500, created_at: stamp(4), updated_at: stamp(4) },
  { id: "demo-invoice-item-2", invoice_id: "demo-invoice-1", product_id: "demo-product-2", description: "Demo Custom Cabinetry", quantity: 1, unit_price: 18000.25, line_total: 18000.25, created_at: stamp(4), updated_at: stamp(4) },
];
const seedCalendarEvents: CalendarEvent[] = [{ id: "demo-event-1", title: "Demo Rivera site visit", description: "Field measure and scope confirmation.", starts_at: new Date(now + 3 * 86400000).toISOString(), ends_at: new Date(now + 3 * 86400000 + 3600000).toISOString(), location: "San Antonio, TX", lead_id: null, client_id: "demo-client-1", owner_id: null, created_at: stamp(2), updated_at: stamp(2) }];
const seedTeamMembers: TeamMember[] = [{ id: "demo-team-1", profile_id: "demo-profile-admin", full_name: "Demo Ulrex Admin", email: "admin@ulrexgc.com", phone: "(210) 555-0199", title: "Administrator", active: true, created_at: stamp(30), updated_at: stamp(1) }];
const seedSettings: WorkspaceSettings[] = [{ id: "workspace-settings", business_name: "Ulrex General Contracting", email: "info@ulrexgc.com", phone: "+1 (210) 956-7200", address: "San Antonio, Texas", service_area: "San Antonio metro, nearby Hill Country, and the I-35 corridor", currency: "USD", tax_rate: 8.25, quote_prefix: "Q-", invoice_prefix: "INV-", quote_validity_days: 30, created_at: stamp(0), updated_at: stamp(0) }];

function requireClient() { const client = getSupabaseClient(); if (!client) throw new Error("Supabase is selected but its public environment variables are missing."); return client; }
function createResource<T extends TimestampedEntity, TCreate = EntityCreate<T>, TUpdate = EntityUpdate<T>>({ table, seed, storageKey, prepareCreate, migrateLocal }: { table: string; seed: T[]; storageKey: string; prepareCreate?: (input: TCreate, base: Pick<TimestampedEntity, "id" | "created_at" | "updated_at">) => T; migrateLocal?: (records: T[]) => T[] }): ResourceRepository<T, TCreate, TUpdate> {
  const readLocal = () => { if (typeof window === "undefined") return [...seed]; const stored = window.localStorage.getItem(storageKey); if (stored) { try { const parsed = JSON.parse(stored) as T[]; const migrated = migrateLocal ? migrateLocal(parsed) : parsed; if (JSON.stringify(migrated) !== stored) window.localStorage.setItem(storageKey, JSON.stringify(migrated)); return migrated; } catch { window.localStorage.removeItem(storageKey); } } window.localStorage.setItem(storageKey, JSON.stringify(seed)); return [...seed]; };
  const writeLocal = (records: T[]) => { if (typeof window !== "undefined") window.localStorage.setItem(storageKey, JSON.stringify(records)); };
  const build = (input: TCreate) => { const timestamp = new Date().toISOString(); const base = { id: crypto.randomUUID(), created_at: timestamp, updated_at: timestamp }; return prepareCreate ? prepareCreate(input, base) : { ...input as object, ...base } as T; };
  localAdapters[table] = { read: readLocal as () => LocalRecord[], write: writeLocal as (records: LocalRecord[]) => void };
  const local: ResourceRepository<T, TCreate, TUpdate> = {
    async list() { return readLocal(); },
    async get(id) { return readLocal().find((record) => record.id === id) ?? null; },
    async create(input) { const record = build(input); writeLocal([record, ...readLocal()]); return record; },
    async update(id, input) { const records = readLocal(); const current = records.find((record) => record.id === id); if (!current) throw new Error("Record not found."); const updated = { ...current, ...input as object, id, updated_at: new Date().toISOString() } as T; writeLocal(records.map((record) => record.id === id ? updated : record)); return updated; },
    async remove(id) { deleteLocalRecord(table, id, localAdapters); },
  };
  const supabase: ResourceRepository<T, TCreate, TUpdate> = {
    async list() { const { data, error } = await requireClient().from(table).select("*").order("created_at", { ascending: false }); if (error) throw error; return data as T[]; },
    async get(id) { const { data, error } = await requireClient().from(table).select("*").eq("id", id).maybeSingle(); if (error) throw error; return data as T | null; },
    async create(input) { const record = build(input); const { error } = await requireClient().from(table).insert(record); if (error) throw error; return record; },
    async update(id, input) { const { data, error } = await requireClient().from(table).update({ ...input as object, updated_at: new Date().toISOString() }).eq("id", id).select().single(); if (error) throw error; return data as T; },
    async remove(id) { const { error } = await requireClient().from(table).delete().eq("id", id); if (error) throw error; },
  };
  return process.env.NEXT_PUBLIC_DATA_DRIVER === "supabase" ? supabase : local;
}

const profiles = createResource({ table: "profiles", seed: seedProfiles, storageKey: "ulrex_crm_profiles_v1" });
const clients = createResource({ table: "clients", seed: seedClients, storageKey: "ulrex_crm_clients_v1" });
const leads = createResource<Lead, LeadInput, LeadUpdate>({ table: "leads", seed: seedLeads, storageKey: "ulrex_crm_leads_v2", prepareCreate: (input, base) => ({ ...input, ...base, status: input.status ?? "new", source: input.source ?? "website", assigned_to: input.assigned_to ?? null, notes: input.notes ?? null }) });
const opportunities = createResource({ table: "opportunities", seed: seedOpportunities, storageKey: "ulrex_crm_opportunities_v1" });
const activities = createResource({ table: "activities", seed: seedActivities, storageKey: "ulrex_crm_activities_v1" });
const quotes = createResource({ table: "quotes", seed: seedQuotes, storageKey: "ulrex_crm_quotes_v2" });
const quoteItems = createResource({ table: "quote_items", seed: seedQuoteItems, storageKey: "ulrex_crm_quote_items_v2" });
const products = createResource({ table: "products", seed: seedProducts, storageKey: "ulrex_crm_products_v2" });
const invoices = createResource({ table: "invoices", seed: seedInvoices, storageKey: "ulrex_crm_invoices_v2" });
const invoiceItems = createResource({ table: "invoice_items", seed: seedInvoiceItems, storageKey: "ulrex_crm_invoice_items_v2" });
const calendarEvents = createResource({ table: "calendar_events", seed: seedCalendarEvents, storageKey: "ulrex_crm_calendar_events_v1" });
const teamMembers = createResource({ table: "team_members", seed: seedTeamMembers, storageKey: "ulrex_crm_team_members_v1" });
const settings = createResource({ table: "settings", seed: seedSettings, storageKey: "ulrex_crm_settings_v1", migrateLocal: (records: WorkspaceSettings[]) => { if (typeof window === "undefined") return records; const migrationKey = "ulrex_crm_settings_v1_tax_default_migrated"; if (window.localStorage.getItem(migrationKey)) return records; window.localStorage.setItem(migrationKey, "1"); return records.map((record) => record.id === "workspace-settings" && record.tax_rate === 0 ? { ...record, tax_rate: 8.25 } : record); } });
const statusValues = getAdminChoiceOptions("lead_status").map((option) => option.value as LeadStatus);
function dashboard(records: Lead[]): DashboardData { const weekAgo = Date.now() - 7 * 86400000; const byStatus = Object.fromEntries(statusValues.map((status) => [status, records.filter((lead) => lead.status === status).length])) as Record<LeadStatus, number>; return { openLeads: records.filter((lead) => !["won", "lost"].includes(lead.status)).length, leadsThisWeek: records.filter((lead) => new Date(lead.created_at).getTime() >= weekAgo).length, byStatus, recentLeads: [...records].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 5) }; }

async function saveSupabaseDocument<TDocument extends TimestampedEntity, TItem extends TimestampedEntity>({ id, input, itemInputs, documentTable, itemTable, parentKey, documentRepository, itemRepository }: { id?: string; input: EntityCreate<TDocument>; itemInputs: Array<Record<string, unknown> & { id?: string }>; documentTable: string; itemTable: string; parentKey: string; documentRepository: ResourceRepository<TDocument>; itemRepository: ResourceRepository<TItem> }) {
  const client = requireClient();
  const documentBefore = id ? await documentRepository.get(id) : null;
  const itemsBefore = id ? (await itemRepository.list()).filter((item) => (item as Record<string, unknown>)[parentKey] === id) : [];
  let document: TDocument | null = null;
  try {
    document = id ? await documentRepository.update(id, input as EntityUpdate<TDocument>) : await documentRepository.create(input);
    const { error: deleteError } = await client.from(itemTable).delete().eq(parentKey, document.id); if (deleteError) throw deleteError;
    const timestamp = new Date().toISOString();
    const nextItems = itemInputs.map((item) => ({ ...item, [parentKey]: document!.id, id: item.id ?? crypto.randomUUID(), created_at: timestamp, updated_at: timestamp }));
    if (nextItems.length) { const { error: itemError } = await client.from(itemTable).insert(nextItems); if (itemError) throw itemError; }
    return { document, items: nextItems as unknown as TItem[] };
  } catch (cause) {
    if (document) {
      const rollbackDocument = document;
      const rollbackFailures: RollbackFailure[] = [];
      const rollback = async (operation: string, action: () => PromiseLike<{ error: unknown }>) => {
        try {
          const { error } = await action();
          if (error) rollbackFailures.push({ operation, cause: error });
        } catch (rollbackCause) {
          rollbackFailures.push({ operation, cause: rollbackCause });
        }
      };
      await rollback("removing replacement line items", () => client.from(itemTable).delete().eq(parentKey, rollbackDocument.id));
      if (itemsBefore.length) await rollback("restoring previous line items", () => client.from(itemTable).insert(itemsBefore));
      if (documentBefore) await rollback("restoring the previous document", () => client.from(documentTable).upsert(documentBefore));
      else await rollback("removing the newly created document", () => client.from(documentTable).delete().eq("id", rollbackDocument.id));
      if (rollbackFailures.length) throw rollbackFailureError(cause, rollbackFailures);
    }
    throw cause;
  }
}

async function saveQuoteDocument(id: string | undefined, input: EntityCreate<Quote>, itemInputs: Array<Omit<EntityCreate<QuoteItem>, "quote_id"> & { id?: string }>) {
  if (process.env.NEXT_PUBLIC_DATA_DRIVER === "supabase") return saveSupabaseDocument({ id, input, itemInputs, documentTable: "quotes", itemTable: "quote_items", parentKey: "quote_id", documentRepository: quotes, itemRepository: quoteItems });
  const result = commitLocalSalesDocument({ documentAdapter: localAdapters.quotes, itemAdapter: localAdapters.quote_items, documentId: id, documentInput: input, itemInputs, parentKey: "quote_id", numberKey: "quote_number" });
  return { document: result.document as unknown as Quote, items: result.items as unknown as QuoteItem[] };
}

async function saveInvoiceDocument(id: string | undefined, input: EntityCreate<Invoice>, itemInputs: Array<Omit<EntityCreate<InvoiceItem>, "invoice_id"> & { id?: string }>) {
  if (process.env.NEXT_PUBLIC_DATA_DRIVER === "supabase") return saveSupabaseDocument({ id, input, itemInputs, documentTable: "invoices", itemTable: "invoice_items", parentKey: "invoice_id", documentRepository: invoices, itemRepository: invoiceItems });
  const result = commitLocalSalesDocument({ documentAdapter: localAdapters.invoices, itemAdapter: localAdapters.invoice_items, documentId: id, documentInput: input, itemInputs, parentKey: "invoice_id", numberKey: "invoice_number" });
  return { document: result.document as unknown as Invoice, items: result.items as unknown as InvoiceItem[] };
}

export const crmRepository: CrmRepository = {
  profiles, clients, leads, opportunities, activities, quotes, quoteItems, products, invoices, invoiceItems, calendarEvents, teamMembers, settings,
  listLeads: () => leads.list(), getLead: (id) => leads.get(id), createLead: (input) => leads.create(input), updateLead: (id, input) => leads.update(id, input), deleteLead: (id) => leads.remove(id),
  async getDashboardData() { return dashboard(await leads.list()); },
  saveQuoteDocument,
  saveInvoiceDocument,
};
