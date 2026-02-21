"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getRoleFromEmail } from "@/lib/utils";
import { signUp } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Shield } from "lucide-react";

function RoleBadge({ email }: { email: string }) {
  const role = getRoleFromEmail(email);
  if (!email.includes("@")) return null;
  if (role === "student")
    return (
      <Badge variant="secondary" className="bg-primary/20 text-primary gap-1 mt-1">
        <GraduationCap className="w-3 h-3" /> Student account
      </Badge>
    );
  if (role === "alumni")
    return (
      <Badge variant="secondary" className="bg-primary/20 text-primary gap-1 mt-1">
        <GraduationCap className="w-3 h-3" /> Alumni account
      </Badge>
    );
  if (role === "admin")
    return (
      <Badge variant="secondary" className="bg-primary/20 text-primary gap-1 mt-1">
        <Shield className="w-3 h-3" /> Admin account
      </Badge>
    );
  return (
    <Badge variant="destructive" className="mt-1">
      Please use your Fisk University email
    </Badge>
  );
}

export function SignupForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const role = getRoleFromEmail(email);

    if (!role) {
      setError("Please use your Fisk University email to sign up.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const result = await signUp({
        email: email.trim(),
        password,
        full_name: fullName.trim(),
        role,
      });

      if (result.success) {
        router.push(result.path);
        router.refresh();
        return;
      }

      setError(result.error);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Jane Doe"
          required
          className="bg-card border-border"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@my.fisk.edu"
          required
          className="bg-card border-border"
        />
        <RoleBadge email={email} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="bg-card border-border"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="bg-card border-border"
        />
      </div>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" className="w-full rounded-lg" disabled={loading}>
        {loading ? "Creating account…" : "Sign Up"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
