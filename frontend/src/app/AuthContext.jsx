import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { apiClient } from "../shared/api/client";

const AuthContext = createContext(undefined);
const AUTH_DEBUG_PREFIX = "[AUTH_DEBUG]";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async (options = {}) => {
    const { source = "unknown", preserveUserOnError = false } = options;
    console.log(`${AUTH_DEBUG_PREFIX} refreshUser:start`, { source, preserveUserOnError });
    try {
      const response = await apiClient.get("/auth/me", {
        feedback: { error: false },
      });
      setUser(response.data.user);
      console.log(`${AUTH_DEBUG_PREFIX} refreshUser:success`, {
        source,
        role: response.data?.user?.role,
        email: response.data?.user?.email,
      });
    } catch (error) {
      if (!preserveUserOnError) {
        setUser(null);
      }
      console.warn(`${AUTH_DEBUG_PREFIX} refreshUser:failed`, {
        source,
        preserveUserOnError,
        status: error?.response?.status,
        data: error?.response?.data,
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    console.log(`${AUTH_DEBUG_PREFIX} logout:start`);
    try {
      await apiClient.post("/auth/logout", null, {
        feedback: { success: "Logged out successfully." },
      });
    } finally {
      setUser(null);
      console.log(`${AUTH_DEBUG_PREFIX} logout:completed`);
    }
  };

  const setAuthenticatedUser = (nextUser) => {
    setUser(nextUser);
    setLoading(false);
    console.log(`${AUTH_DEBUG_PREFIX} setAuthenticatedUser`, {
      role: nextUser?.role,
      email: nextUser?.email,
    });
  };

  useEffect(() => {
    void refreshUser({ source: "bootstrap" });
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
