import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/PageHeader";
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
      <PageHeader
        title="Users"
        description="View and manage all users by role."
      />
      <AdminUsersClient initialProfiles={(profiles ?? []) as Profile[]} />
    </div>
  );
}
