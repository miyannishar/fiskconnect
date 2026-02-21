import { createClient } from "@/lib/supabase/server";
import { AnnouncementsListAndPost } from "./AnnouncementsListAndPost";
import type { Announcement } from "@/lib/types";
import type { Profile } from "@/lib/types";

export default async function AlumniAnnouncementsPage() {
  const supabase = await createClient();
  const { data: announcements } = await supabase
    .from("announcements")
    .select(`
      *,
      profiles!author_id ( id, full_name )
    `)
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false });

  const list = (announcements ?? []).map((a: Announcement & { profiles: Profile | null }) => ({
    ...a,
    authorName: a.profiles?.full_name ?? null,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Announcements</h1>
        <p className="text-muted-foreground mt-1">View and post announcements.</p>
      </div>
      <AnnouncementsListAndPost initialAnnouncements={list} />
    </div>
  );
}
