export interface AdminUser { id: string; email: string; name: string }
export interface AuthSession { user: AdminUser; accessToken: string }
export interface AuthRepository {
  signIn(credentials: { email: string; password: string }): Promise<AuthSession>;
  signOut(): Promise<void>;
  getSession(): Promise<AuthSession | null>;
  isAdmin(session: AuthSession): Promise<boolean>;
  onAuthStateChange(callback: (session: AuthSession | null) => void): () => void;
}
