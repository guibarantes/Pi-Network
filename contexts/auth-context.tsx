"use client";

import type { User as SupabaseUser } from "@supabase/supabase-js";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

export interface AuthUser {
  id: string;
  email: string | null;
  displayName: string;
  role: "user" | "admin";
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isPasswordRecovery: boolean;
  configurationError: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function fallbackName(user: SupabaseUser, preferredName?: string) {
  return (
    preferredName?.trim() ||
    (typeof user.user_metadata?.name === "string" ? user.user_metadata.name.trim() : "") ||
    user.email?.split("@")[0] ||
    "Usuário Bento"
  );
}

async function loadKitchenUser(
  currentUser: SupabaseUser,
  preferredName?: string,
): Promise<AuthUser> {
  const supabase = getSupabase();
  const displayName = fallbackName(currentUser, preferredName);
  const email = currentUser.email ?? "";

  const { error: insertError } = await supabase.from("kitchen_profiles").insert({
    id: currentUser.id,
    display_name: displayName,
    email,
  });

  if (insertError && insertError.code !== "23505") throw insertError;

  const { error: preferencesError } = await supabase
    .from("kitchen_preferences")
    .insert({ user_id: currentUser.id });

  if (preferencesError && preferencesError.code !== "23505") throw preferencesError;

  const { data: profile, error: profileError } = await supabase
    .from("kitchen_profiles")
    .select("display_name, role")
    .eq("id", currentUser.id)
    .single();

  if (profileError) throw profileError;

  return {
    id: currentUser.id,
    email: currentUser.email ?? null,
    displayName: profile.display_name,
    role: profile.role === "admin" ? "admin" : "user",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    const supabase = getSupabase();
    let active = true;

    const syncUser = async (currentUser: SupabaseUser | null) => {
      if (!currentUser) {
        if (active) {
          setUser(null);
          setIsLoading(false);
        }
        return;
      }

      try {
        const kitchenUser = await loadKitchenUser(currentUser);
        if (active) setUser(kitchenUser);
      } catch (error) {
        console.error("Não foi possível carregar o perfil do Cozinha:", error);
        if (active) setUser(null);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") setIsPasswordRecovery(true);
      void syncUser(session?.user ?? null);
    });

    void supabase.auth.getSession().then(({ data: sessionData }) => {
      void syncUser(sessionData.session?.user ?? null);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isPasswordRecovery,
      configurationError: !isSupabaseConfigured,
      signIn: async (email, password) => {
        const { data, error } = await getSupabase().auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.user) setUser(await loadKitchenUser(data.user));
      },
      signUp: async (name, email, password) => {
        const { data, error } = await getSupabase().auth.signUp({
          email,
          password,
          options: { data: { name: name.trim() } },
        });
        if (error) throw error;
        if (data.session && data.user) setUser(await loadKitchenUser(data.user, name));
      },
      resetPassword: async (email) => {
        const { error } = await getSupabase().auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });
        if (error) throw error;
      },
      updatePassword: async (password) => {
        const { error } = await getSupabase().auth.updateUser({ password });
        if (error) throw error;
        setIsPasswordRecovery(false);
      },
      signOut: async () => {
        const { error } = await getSupabase().auth.signOut();
        if (error) throw error;
        setUser(null);
      },
    }),
    [isLoading, isPasswordRecovery, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
}
