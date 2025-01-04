"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabaseAuth } from "@/lib/supabase-auth";
import { fetchUserRole, getCurrentSession } from "@/lib/auth-service";
import { AppUser } from "@/lib/types";


interface AuthContextType {
  session: Session | null;
  user: AppUser | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isLoading: true,
  signIn: async () => false,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const updateUserWithRole = async (currentUser: User) => {
    const role = await fetchUserRole(currentUser.id);
    setUser({ ...currentUser, role } as AppUser);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const session = await getCurrentSession();
        setSession(session);

        if (session?.user) {
          await updateUserWithRole(session.user);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabaseAuth.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (session?.user) {
          await updateUserWithRole(session.user);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabaseAuth.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) return false;

      if (data.user) {
        await updateUserWithRole(data.user);
      }

      return true;
    } catch (error) {
      console.error('Sign in error:', error);
      return false;
    }
  };

  const signOut = async () => {
    await supabaseAuth.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);