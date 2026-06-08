/**
 * pages/admin/login.tsx — Admin login page
 *
 * Problems fixed vs original:
 * - adminLogin() now returns { success, error } instead of just boolean
 *   — gives user precise error messages from the server
 * - Error message was set in Hindi ("Email ya password galat hai") — now English
 * - Form uses react-hook-form + zod for proper validation (vs raw useState)
 * - Loading state managed correctly (disabled on submit, spinner shown)
 * - Redirects to /admin after successful login
 */

import { useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { adminLogin, isAdminLoggedIn } from "@/lib/admin-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeOff, ShieldCheck, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAdminLoggedIn()) navigate("/admin");
  }, [navigate]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: LoginFormValues) {
    const result = await adminLogin(values.email, values.password);

    if (result.success) {
      toast({ title: "Welcome back!", description: "Logged in to admin panel." });
      navigate("/admin");
    } else {
      form.setError("root", {
        message: result.error ?? "Login failed. Please try again.",
      });
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, #0f1f0f 0%, #1a2e1a 50%, #0f1f0f 100%)",
      }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl"
          style={{ background: "rgba(26,90,42,.15)" }}
        />
      </div>

      <div className="w-full max-w-sm space-y-6 relative z-10">
        {/* Logo */}
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{
              background: "rgba(74,138,90,.15)",
              border: "1px solid rgba(74,138,90,.3)",
            }}
          >
            <ShieldCheck className="h-8 w-8" style={{ color: "#7fcc93" }} />
          </div>
          <h1 className="font-serif text-2xl font-bold text-white">Admin Portal</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,.4)" }}>
            ApunBazar Management
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 rounded-2xl p-6"
            style={{
              background: "rgba(255,255,255,.05)",
              border: "1px solid rgba(255,255,255,.10)",
            }}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel style={{ color: "rgba(255,255,255,.7)" }}>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="admin@apunbazar.com"
                      autoComplete="email"
                      className="bg-white/5 border-white/15 text-white placeholder:text-white/25 focus:border-green-500/60"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel style={{ color: "rgba(255,255,255,.7)" }}>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        className="bg-white/5 border-white/15 text-white placeholder:text-white/25 focus:border-green-500/60 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                        style={{ color: "rgba(255,255,255,.4)" }}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Root-level error (wrong credentials) */}
            {form.formState.errors.root && (
              <p
                className="text-sm rounded-lg px-3 py-2"
                role="alert"
                style={{
                  color: "#fca5a5",
                  background: "rgba(239,68,68,.1)",
                  border: "1px solid rgba(239,68,68,.2)",
                }}
              >
                {form.formState.errors.root.message}
              </p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full gap-2 font-semibold"
              style={{ background: "#1a5c2a", color: "#fff" }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>
        </Form>

        <p className="text-center text-xs" style={{ color: "rgba(255,255,255,.25)" }}>
          Credentials are managed via server environment variables.
        </p>
      </div>
    </div>
  );
}
