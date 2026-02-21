import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { FindAlumniClient } from "./FindAlumniClient";
import type { Profile } from "@/lib/types";

export default async function FindAlumniPage() {
  const supabase = await createClient();
  const { data: alumni } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "alumni")
    .eq("onboarding_complete", true)
    .order("full_name");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Find Alumni"
        description="Search and connect with Fisk alumni and mentors."
      />
      <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-foreground">
        AI-powered mentor matching coming soon!
      </div>
      <FindAlumniClient initialAlumni={(alumni ?? []) as Profile[]} />
    </div>
  );
}
