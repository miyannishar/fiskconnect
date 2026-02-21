import Link from "next/link";
import { Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-border bg-card shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-primary hover:underline"
          >
            FiskConnect
          </Link>
          <CardTitle className="text-xl">Log in</CardTitle>
          <CardDescription>Sign in with your Fisk University email.</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense
            fallback={
              <div className="h-9 animate-pulse rounded-md bg-muted" />
            }
          >
            <LoginForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
