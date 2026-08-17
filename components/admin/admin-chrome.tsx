import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export const adminActionClass = "flex h-11 items-center gap-2 bg-[#061426] px-5 font-mono text-[9px] font-bold uppercase tracking-[.16em] text-white disabled:opacity-50";
export function AdminActionButton({ className, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) { return <button {...props} className={cn(adminActionClass, className)}>{children}</button>; }

export function AdminTableHead({ children }: { children: ReactNode }) {
  return <thead className="bg-[#061426]/[.035] font-mono text-[9px] uppercase tracking-[.14em] text-[#061426]/45">{children}</thead>;
}

export function AdminStatusPill({ children, tone = "gold" }: { children: ReactNode; tone?: "gold" | "red" | "muted" }) {
  return <span className={cn("rounded-full px-2.5 py-1 text-[10px] font-bold uppercase", tone === "red" ? "bg-red-100 text-red-700" : tone === "muted" ? "bg-[#061426]/8 text-[#061426]/60" : "bg-[#d6aa55]/18 text-[#75531c]")}>{children}</span>;
}
