import { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import { AuthContext } from "./context";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const currentUser = await api.me();
      setUser(currentUser);
      return currentUser;
    } catch (error) {
      if (error.message.includes("(401)")) setUser(null);
      else setUser(null);
      return null;
    }
  };

  useEffect(() => {
    // Authentication must be restored from the HttpOnly cookie after mounting.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshUser().finally(() => setLoading(false));
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAdmin: user?.role === "admin",
      login: async (email, password) => {
        const result = await api.login(email, password);
        setUser(result.user);
        return result.user;
      },
      register: async (name, email, password) => {
        const result = await api.register(name, email, password);
        setUser(result.user);
        return result.user;
      },
      refreshUser,
    }),
    [loading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
