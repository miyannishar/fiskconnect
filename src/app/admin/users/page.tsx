import { createClient } from "@/lib/supabase/server";
import { AdminUsersClient } from "./AdminUsersClient";
import type { Profile } from "@/lib/types";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Users</h1>
        <p className="text-muted-foreground mt-1">View all users by role.</p>
      </div>
      <AdminUsersClient initialProfiles={(profiles ?? []) as Profile[]} />
    </div>
  );
}
