import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { apiClient } from "../shared/api/client";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const response = await apiClient.get("/auth/me", {
        feedback: { error: false },
      });
      setUser(response.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.post("/auth/logout", null, {
        feedback: { success: "Logged out successfully." },
      });
    } finally {
      setUser(null);
    }
  };

  const setAuthenticatedUser = (nextUser) => {
    setUser(nextUser);
    setLoading(false);
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
      setAuthenticatedUser,
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}
