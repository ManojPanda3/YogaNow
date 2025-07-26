'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react"; // Import the icon
import Link from "next/link";
import { useState, useTransition, FormEvent } from "react";
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    startTransition(async () => {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Something went wrong");
        }

        toast.success("Login successful!");
        router.push('/dashboard');

      } catch (error: any) {
        toast.error(error.message);
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
                required
                disabled={isPending}
              />
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
                required
                disabled={isPending}
              />
            </div>
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
            Don't have an account?{" "}
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
