import { createClient } from "@/lib/supabase/server";
import { StatsCards } from "@/components/admin/StatsCards";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const { count: studentsCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "student");

  const { count: alumniCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "alumni");

  const { count: adminsCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "admin");

  const { count: opportunitiesCount } = await supabase
    .from("opportunities")
    .select("*", { count: "exact", head: true });

  const { data: donationsData } = await supabase.from("donations").select("amount");
  const donationsTotal = (donationsData ?? []).reduce((sum, d) => sum + Number(d.amount), 0);

  const { count: pendingEventsCount } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of the platform.</p>
      </div>
      <StatsCards
        studentsCount={studentsCount ?? 0}
        alumniCount={alumniCount ?? 0}
        adminsCount={adminsCount ?? 0}
        opportunitiesCount={opportunitiesCount ?? 0}
        donationsTotal={donationsTotal}
        pendingEventsCount={pendingEventsCount ?? 0}
      />
    </div>
  );
}
