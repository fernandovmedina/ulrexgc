import type { Language } from "@/lib/crm/types";

export type LeadChoiceField = "service_line" | "property_type" | "timeline" | "budget" | "preferred_contact";
export type AdminChoiceField = "lead_status" | "opportunity_status" | "activity_type" | "quote_status" | "invoice_status" | "source" | "currency";
type Choice = { value: string; labels: Record<Language, string> };

export const leadChoices: Record<LeadChoiceField, readonly Choice[]> = {
  service_line: [
    { value: "residential_remodeling_additions", labels: { en: "Residential remodeling & additions", es: "Remodelaciones y ampliaciones residenciales" } },
    { value: "commercial_construction", labels: { en: "Commercial construction", es: "Construcción comercial" } },
    { value: "roofing_exterior_restoration", labels: { en: "Roofing & exterior restoration", es: "Techos y restauración exterior" } },
    { value: "specialty_custom_work", labels: { en: "Specialty & custom work", es: "Trabajos especiales y a medida" } },
    { value: "residential_painting", labels: { en: "Residential painting", es: "Pintura residencial" } },
  ],
  property_type: [
    { value: "residential", labels: { en: "Residential", es: "Residencial" } },
    { value: "commercial", labels: { en: "Commercial", es: "Comercial" } },
    { value: "mixed_use", labels: { en: "Mixed use", es: "Uso mixto" } },
    { value: "other", labels: { en: "Other", es: "Otro" } },
  ],
  timeline: [
    { value: "asap", labels: { en: "As soon as possible", es: "Lo antes posible" } },
    { value: "within_1_month", labels: { en: "Within 1 month", es: "En menos de 1 mes" } },
    { value: "1_3_months", labels: { en: "1–3 months", es: "1–3 meses" } },
    { value: "3_6_months", labels: { en: "3–6 months", es: "3–6 meses" } },
    { value: "6_plus_months", labels: { en: "6+ months", es: "Más de 6 meses" } },
    { value: "planning", labels: { en: "Still planning", es: "Aún estoy planeando" } },
  ],
  budget: [
    { value: "under_10k", labels: { en: "Under $10,000", es: "Menos de $10,000" } },
    { value: "10k_25k", labels: { en: "$10,000–$25,000", es: "$10,000–$25,000" } },
    { value: "25k_50k", labels: { en: "$25,000–$50,000", es: "$25,000–$50,000" } },
    { value: "50k_100k", labels: { en: "$50,000–$100,000", es: "$50,000–$100,000" } },
    { value: "100k_250k", labels: { en: "$100,000–$250,000", es: "$100,000–$250,000" } },
    { value: "250k_plus", labels: { en: "$250,000+", es: "$250,000+" } },
    { value: "unsure", labels: { en: "Not sure yet", es: "Aún no lo sé" } },
  ],
  preferred_contact: [
    { value: "email", labels: { en: "Email", es: "Correo electrónico" } },
    { value: "phone", labels: { en: "Phone", es: "Teléfono" } },
    { value: "text", labels: { en: "Text message", es: "Mensaje de texto" } },
  ],
};

export const adminChoices: Record<AdminChoiceField, readonly Choice[]> = {
  lead_status: [
    { value: "new", labels: { en: "New", es: "Nueva" } }, { value: "contacted", labels: { en: "Contacted", es: "Contactada" } },
    { value: "qualified", labels: { en: "Qualified", es: "Calificada" } }, { value: "quoted", labels: { en: "Quoted", es: "Cotizada" } },
    { value: "won", labels: { en: "Won", es: "Ganada" } }, { value: "lost", labels: { en: "Lost", es: "Perdida" } },
  ],
  opportunity_status: [
    { value: "open", labels: { en: "Open", es: "Abierta" } },
    { value: "won", labels: { en: "Won", es: "Ganada" } },
    { value: "lost", labels: { en: "Lost", es: "Perdida" } },
  ],
  activity_type: [
    { value: "call", labels: { en: "Call", es: "Llamada" } },
    { value: "email", labels: { en: "Email", es: "Correo electrónico" } },
    { value: "meeting", labels: { en: "Meeting", es: "Reunión" } },
    { value: "note", labels: { en: "Note", es: "Nota" } },
    { value: "task", labels: { en: "Task", es: "Tarea" } },
  ],
  quote_status: [
    { value: "draft", labels: { en: "Draft", es: "Borrador" } },
    { value: "sent", labels: { en: "Sent", es: "Enviada" } },
    { value: "accepted", labels: { en: "Accepted", es: "Aceptada" } },
    { value: "declined", labels: { en: "Declined", es: "Rechazada" } },
    { value: "expired", labels: { en: "Expired", es: "Vencida" } },
  ],
  invoice_status: [
    { value: "draft", labels: { en: "Draft", es: "Borrador" } },
    { value: "sent", labels: { en: "Sent", es: "Enviada" } },
    { value: "paid", labels: { en: "Paid", es: "Pagada" } },
    { value: "overdue", labels: { en: "Overdue", es: "Vencida" } },
    { value: "void", labels: { en: "Void", es: "Anulada" } },
  ],
  source: [
    { value: "website", labels: { en: "Website", es: "Sitio web" } },
    { value: "referral", labels: { en: "Referral", es: "Recomendación" } },
    { value: "admin", labels: { en: "Admin entry", es: "Registro administrativo" } },
    { value: "phone", labels: { en: "Phone", es: "Teléfono" } },
    { value: "email", labels: { en: "Email", es: "Correo electrónico" } },
  ],
  currency: [
    { value: "USD", labels: { en: "USD — US Dollar", es: "USD — Dólar estadounidense" } },
  ],
};

export function getLeadChoiceOptions(field: LeadChoiceField, language: Language = "en") {
  return leadChoices[field].map((choice) => ({ value: choice.value, label: choice.labels[language] }));
}

export function getLeadChoiceLabel(field: LeadChoiceField, value: string | null | undefined, language: Language = "en") {
  if (!value) return language === "es" ? "No proporcionado" : "Not provided";
  const choice = leadChoices[field].find((item) => item.value === value);
  if (choice) return choice.labels[language];
  const readable = value.replace(/_/g, " ").trim();
  return readable ? readable.charAt(0).toUpperCase() + readable.slice(1) : language === "es" ? "No proporcionado" : "Not provided";
}

export function getAdminChoiceOptions(field: AdminChoiceField, language: Language = "en") {
  return adminChoices[field].map((choice) => ({ value: choice.value, label: choice.labels[language] }));
}

export function getAdminChoiceLabel(field: AdminChoiceField, value: string | null | undefined, language: Language = "en") {
  if (!value) return language === "es" ? "No proporcionado" : "Not provided";
  const choice = adminChoices[field].find((item) => item.value === value);
  if (choice) return choice.labels[language];
  const readable = value.replace(/_/g, " ").trim();
  return readable ? readable.charAt(0).toUpperCase() + readable.slice(1) : language === "es" ? "No proporcionado" : "Not provided";
}
