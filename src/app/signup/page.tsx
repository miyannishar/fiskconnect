import Link from "next/link";
import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <Link href="/" className="text-2xl font-bold text-primary">
          FiskConnect
        </Link>
        <h1 className="text-xl font-semibold text-foreground">Create an account</h1>
        <SignupForm />
      </div>
    </div>
  );
}
