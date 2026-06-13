import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { User } from "~/types";

type UserAuthCtxType = Omit<User, "last_seen">;

type AuthContextType = {
  user: UserAuthCtxType | null;
  isAuthenticated: boolean;
  isLoading?: boolean;
  login: (userData: UserAuthCtxType) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserAuthCtxType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const LOCAL_STORAGE_KEY = "auth_user";

  useEffect(() => {
    const storedUser = localStorage.getItem("auth_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (userData: UserAuthCtxType) => {
    setIsLoading(true);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
    setIsLoading(false);
  };

  const logout = () => {
    setIsLoading(true);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setUser(null);
    setIsLoading(false);
  };

  return <AuthContext.Provider value={{ user, isAuthenticated: user !== null, login, logout, isLoading }}>
    {children}
  </AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth used outside of AuthProvider");
  }
  return context;
};
