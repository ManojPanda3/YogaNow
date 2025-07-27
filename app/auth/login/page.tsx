'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition, FormEvent } from "react";
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<{ email?: string; password?: string; api?: string }>({});
  const router = useRouter();

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({}); // Reset errors on new submission

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      const newErrors: { email?: string; password?: string } = {};
      if (!email) newErrors.email = "Email is required.";
      if (!password) newErrors.password = "Password is required.";
      setErrors(newErrors);
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          const errorMessage = errorData.message || "Invalid credentials.";
          // Display error in a toast AND as a form-level message
          setErrors({ api: errorMessage });
          toast.error(errorMessage);
          return;
        }

        toast.success("Login successful!");
        router.push('/products'); // redirecting user to the products page
        router.refresh()

      } catch (_error) {
        let errorMessage = "An unexpected network error occurred.";
        if (_error instanceof Error) {
          errorMessage = _error.message;
          console.log(_error.message); // Log the error message as requested
        }
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
            <h2 className="text-3xl font-bold text-card-foreground">Login</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Welcome back! Please enter your details.
            </p>
          </div>
          <form onSubmit={login} className="space-y-6">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/auth/forgot_password"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
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
                  <span>Logging in...</span>
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
          <p className="text-sm text-center text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="font-medium text-primary hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
