"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Organization Management
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Manage your organization&apos;s departments and sub-departments with
          ease
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/login">
            <Button variant="primary" size="lg">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="secondary" size="lg">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
