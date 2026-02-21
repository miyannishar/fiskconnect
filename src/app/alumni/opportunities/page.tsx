import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { OpportunitiesListAndPost } from "./OpportunitiesListAndPost";
import type { Opportunity } from "@/lib/types";
import type { Profile } from "@/lib/types";

export default async function AlumniOpportunitiesPage() {
  const supabase = await createClient();
  const { data: opportunities } = await supabase
    .from("opportunities")
    .select(`
      *,
      profiles!author_id ( id, full_name )
    `)
    .order("created_at", { ascending: false });

  const list = (opportunities ?? []).map((o: Opportunity & { profiles: Profile | null }) => ({
    ...o,
    authorName: o.profiles?.full_name ?? null,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Opportunity Board"
        description="Browse and post opportunities for students."
      />
      <OpportunitiesListAndPost initialOpportunities={list} />
    </div>
  );
}
