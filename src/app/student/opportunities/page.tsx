import { createClient } from "@/lib/supabase/server";
import { StudentOpportunitiesClient } from "./StudentOpportunitiesClient";
import type { Opportunity } from "@/lib/types";
import type { Profile } from "@/lib/types";

export default async function StudentOpportunitiesPage() {
  const supabase = await createClient();
  const { data: opportunities } = await supabase
    .from("opportunities")
    .select(`*, profiles!author_id ( id, full_name )`)
    .eq("status", "open")
    .order("created_at", { ascending: false });

  const list = (opportunities ?? []).map((o: Opportunity & { profiles: Profile | null }) => ({
    ...o,
    authorName: o.profiles?.full_name ?? null,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Opportunity Board</h1>
        <p className="text-muted-foreground mt-1">Browse internships, jobs, and more.</p>
      </div>
      <StudentOpportunitiesClient initialOpportunities={list} />
    </div>
  );
}
