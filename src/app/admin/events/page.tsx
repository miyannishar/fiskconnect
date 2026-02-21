import { createClient } from "@/lib/supabase/server";
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
      <div>
        <h1 className="text-2xl font-bold text-foreground">Event requests</h1>
        <p className="text-muted-foreground mt-1">Approve or reject event requests.</p>
      </div>
      <AdminEventsClient initialEvents={list} />
    </div>
  );
}
