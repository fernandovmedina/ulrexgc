"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { BarChart3, Boxes, CalendarDays, ChevronLeft, ChevronRight, ContactRound, FileText, Gauge, HandCoins, ListTodo, LogOut, Menu, Package, ReceiptText, Settings, Target, Users, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { authRepository } from "@/lib/auth/repository";
import type { AuthSession } from "@/lib/auth/types";
import { cn } from "@/lib/utils";

type NavigationItem = { kind: "item"; label: string; href: string; icon: LucideIcon };
type NavigationGroup = { kind: "group"; heading: string; items: NavigationItem[] };
function normalizeAdminPathname(pathname: string) { return pathname === "/" ? pathname : pathname.replace(/\/+$/, ""); }
const navigation: (NavigationItem | NavigationGroup)[] = [
  { kind: "item", label: "Dashboard", href: "/admin", icon: Gauge },
  { kind: "group", heading: "CRM", items: [
    { kind: "item", label: "Clients", href: "/admin/crm/clients", icon: ContactRound },
    { kind: "item", label: "Leads", href: "/admin/crm/leads", icon: Target },
    { kind: "item", label: "Opportunities", href: "/admin/crm/opportunities", icon: HandCoins },
    { kind: "item", label: "Activities", href: "/admin/crm/activities", icon: ListTodo },
  ] },
  { kind: "group", heading: "Sales", items: [
    { kind: "item", label: "Quotes", href: "/admin/sales/quotes", icon: FileText },
    { kind: "item", label: "Products", href: "/admin/sales/products", icon: Package },
    { kind: "item", label: "Invoices", href: "/admin/sales/invoices", icon: ReceiptText },
  ] },
  { kind: "group", heading: "Organization", items: [
    { kind: "item", label: "Calendar", href: "/admin/organization/calendar", icon: CalendarDays },
    { kind: "item", label: "Reports", href: "/admin/organization/reports", icon: BarChart3 },
    { kind: "item", label: "Team", href: "/admin/organization/team", icon: Users },
  ] },
  { kind: "item", label: "Settings", href: "/admin/settings", icon: Settings },
];

