"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Trophy, Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { loginUser, clearAuthError } from "@/store/slices/authSlice";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { LoadingState } from "@/components/ui/LoadingState";
import { useToast } from "@/components/ui/Toast";
import { getErrorMessage } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const toast = useToast();

  const { isAuthenticated, user, isLoading, error } = useAppSelector(
    (state) => state.auth
  );

  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const sessionExpired = searchParams?.get("expired") === "true";

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "ADMIN") {
        router.replace("/admin");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [isAuthenticated, user, router]);

  const onSubmit = async (data: LoginFormValues) => {
    setAuthError(null);
    try {
      const resultAction = await dispatch(loginUser(data));
      if (loginUser.fulfilled.match(resultAction)) {
        toast.success("Welcome back to Digital Heroes!");
        const loggedUser = resultAction.payload.user;
        if (loggedUser.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      } else if (loginUser.rejected.match(resultAction)) {
        setAuthError(resultAction.payload as string);
      }
    } catch (err) {
      setAuthError(getErrorMessage(err));
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <Trophy className="w-5 h-5 text-slate-950 font-black" />
          </div>
        </Link>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Sign In to Digital Heroes
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Access your golf scores, monthly draw entries, and charity metrics.
        </p>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800/80 shadow-2xl">
        {sessionExpired && (
          <div className="mb-6 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Your session has expired. Please sign in again.</span>
          </div>
        )}

        {(authError || error) && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{authError || error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            leftIcon={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            error={errors.password?.message}
            {...register("password")}
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full mt-2"
            isLoading={isLoading}
          >
            Sign In
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            Don't have an account yet?{" "}
            <Link
              href="/register"
              className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Suspense fallback={<LoadingState message="Loading sign in..." />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
