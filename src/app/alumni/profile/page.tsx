import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataCard } from "@/components/shared/DataCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default async function AlumniProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title="My Profile"
        description="Your public profile for the alumni directory."
      />
      <DataCard title="" noPadding>
        <div className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 border border-border">
              <AvatarImage src={profile.avatar_url ?? undefined} alt={profile.full_name ?? profile.email} />
              <AvatarFallback className="bg-primary/20 text-xl text-primary">
                {(profile.full_name ?? profile.email).slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{profile.full_name ?? profile.email}</h2>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
              {profile.graduation_year && (
                <p className="text-sm text-muted-foreground">Class of {profile.graduation_year}</p>
              )}
              <div className="flex gap-2 mt-2">
                {profile.open_to_mentor && (
                  <Badge variant="secondary" className="bg-success/20 text-success">Open to Mentoring</Badge>
                )}
                {profile.open_to_contact && (
                  <Badge variant="outline">Open to Contact</Badge>
                )}
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-4 border-t border-border pt-6">
          {(profile.current_title || profile.current_company) && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Current role</h3>
              <p className="text-foreground">
                {[profile.current_title, profile.current_company].filter(Boolean).join(" @ ")}
              </p>
            </div>
          )}
          {profile.major && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Major at Fisk</h3>
              <p className="text-foreground">{profile.major}</p>
            </div>
          )}
          {profile.industry && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Industry</h3>
              <p className="text-foreground">{profile.industry}</p>
            </div>
          )}
          {profile.location && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
              <p className="text-foreground">{profile.location}</p>
            </div>
          )}
          {profile.bio && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Bio</h3>
              <p className="text-foreground whitespace-pre-wrap">{profile.bio}</p>
            </div>
          )}
          {(profile.skills?.length ?? 0) > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Skills</h3>
              <div className="flex flex-wrap gap-1">
                {profile.skills!.map((s: string) => (
                  <Badge key={s} variant="outline" className="font-normal">{s}</Badge>
                ))}
              </div>
            </div>
          )}
          {profile.linkedin_url && (
            <div>
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm"
              >
                LinkedIn profile →
              </a>
            </div>
          )}
          </div>
        </div>
      </DataCard>
    </div>
  );
}
