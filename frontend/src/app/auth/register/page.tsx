"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { registerSchema, type RegisterFormData } from "@/lib/validations";
import { useAuth } from "@/contexts/auth-context";
import { SignupForm } from "@/components/auth/register-form";
import { ROUTES, ERROR_MESSAGES } from "@/lib/constants";

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, isAuthenticated } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError(null);
      await registerUser(data.username, data.password);
      router.push(ROUTES.DASHBOARD);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : ERROR_MESSAGES.REGISTRATION_FAILED
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <SignupForm
        onSubmit={handleSubmit(onSubmit)}
        register={register}
        errors={errors}
        isSubmitting={isSubmitting}
        error={error}
        className="w-full max-w-md"
      />
    </div>
  );
}
