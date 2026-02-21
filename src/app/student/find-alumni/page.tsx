import { createClient } from "@/lib/supabase/server";
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
      <div>
        <div className="rounded-lg bg-primary/10 border border-primary/20 px-4 py-3 mb-4 text-sm text-foreground">
          AI-powered mentor matching coming soon!
        </div>
        <h1 className="text-2xl font-bold text-foreground">Find Alumni / Mentors</h1>
        <p className="text-muted-foreground mt-1">Search and connect with Fisk alumni.</p>
      </div>
      <FindAlumniClient initialAlumni={(alumni ?? []) as Profile[]} />
    </div>
  );
}
