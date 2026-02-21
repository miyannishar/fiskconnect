import { createClient } from "@/lib/supabase/server";
import { EventsListAndCreate } from "./EventsListAndCreate";
import type { Event } from "@/lib/types";
import type { Profile } from "@/lib/types";

export default async function AlumniEventsPage() {
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("events")
    .select(`
      *,
      profiles!organizer_id ( id, full_name )
    `)
    .order("date", { ascending: true });

  const list = (events ?? []).map((e: Event & { profiles: Profile | null }) => ({
    ...e,
    organizerName: e.profiles?.full_name ?? null,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Events</h1>
        <p className="text-muted-foreground mt-1">Browse events and create event requests.</p>
      </div>
      <EventsListAndCreate initialEvents={list} />
    </div>
  );
}
