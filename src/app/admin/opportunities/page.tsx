import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataCard } from "@/components/shared/DataCard";
import { OpportunityCard } from "@/components/shared/OpportunityCard";
import type { Opportunity } from "@/lib/types";
import type { Profile } from "@/lib/types";

export default async function AdminOpportunitiesPage() {
  const supabase = await createClient();
  const { data: opportunities } = await supabase
    .from("opportunities")
    .select(`*, profiles!author_id ( id, full_name )`)
    .order("created_at", { ascending: false });

  const list = (opportunities ?? []).map((o: Opportunity & { profiles: Profile | null }) => ({
    ...o,
    authorName: o.profiles?.full_name ?? null,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Opportunities"
        description="All opportunities on the platform."
      />
      <DataCard
        title="Opportunity board"
        description={list.length === 0 ? "No opportunities yet." : `${list.length} listing(s).`}
      >
        {list.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">No opportunities yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((o) => (
              <OpportunityCard key={o.id} opportunity={o} authorName={o.authorName} showViewDetails />
            ))}
          </div>
        )}
      </DataCard>
    </div>
  );
}
