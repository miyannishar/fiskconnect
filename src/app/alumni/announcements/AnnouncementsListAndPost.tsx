"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AnnouncementCard } from "@/components/shared/AnnouncementCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Announcement } from "@/lib/types";
import { Plus } from "lucide-react";

type AnnouncementWithAuthor = Announcement & { authorName?: string | null };

const AUDIENCES = ["all", "students", "alumni", "admin"] as const;

export function AnnouncementsListAndPost({
  initialAnnouncements,
}: {
  initialAnnouncements: AnnouncementWithAuthor[];
}) {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [audience, setAudience] = useState<(typeof AUDIENCES)[number]>("all");
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const log = (msg: string, data?: unknown) => console.log("[Post announcement]", msg, data ?? "");
    setSubmitError(null);
    setLoading(true);
    log("Submit started");
    try {
      const { data: { user } } = await supabase.auth.getUser();
      log("getUser result", { userId: user?.id ?? null });
      if (!user) {
        setSubmitError("You must be signed in to post an announcement.");
        return;
      }
      const payload = { author_id: user.id, title: title.trim(), content: content.trim(), audience };
      log("Insert payload", payload);
      const { data: inserted, error } = await supabase
        .from("announcements")
        .insert(payload)
        .select()
        .single();

      log("Insert result", { inserted: !!inserted, error: error?.message ?? null, details: error ?? null });

      if (error) {
        setSubmitError(error.message || "Failed to post announcement.");
        return;
      }
      if (!inserted) {
        setSubmitError("Something went wrong. Please try again.");
        return;
      }
      const profile = await supabase.from("profiles").select("full_name").eq("id", user.id).single();
      setAnnouncements([
        { ...inserted, authorName: profile.data?.full_name ?? null },
        ...announcements,
      ]);
      setOpen(false);
      setTitle("");
      setContent("");
      setAudience("all");
      log("Success — dialog closed, list updated");
    } catch (err) {
      console.error("[Post announcement] Caught error", err);
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-lg gap-2">
              <Plus className="h-4 w-4" /> Post announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-lg" onOpenAutoFocus={() => setSubmitError(null)}>
            <DialogHeader>
              <DialogTitle>Post announcement</DialogTitle>
            </DialogHeader>
            {submitError && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2" role="alert">
                {submitError}
              </p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} required className="bg-card border-border" />
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea value={content} onChange={(e) => setContent(e.target.value)} required className="bg-card border-border min-h-[120px]" />
              </div>
              <div className="space-y-2">
                <Label>Audience</Label>
                <Select value={audience} onValueChange={(v) => setAudience(v as (typeof AUDIENCES)[number])}>
                  <SelectTrigger className="bg-card border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AUDIENCES.map((a) => (
                      <SelectItem key={a} value={a}>
                        {a.charAt(0).toUpperCase() + a.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full rounded-lg" disabled={loading}>
                {loading ? "Posting…" : "Post"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {announcements.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">No announcements yet.</p>
      ) : (
        <div className="space-y-4">
          {announcements.map((a) => (
            <AnnouncementCard key={a.id} announcement={a} authorName={a.authorName} />
          ))}
        </div>
      )}
    </div>
  );
}
