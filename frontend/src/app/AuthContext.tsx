import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiClient } from "../shared/api/client";
import type { AuthUser } from "../shared/types";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async (): Promise<void> => {
    try {
      const response = await apiClient.get<{ user: AuthUser }>("/auth/me");
      setUser(response.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    await apiClient.post("/auth/logout");
    setUser(null);
  };

  useEffect(() => {
    void refreshUser();
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      refreshUser,
      logout,
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}
