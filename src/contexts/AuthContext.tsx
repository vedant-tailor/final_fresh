
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate, NavigateFunction } from 'react-router-dom';
import { api } from '@/lib/api';
import { toast } from "@/components/ui/use-toast";

// Define the AuthContext type
interface AuthContextProps {
  token: string | null;
  user: any | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<any>;
  logout: () => void;
  isAuthenticated: () => boolean;
  updatePassword: (password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// Create the AuthContext with a default value
const AuthContext = createContext<AuthContextProps>({
  token: null,
  user: null,
  isLoading: false,
  login: async () => {},
  signup: async () => ({}),
  logout: () => {},
  isAuthenticated: () => false,
  updatePassword: async () => {},
  resetPassword: async () => {},
});

// Define these constants at the top of the file
const TOKEN_KEY = 'supabase_token';
const USER_KEY = 'supabase_user';

// Create a BrowserRouter-independent version of AuthProvider
export const AuthProviderWithoutRouter: React.FC<{ 
  children: React.ReactNode;
  navigate: NavigateFunction;
}> = ({ children, navigate }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem(TOKEN_KEY) || null);
  const [user, setUser] = useState<any | null>(JSON.parse(localStorage.getItem(USER_KEY) || 'null'));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    } else {
      // If token or user is missing, ensure both are cleared to avoid inconsistencies
      setToken(null);
      setUser(null);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
    setIsLoading(false)
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { user, token } = await api.login(email, password);
      setToken(token);
      setUser(user);
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      
      // Redirect user after login
      navigate('/products');
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to login",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await api.signup(username, email, password);
      
      // If signup doesn't require email verification, log the user in
      if (!result.emailVerificationRequired) {
        setToken(result.token);
        setUser(result.user);
        localStorage.setItem(TOKEN_KEY, result.token);
        localStorage.setItem(USER_KEY, JSON.stringify(result.user));
      }
      
      toast({
        title: "Success",
        description: result.emailVerificationRequired 
          ? "Account created! Please verify your email."
          : "Account created successfully!",
      });
      
      return result;
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create account",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await api.logout();
      setToken(null);
      setUser(null);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      
      // Redirect user after logout
      navigate('/login');
      toast({
        title: "Success",
        description: "Logged out successfully!",
      });
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        title: "Error",
        description: "Logout failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isAuthenticated = () => {
    return !!token;
  };

  const updatePassword = async (password: string) => {
    setIsLoading(true);
    try {
      await api.updatePassword(password);
      toast({
        title: "Success",
        description: "Password updated successfully!",
      });
    } catch (error) {
      console.error("Update password error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update password",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      await api.resetPassword(email);
      toast({
        title: "Success",
        description: "Password reset email sent!",
      });
    } catch (error) {
      console.error("Reset password error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send reset email",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        token, 
        user, 
        isLoading, 
        login, 
        signup,
        logout, 
        isAuthenticated,
        updatePassword,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// This is the wrapper component that will be used in App.tsx
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // We can't use useNavigate here! It must be used inside a Router
  // This is a dummy navigate function that will be replaced
  const dummyNavigate = () => {
    console.error("Navigation attempted outside Router context");
  };
  
  return (
    <AuthProviderWithoutRouter navigate={dummyNavigate as NavigateFunction}>
      {children}
    </AuthProviderWithoutRouter>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
