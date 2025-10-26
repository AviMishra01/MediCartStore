import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";

// Add phone to AuthUser type
export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  phone?: string; // <-- added
  role?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, phone?: string) => Promise<void>; // <-- added phone
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load from storage on mount
  useEffect(() => {
    const t = localStorage.getItem("auth_token");
    if (t) setToken(t);
  }, []);

  // Whenever token changes, fetch current user
  useEffect(() => {
    (async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const me = await apiGet<AuthUser>("/api/auth/me", undefined, token);
        setUser(me);
      } catch {
        setUser(null);
        setToken(null);
        localStorage.removeItem("auth_token");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await apiPost<{ token: string; user: AuthUser }>("/api/auth/login", { email, password });
    setToken(res.token);
    localStorage.setItem("auth_token", res.token);
    setUser(res.user);
  };

  const signup = async (name: string, email: string, password: string, phone?: string) => {
    // <-- send phone to backend
    const res = await apiPost<{ token: string; user: AuthUser }>("/api/auth/signup", { name, email, password, phone });
    setToken(res.token);
    localStorage.setItem("auth_token", res.token);
    setUser(res.user); // user now includes phone
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_token");
  };

  const refresh = async () => {
    if (!token) return;
    const me = await apiGet<AuthUser>("/api/auth/me", undefined, token);
    setUser(me);
  };

  const value = useMemo(
    () => ({ user, token, loading, login, signup, logout, refresh }),
    [user, token, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
