import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataCard } from "@/components/shared/DataCard";
import { AnnouncementCard } from "@/components/shared/AnnouncementCard";
import type { Announcement } from "@/lib/types";
import type { Profile } from "@/lib/types";

export default async function AdminAnnouncementsPage() {
  const supabase = await createClient();
  const { data: announcements } = await supabase
    .from("announcements")
    .select(`*, profiles!author_id ( id, full_name )`)
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
        description="All announcements visible to the community."
      />
      <DataCard
        title="Announcement list"
        description={list.length === 0 ? "No announcements yet." : `${list.length} announcement(s).`}
      >
        {list.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">No announcements yet.</p>
        ) : (
          <div className="space-y-4">
            {list.map((a) => (
              <AnnouncementCard key={a.id} announcement={a} authorName={a.authorName} />
            ))}
          </div>
        )}
      </DataCard>
    </div>
  );
}
