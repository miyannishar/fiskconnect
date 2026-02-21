"use client";

import { useState, useMemo } from "react";
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
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState("");
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
  const [submitError, setSubmitError] = useState<string | null>(null);
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const log = (msg: string, data?: unknown) => console.log("[Post opportunity]", msg, data ?? "");
    setSubmitError(null);
    setLoading(true);
    log("Submit started");
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      log("getUser result", { userId: user?.id ?? null, authError: authError?.message ?? null });
      if (!user) {
        log("No user — aborting");
        setSubmitError("You must be signed in to post an opportunity.");
        return;
      }
      const payload = {
        author_id: user.id,
        title: title.trim(),
        description: description.trim(),
        type,
        company: company.trim() || null,
        location: location.trim() || null,
        is_remote: isRemote,
        link: link.trim() || null,
        tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : null,
        status: "open",
      };
      log("Insert payload", payload);
      const { data: inserted, error } = await supabase
        .from("opportunities")
        .insert(payload)
        .select()
        .single();

      log("Insert result", { inserted: !!inserted, error: error?.message ?? null, details: error ?? null });

      if (error) {
        setSubmitError(error.message || "Failed to post opportunity.");
        return;
      }
      if (!inserted) {
        log("Insert returned no data");
        setSubmitError("Something went wrong. Please try again.");
        return;
      }
      log("Fetching profile for author");
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
      log("Success — dialog closed, list updated");
    } catch (err) {
      console.error("[Post opportunity] Caught error", err);
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setSubmitError(message);
    } finally {
      log("Finally — setLoading(false)");
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    return opportunities.filter((o) => {
      const matchSearch =
        !search ||
        o.title.toLowerCase().includes(search.toLowerCase()) ||
        (o.description?.toLowerCase().includes(search.toLowerCase())) ||
        (o.company?.toLowerCase().includes(search.toLowerCase()));
      const matchType = typeFilter === "all" || o.type === typeFilter;
      const matchLocation =
        !locationFilter ||
        (o.location?.toLowerCase().includes(locationFilter.toLowerCase()));
      return matchSearch && matchType && matchLocation;
    });
  }, [opportunities, search, typeFilter, locationFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-wrap">
          <Input
            placeholder="Search by keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-card border-border max-w-xs"
          />
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px] bg-card border-border">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Location"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="bg-card border-border max-w-xs"
          />
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-lg gap-2 shrink-0">
              <Plus className="h-4 w-4" /> Post opportunity
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto" onOpenAutoFocus={() => setSubmitError(null)}>
            <DialogHeader>
              <DialogTitle>Post an opportunity</DialogTitle>
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
                <Label>Description</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} required className="bg-card border-border min-h-[80px]" />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={type} onValueChange={(v) => setType(v as (typeof TYPES)[number])}>
                  <SelectTrigger className="bg-card border-border">
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
                <Input value={company} onChange={(e) => setCompany(e.target.value)} className="bg-card border-border" />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} className="bg-card border-border" />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={isRemote} onCheckedChange={setIsRemote} />
                <Label>Remote</Label>
              </div>
              <div className="space-y-2">
                <Label>External link (optional)</Label>
                <Input value={link} onChange={(e) => setLink(e.target.value)} type="url" placeholder="https://..." className="bg-card border-border" />
              </div>
              <div className="space-y-2">
                <Label>Tags (comma-separated)</Label>
                <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="react, internship" className="bg-card border-border" />
              </div>
              <Button type="submit" className="w-full rounded-lg" disabled={loading}>
                {loading ? "Posting…" : "Post"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">
          {opportunities.length === 0
            ? "No opportunities yet. Be the first to post one!"
            : "No opportunities match your filters."}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((o) => (
            <OpportunityCard key={o.id} opportunity={o} authorName={o.authorName} showViewDetails />
          ))}
        </div>
      )}
    </div>
  );
}
