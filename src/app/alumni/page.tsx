import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Briefcase, DollarSign, Calendar } from "lucide-react";

export default async function AlumniDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const { count: opportunitiesCount } = await supabase
    .from("opportunities")
    .select("*", { count: "exact", head: true })
    .eq("author_id", user.id);

  const { count: donationsCount } = await supabase
    .from("donations")
    .select("*", { count: "exact", head: true })
    .eq("donor_id", user.id);

  const { count: eventsCount } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true })
    .eq("organizer_id", user.id);

  return (
    <div className="space-y-8">
      <PageHeader
        title={profile?.full_name ? `Welcome back, ${profile.full_name}` : "Welcome back"}
        description="Here's your alumni dashboard overview."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Opportunities posted"
          value={opportunitiesCount ?? 0}
          icon={Briefcase}
        />
        <StatCard
          title="Donations made"
          value={donationsCount ?? 0}
          icon={DollarSign}
        />
        <StatCard
          title="Events created"
          value={eventsCount ?? 0}
          icon={Calendar}
        />
      </div>
    </div>
  );
}
