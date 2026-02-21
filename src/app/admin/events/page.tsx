import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { AdminEventsClient } from "./AdminEventsClient";
import type { Event } from "@/lib/types";
import type { Profile } from "@/lib/types";

export default async function AdminEventsPage() {
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("events")
    .select(`*, profiles!organizer_id ( id, full_name )`)
    .order("created_at", { ascending: false });

  const list = (events ?? []).map((e: Event & { profiles: Profile | null }) => ({
    ...e,
    organizerName: e.profiles?.full_name ?? null,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Events"
        description="Approve or reject event requests from alumni."
      />
      <AdminEventsClient initialEvents={list} />
    </div>
  );
}
