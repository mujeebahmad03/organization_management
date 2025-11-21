"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Loader } from "@/components/loader";
import { ROUTES } from "@/lib/constants";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(ROUTES.LOGIN);
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
