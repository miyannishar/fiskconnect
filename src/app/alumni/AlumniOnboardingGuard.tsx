"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export function AlumniOnboardingGuard({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (profile?.role === "alumni" && profile?.onboarding_complete === false) {
      if (!pathname?.endsWith("/onboarding")) {
        router.replace("/alumni/onboarding");
      }
    }
  }, [profile?.role, profile?.onboarding_complete, pathname, loading, router]);

  return <>{children}</>;
}