function Sidebar({ collapsed, mobile, session, close, toggle }: { collapsed: boolean; mobile?: boolean; session: AuthSession; close?: () => void; toggle: () => void }) {
  const pathname = usePathname();
  const normalizedPathname = normalizeAdminPathname(pathname);
  const navRef = useRef<HTMLElement>(null);
  const router = useRouter();
  useLayoutEffect(() => {
    const nav = navRef.current;
    const active = nav?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!nav || !active) return;

    const keepActiveItemVisible = () => {
      const navRect = nav.getBoundingClientRect();
      const activeRect = active.getBoundingClientRect();
      const topOverflow = navRect.top - activeRect.top;
      const bottomOverflow = activeRect.bottom - navRect.bottom;

      if (topOverflow > 0) nav.scrollTop -= Math.ceil(topOverflow);
      else if (bottomOverflow > 0) nav.scrollTop += Math.ceil(bottomOverflow);
    };

    keepActiveItemVisible();
    let secondFrame = 0;
    const firstFrame = requestAnimationFrame(() => {
      keepActiveItemVisible();
      secondFrame = requestAnimationFrame(keepActiveItemVisible);
    });
    const resizeObserver = new ResizeObserver(keepActiveItemVisible);
    resizeObserver.observe(nav);
    resizeObserver.observe(active);

    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
      resizeObserver.disconnect();
    };
  }, [collapsed, mobile, normalizedPathname]);
  const item = (entry: NavigationItem) => {
    const Icon = entry.icon;
    const active = normalizedPathname === normalizeAdminPathname(entry.href);
    return <Link key={entry.href} href={entry.href} onClick={close} aria-current={active ? "page" : undefined} title={collapsed ? entry.label : undefined} className={cn("flex h-10 items-center gap-3 rounded-md px-3 text-sm transition", active ? "bg-[#d6aa55] font-bold text-[#061426]" : "text-white/65 hover:bg-white/8 hover:text-white", collapsed && "justify-center px-0")}><Icon className="size-4 shrink-0" /><span className={cn(collapsed && "sr-only")}>{entry.label}</span></Link>;
  };
  const signOut = async () => { await authRepository.signOut(); router.replace("/admin/login"); };
  return <aside className={cn("flex h-full flex-col bg-[#061426] text-white", mobile ? "w-72" : collapsed ? "w-[76px]" : "w-64")}>
    <div className={cn("flex h-17 items-center border-b border-white/10 px-4", collapsed ? "justify-center" : "justify-between")}><Link href="/admin" className="flex items-center gap-3"><Image src="/logo_icon_with_transparent_background.png" width={36} height={36} alt="" className="size-9 object-contain" /><span className={cn("text-xs font-black tracking-[.16em]", collapsed && "sr-only")}>ULREX CRM</span></Link>{mobile && <button onClick={close} aria-label="Close navigation" className="grid size-9 place-items-center text-white/70"><X className="size-5" /></button>}</div>
    <nav ref={navRef} aria-label="Admin navigation" className="flex-1 space-y-5 overflow-y-auto p-3">{navigation.map((section, index) => section.kind === "item" ? item(section) : <div key={section.heading}><p className={cn("mb-2 px-3 font-mono text-[9px] font-bold uppercase tracking-[.2em] text-[#e2be6c]/70", collapsed && "sr-only")}>{section.heading}</p><div className="space-y-1">{section.items.map(item)}</div>{collapsed && index < navigation.length - 1 && <div className="mx-auto mt-4 h-px w-8 bg-white/10" />}</div>)}</nav>
    <div className="border-t border-white/10 p-3"><div className={cn("mb-3 rounded-md bg-white/5 p-3", collapsed && "px-1 text-center")}><div className="truncate text-xs font-bold">{collapsed ? session.user.name.slice(0, 1) : session.user.name}</div><div className={cn("mt-1 truncate text-[10px] text-white/45", collapsed && "sr-only")}>{session.user.email}</div></div><button onClick={signOut} title={collapsed ? "Sign out" : undefined} className={cn("flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm text-white/60 transition hover:bg-white/8 hover:text-white", collapsed && "justify-center px-0")}><LogOut className="size-4" /><span className={cn(collapsed && "sr-only")}>Sign out</span></button>{!mobile && <button onClick={toggle} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} className="mt-2 flex h-9 w-full items-center justify-center rounded-md border border-white/10 text-white/45 hover:text-white">{collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}</button>}</div>
  </aside>;
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = normalizeAdminPathname(pathname) === normalizeAdminPathname("/admin/login");
  const [session, setSession] = useState<AuthSession | null>(null);
  const [resolved, setResolved] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    if (isLogin) return;
    let active = true;
    void authRepository.getSession().then(async (nextSession) => { if (!active) return; if (!nextSession) { setResolved(true); router.replace("/admin/login"); return; } const isAdmin = await authRepository.isAdmin(nextSession); if (!active) return; if (!isAdmin) { await authRepository.signOut(); if (!active) return; setResolved(true); router.replace("/admin/login?error=not-admin"); return; } setSession(nextSession); setResolved(true); }).catch(async () => { if (!active) return; try { await authRepository.signOut(); } catch {} if (!active) return; setSession(null); setResolved(true); router.replace("/admin/login"); });
    const resolveAuthChange = async (nextSession: AuthSession | null) => { if (!active) return; if (!nextSession) { setSession(null); router.replace("/admin/login"); return; } try { const isAdmin = await authRepository.isAdmin(nextSession); if (!active) return; if (isAdmin) setSession(nextSession); else { await authRepository.signOut(); if (!active) return; setSession(null); router.replace("/admin/login?error=not-admin"); } } catch { if (!active) return; setSession(null); router.replace("/admin/login"); } };
    const unsubscribe = authRepository.onAuthStateChange((nextSession) => { queueMicrotask(() => { void resolveAuthChange(nextSession); }); });
    return () => { active = false; unsubscribe(); };
  }, [isLogin, router]);
  if (isLogin) return children;
  if (!resolved || !session) return <div className="grid min-h-screen place-items-center bg-[#061426]" role="status" aria-label="Loading admin session"><div className="loader" /></div>;
  return <div className="min-h-screen bg-[#f3efe7] text-[#061426]"><div className="fixed inset-y-0 left-0 z-30 hidden lg:block"><Sidebar collapsed={collapsed} session={session} toggle={() => setCollapsed((value) => !value)} /></div>{mobileOpen && <div className="fixed inset-0 z-50 lg:hidden"><button className="absolute inset-0 bg-[#061426]/55" onClick={() => setMobileOpen(false)} aria-label="Close navigation overlay" /><div className="relative h-full w-72"><Sidebar collapsed={false} mobile session={session} close={() => setMobileOpen(false)} toggle={() => {}} /></div></div>}<div className={cn("min-h-screen transition-[padding]", collapsed ? "lg:pl-[76px]" : "lg:pl-64")}><header className="sticky top-0 z-20 flex h-17 items-center border-b border-[#061426]/10 bg-[#f3efe7]/90 px-4 backdrop-blur sm:px-7"><button onClick={() => setMobileOpen(true)} className="grid size-10 place-items-center rounded-md border border-[#061426]/15 lg:hidden" aria-label="Open navigation"><Menu className="size-5" /></button><div className="ml-auto flex items-center gap-2 font-mono text-[9px] uppercase tracking-[.16em] text-[#061426]/50"><Boxes className="size-4 text-[#9a7432]" />Admin workspace</div></header><main className="p-4 sm:p-7 lg:p-9">{children}</main></div></div>;
}
