"use client";

import type { ReactNode } from "react";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { AuthScreen } from "@/components/auth-screen";
import { AuthLoadingScreen } from "./auth-loading-screen";

function AppContent({ children }: { children: ReactNode }) {
  const { isLoading, user } = useAuth();
  if (isLoading) return <AuthLoadingScreen />;
  if (!user) return <AuthScreen />;
  return <>{children}</>;
}

export function AppWrapper({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AppContent>{children}</AppContent>
    </AuthProvider>
  );
}
