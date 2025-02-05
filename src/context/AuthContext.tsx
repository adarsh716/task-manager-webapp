"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useRouter, usePathname } from "next/navigation";

type User={
  id:string|null;
  email:string;
}

interface AuthContextType {
  user: User|null;
  token: string | null;
  loading: boolean;
  setUser: (user: User, token: string) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUserState] = useState<User|null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken) {
        setUserState(JSON.parse(storedUser));
        setTokenState(storedToken);
      }
    }
  }, []);

  const setUser = (user: User, token: string) => {
    setUserState(user);
    setTokenState(token);

    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    }
  };

  useEffect(() => {
    if (!token) {
      if (["login", "register"].includes(pathname!)) {
        router.push(pathname!);
        return;
      }
    } 
  }, [token]);

  const logout = () => {
    setUserState(null);
    setTokenState(null);
    router.push("/login");

    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  };

  return (
    <AuthContext.Provider
      value={{ loading, setUser, logout, user, token, setLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
