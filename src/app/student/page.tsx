import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataCard } from "@/components/shared/DataCard";
import { OpportunityCard } from "@/components/shared/OpportunityCard";
import { AlumniCard } from "@/components/shared/AlumniCard";
import type { Opportunity } from "@/lib/types";
import type { Profile } from "@/lib/types";

export default async function StudentDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();

  const { data: recentOpportunities } = await supabase
    .from("opportunities")
    .select(`*, profiles!author_id ( full_name )`)
    .eq("status", "open")
    .order("created_at", { ascending: false })
    .limit(3);

  const { data: featuredAlumni } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "alumni")
    .eq("onboarding_complete", true)
    .eq("open_to_mentor", true)
    .limit(3);

  const opportunitiesWithAuthor = (recentOpportunities ?? []).map((o: Opportunity & { profiles: { full_name: string } | null }) => ({
    ...o,
    authorName: o.profiles?.full_name ?? null,
  }));

  return (
    <div className="space-y-8">
      <PageHeader
        title={profile?.full_name ? `Welcome back, ${profile.full_name}` : "Welcome back"}
        description="Discover opportunities and connect with alumni."
      />

      <DataCard
        title="Recent opportunities"
        description="Latest openings from alumni and partners."
        action={
          <Button asChild variant="outline" size="sm">
            <Link href="/student/opportunities">View all</Link>
          </Button>
        }
      >
        {opportunitiesWithAuthor.length === 0 ? (
          <p className="py-6 text-center text-muted-foreground">No opportunities yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {opportunitiesWithAuthor.map((o) => (
              <OpportunityCard key={o.id} opportunity={o} authorName={o.authorName} showViewDetails />
            ))}
          </div>
        )}
      </DataCard>

      <DataCard
        title="Featured alumni mentors"
        description="Alumni open to mentoring and connections."
        action={
          <Button asChild variant="outline" size="sm">
            <Link href="/student/find-alumni">Find alumni</Link>
          </Button>
        }
      >
        {(!featuredAlumni || featuredAlumni.length === 0) ? (
          <p className="py-6 text-center text-muted-foreground">No alumni mentors yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(featuredAlumni as Profile[]).map((a) => (
              <AlumniCard key={a.id} alumni={a} />
            ))}
          </div>
        )}
      </DataCard>
    </div>
  );
}
