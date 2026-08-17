export type Language = "en" | "es";
export type LeadStatus = "new" | "contacted" | "qualified" | "quoted" | "won" | "lost";
export type UserRole = "admin" | "member";

export interface Profile { id: string; email: string; full_name: string; role: UserRole; created_at: string; updated_at: string }
export interface Client { id: string; profile_id: string | null; name: string; email: string | null; phone: string | null; company: string | null; address: string | null; notes: string | null; created_at: string; updated_at: string }
export interface Lead {
  id: string;
  service_line: string;
  project_details: string;
  property_type: string;
  property_address: string | null;
  timeline: string;
  budget: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  preferred_contact: string | null;
  status: LeadStatus;
  source: string;
  assigned_to: string | null;
  notes: string | null;
  language: Language;
  created_at: string;
  updated_at: string;
}
export type LeadInput = Omit<Lead, "id" | "created_at" | "updated_at" | "status" | "source" | "assigned_to" | "notes"> & Partial<Pick<Lead, "status" | "source" | "assigned_to" | "notes">>;
export type LeadUpdate = Partial<Omit<Lead, "id" | "created_at">>;
export interface Opportunity { id: string; client_id: string | null; lead_id: string | null; title: string; value: number | null; status: "open" | "won" | "lost"; expected_close_date: string | null; owner_id: string | null; notes: string | null; created_at: string; updated_at: string }
export interface Activity { id: string; lead_id: string | null; client_id: string | null; opportunity_id: string | null; assigned_to: string | null; type: "call" | "email" | "meeting" | "note" | "task"; subject: string; details: string | null; due_at: string | null; completed_at: string | null; created_at: string; updated_at: string }
export interface Product { id: string; name: string; description: string | null; sku: string | null; unit_price: number; active: boolean; created_at: string; updated_at: string }
export interface Quote { id: string; client_id: string | null; opportunity_id: string | null; quote_number: string; status: "draft" | "sent" | "accepted" | "declined" | "expired"; subtotal: number; tax: number; total: number; valid_until: string | null; notes: string | null; created_at: string; updated_at: string }
export interface QuoteItem { id: string; quote_id: string; product_id: string | null; description: string; quantity: number; unit_price: number; line_total: number; created_at: string; updated_at: string }
export interface Invoice { id: string; client_id: string | null; quote_id: string | null; invoice_number: string; status: "draft" | "sent" | "paid" | "overdue" | "void"; subtotal: number; tax: number; total: number; due_date: string | null; paid_at: string | null; notes: string | null; created_at: string; updated_at: string }
export interface InvoiceItem { id: string; invoice_id: string; product_id: string | null; description: string; quantity: number; unit_price: number; line_total: number; created_at: string; updated_at: string }
export interface CalendarEvent { id: string; title: string; description: string | null; starts_at: string; ends_at: string; location: string | null; lead_id: string | null; client_id: string | null; owner_id: string | null; created_at: string; updated_at: string }
export interface TeamMember { id: string; profile_id: string | null; full_name: string; email: string; phone: string | null; title: string | null; active: boolean; created_at: string; updated_at: string }
export interface WorkspaceSettings { id: string; business_name: string; email: string; phone: string; address: string; service_area: string; currency: string; tax_rate: number; quote_prefix: string; invoice_prefix: string; quote_validity_days: number; created_at: string; updated_at: string }

export type EntityCreate<T extends { id: string; created_at: string; updated_at: string }> = Omit<T, "id" | "created_at" | "updated_at">;
export type EntityUpdate<T extends { id: string; created_at: string; updated_at: string }> = Partial<Omit<T, "id" | "created_at">>;

export interface DashboardData { openLeads: number; leadsThisWeek: number; byStatus: Record<LeadStatus, number>; recentLeads: Lead[] }
