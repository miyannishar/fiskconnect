import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back{profile?.full_name ? `, ${profile.full_name}` : ""}
        </h1>
        <p className="text-muted-foreground mt-1">Here&apos;s your alumni dashboard overview.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Opportunities Posted</CardTitle>
            <Briefcase className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{opportunitiesCount ?? 0}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Donations Made</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{donationsCount ?? 0}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Events Created</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{eventsCount ?? 0}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
