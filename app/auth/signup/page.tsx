'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition, FormEvent } from "react";
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';

export default function SignupPage() {
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<{ email?: string; password?: string; api?: string }>({});
  const router = useRouter();

  async function signup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({}); // Reset errors on new submission

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // --- Client-side validation ---
    const newErrors: { email?: string; password?: string } = {};
    if (!email) {
      newErrors.email = "Email is required.";
    }
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // --- End validation ---

    startTransition(async () => {
      try {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          const errorMessage = errorData.message || "Something went wrong during signup";
          setErrors({ api: errorMessage });
          toast.error(errorMessage);
          return;
        }

        toast.success("Signup successful! Please login.");
        router.push('/auth/login');

      } catch (error: any) {
        const errorMessage = "An unexpected network error occurred.";
        setErrors({ api: errorMessage });
        toast.error(errorMessage);
      }
    });
  }

  return (
    <>
      <Toaster position="bottom-center" toastOptions={{
        className: 'dark:bg-popover dark:text-popover-foreground',
      }} />
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-card-foreground">Sign Up</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Create an account to get started.
            </p>
          </div>
          <form onSubmit={signup} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                disabled={isPending}
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                disabled={isPending}
              />
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            </div>
            {errors.api && <p className="text-sm text-center text-red-500">{errors.api}</p>}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-primary hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
