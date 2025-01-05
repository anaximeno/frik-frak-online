import React, { createContext, useContext, useState } from "react";
import api from "../services/api";

export interface IUserData {
  id: string;
  username: string;
  email: string;
  player_id?: string;
}

export interface ILoginData {
  username: string;
  password: string;
}

interface AuthContextType {
  user: IUserData | null;
  token: string | null;
  login: (loginData: ILoginData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [user, setUser] = useState<IUserData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authInterceptorId, setAuthInterceptorId] = useState<number | null>(
    null
  );

  const login = async (loginData: ILoginData) => {
    try {
      const authTokenResponse = await api.post("/auth/token/login", loginData);
      const authToken = authTokenResponse.data.auth_token;

      setToken(authToken);

      const interceptorId = api.interceptors.request.use((config) => {
        if (authToken) config.headers.Authorization = `Token ${authToken}`;
        return config;
      });

      setAuthInterceptorId(interceptorId);

      const userResponse = await api.get("/auth/users/me");

      setUser(userResponse.data);

      // TODO: use this to initialize the user auth in case it is available
      localStorage.setItem("auth:token", authToken);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/token/logout");
    } catch (e) {
      console.log("API Logout Error:", e);
    } finally {
      setUser(null);
      setToken(null);

      localStorage.removeItem("auth:token");

      if (authInterceptorId) {
        api.interceptors.request.eject(authInterceptorId);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
