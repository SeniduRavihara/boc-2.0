"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/firebase/config";

/**
 * AUTH CONTEXT
 * 
 * This context provides the current Firebase user and loading state.
 * 
 * TODO FOR TEAM MEMBERS:
 * 1. Implement login/logout/signup functions here.
 * 2. Add profile sync with Firestore if needed.
 */

interface AuthContextType {
  user: User | null;
  loading: boolean;
  // login: (email: string, pass: string) => Promise<void>;
  // logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Basic sample: Listen for auth state changes
    // auth is null during SSR/build-time when env vars aren't set — guard safely
    if (!auth) {
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
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
