import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-border bg-card shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-fisk-navy hover:text-fisk-royal transition-colors"
          >
            FiskConnect
          </Link>
          <CardTitle className="text-xl">Create an account</CardTitle>
          <CardDescription>Use your Fisk University email to sign up.</CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm />
        </CardContent>
      </Card>
    </div>
  );
}
