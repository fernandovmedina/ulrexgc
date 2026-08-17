import { getSupabaseClient } from "@/lib/supabase/client";
import type { AuthRepository, AuthSession } from "@/lib/auth/types";

const SESSION_KEY = "ulrex_crm_session_v1";
const AUTH_EVENT = "ulrex-auth-change";
export const LOCAL_ADMIN_EMAIL = "admin@ulrexgc.com";
export const LOCAL_ADMIN_PASSWORD = "ulrex-dev";

function notify() { window.dispatchEvent(new Event(AUTH_EVENT)); }
// Development stand-in only: localStorage sessions and hardcoded credentials provide no real security.
// Production access is enforced by Supabase Auth together with the database RLS policies.
const localAuth: AuthRepository = {
  async signIn({ email, password }) { if (email.toLowerCase() !== LOCAL_ADMIN_EMAIL || password !== LOCAL_ADMIN_PASSWORD) throw new Error("Invalid email or password."); const session: AuthSession = { user: { id: "local-admin", email: LOCAL_ADMIN_EMAIL, name: "Ulrex Admin" }, accessToken: "local-development-session" }; window.localStorage.setItem(SESSION_KEY, JSON.stringify(session)); notify(); return session; },
  async signOut() { window.localStorage.removeItem(SESSION_KEY); notify(); },
  async getSession() { if (typeof window === "undefined") return null; const stored = window.localStorage.getItem(SESSION_KEY); if (!stored) return null; try { return JSON.parse(stored) as AuthSession; } catch { window.localStorage.removeItem(SESSION_KEY); return null; } },
  async isAdmin(session) { return session.user.id === "local-admin" && session.user.email === LOCAL_ADMIN_EMAIL; },
  onAuthStateChange(callback) { const listener = () => { void this.getSession().then(callback).catch(() => callback(null)); }; window.addEventListener(AUTH_EVENT, listener); return () => window.removeEventListener(AUTH_EVENT, listener); },
};
function requireClient() { const client = getSupabaseClient(); if (!client) throw new Error("Supabase is selected but its public environment variables are missing."); return client; }
const supabaseAuth: AuthRepository = {
  async signIn(credentials) { const { data, error } = await requireClient().auth.signInWithPassword(credentials); if (error) throw error; if (!data.session || !data.user.email) throw new Error("No session returned."); return { user: { id: data.user.id, email: data.user.email, name: data.user.user_metadata.full_name ?? data.user.email }, accessToken: data.session.access_token }; },
  async signOut() { const { error } = await requireClient().auth.signOut(); if (error) throw error; },
  async getSession() { const { data, error } = await requireClient().auth.getSession(); if (error) throw error; const session = data.session; if (!session?.user.email) return null; return { user: { id: session.user.id, email: session.user.email, name: session.user.user_metadata.full_name ?? session.user.email }, accessToken: session.access_token }; },
  async isAdmin(session) { const { data, error } = await requireClient().from("profiles").select("role").eq("id", session.user.id).maybeSingle(); return !error && data?.role === "admin"; },
  onAuthStateChange(callback) { const { data } = requireClient().auth.onAuthStateChange((_event, session) => callback(session?.user.email ? { user: { id: session.user.id, email: session.user.email, name: session.user.user_metadata.full_name ?? session.user.email }, accessToken: session.access_token } : null)); return () => data.subscription.unsubscribe(); },
};
export const authRepository: AuthRepository = process.env.NEXT_PUBLIC_DATA_DRIVER === "supabase" ? supabaseAuth : localAuth;
