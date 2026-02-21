"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? undefined;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    console.log("[Login] start", { email: email.trim() });

    try {
      const supabase = createClient();
      console.log("[Login] calling signInWithPassword...");
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      console.log("[Login] signIn result", {
        hasUser: !!authData?.user,
        userId: authData?.user?.id,
        error: authError?.message,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (!authData.user) {
        setError("Login failed. Please try again.");
        return;
      }

      console.log("[Login] fetching profile...");
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role, onboarding_complete")
        .eq("id", authData.user.id)
        .single();

      console.log("[Login] profile result", { profile, profileError: profileError?.message });

      if (profile?.role === "alumni" && profile?.onboarding_complete === false) {
        console.log("[Login] redirecting to /alumni/onboarding");
        router.push("/alumni/onboarding");
        router.refresh();
        return;
      }

      const dashboard =
        profile?.role === "student"
          ? "/student"
          : profile?.role === "alumni"
            ? "/alumni"
            : "/admin";
      const path = redirect || dashboard;
      console.log("[Login] redirecting to", path);
      router.push(path);
      router.refresh();
      console.log("[Login] router.push + refresh called");
    } catch (err) {
      console.error("[Login] unexpected error", err);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@my.fisk.edu"
          required
          className="bg-card border-white/10"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-card border-white/10"
        />
      </div>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" className="w-full rounded-lg" disabled={loading}>
        {loading ? "Signing in…" : "Log In"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
