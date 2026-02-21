"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { OpportunityCard } from "@/components/shared/OpportunityCard";
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
import { Switch } from "@/components/ui/switch";
import type { Opportunity } from "@/lib/types";
import { Plus } from "lucide-react";

type OpportunityWithAuthor = Opportunity & { authorName?: string | null };

const TYPES = ["internship", "job", "research", "volunteer", "project", "other"] as const;

export function OpportunitiesListAndPost({
  initialOpportunities,
}: {
  initialOpportunities: OpportunityWithAuthor[];
}) {
  const [opportunities, setOpportunities] = useState(initialOpportunities);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<(typeof TYPES)[number]>("job");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [isRemote, setIsRemote] = useState(false);
  const [link, setLink] = useState("");
  const [tags, setTags] = useState("");
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }
    const { data: inserted, error } = await supabase
      .from("opportunities")
      .insert({
        author_id: user.id,
        title: title.trim(),
        description: description.trim(),
        type,
        company: company.trim() || null,
        location: location.trim() || null,
        is_remote: isRemote,
        link: link.trim() || null,
        tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : null,
      })
      .select()
      .single();

    if (!error && inserted) {
      const profile = await supabase.from("profiles").select("full_name").eq("id", user.id).single();
      setOpportunities([
        { ...inserted, authorName: profile.data?.full_name ?? null },
        ...opportunities,
      ]);
      setOpen(false);
      setTitle("");
      setDescription("");
      setType("job");
      setCompany("");
      setLocation("");
      setIsRemote(false);
      setLink("");
      setTags("");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-lg gap-2">
              <Plus className="h-4 w-4" /> Post opportunity
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-white/10 max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Post an opportunity</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} required className="bg-card border-white/10" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} required className="bg-card border-white/10 min-h-[80px]" />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={type} onValueChange={(v) => setType(v as (typeof TYPES)[number])}>
                  <SelectTrigger className="bg-card border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Company</Label>
                <Input value={company} onChange={(e) => setCompany(e.target.value)} className="bg-card border-white/10" />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} className="bg-card border-white/10" />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={isRemote} onCheckedChange={setIsRemote} />
                <Label>Remote</Label>
              </div>
              <div className="space-y-2">
                <Label>External link (optional)</Label>
                <Input value={link} onChange={(e) => setLink(e.target.value)} type="url" placeholder="https://..." className="bg-card border-white/10" />
              </div>
              <div className="space-y-2">
                <Label>Tags (comma-separated)</Label>
                <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="react, internship" className="bg-card border-white/10" />
              </div>
              <Button type="submit" className="w-full rounded-lg" disabled={loading}>
                {loading ? "Posting…" : "Post"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {opportunities.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">No opportunities yet. Be the first to post one!</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {opportunities.map((o) => (
            <OpportunityCard key={o.id} opportunity={o} authorName={o.authorName} showViewDetails />
          ))}
        </div>
      )}
    </div>
  );
}
