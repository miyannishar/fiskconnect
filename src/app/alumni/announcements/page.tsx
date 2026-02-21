import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/PageHeader";
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
      <PageHeader
        title="Announcements"
        description="View and post announcements to the community."
      />
      <AnnouncementsListAndPost initialAnnouncements={list} />
    </div>
  );
}
