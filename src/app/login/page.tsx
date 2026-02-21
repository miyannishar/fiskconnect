import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <Link href="/" className="text-2xl font-bold text-primary">
          FiskConnect
        </Link>
        <h1 className="text-xl font-semibold text-foreground">Log in</h1>
        <Suspense fallback={<div className="animate-pulse h-9 bg-muted rounded-md" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
