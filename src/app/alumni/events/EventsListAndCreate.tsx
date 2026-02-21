"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { EventCard } from "@/components/shared/EventCard";
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
import type { Event } from "@/lib/types";
import { Plus } from "lucide-react";

type EventWithOrganizer = Event & { organizerName?: string | null };

const EVENT_TYPES = ["event", "opportunity", "survey", "workshop", "other"] as const;

export function EventsListAndCreate({ initialEvents }: { initialEvents: EventWithOrganizer[] }) {
  const [events, setEvents] = useState(initialEvents);
  const [rsvps, setRsvps] = useState<Record<string, string>>({});
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState<(typeof EVENT_TYPES)[number]>("event");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [isVirtual, setIsVirtual] = useState(false);
  const [virtualLink, setVirtualLink] = useState("");
  const [maxAttendees, setMaxAttendees] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("event_rsvps")
        .select("event_id, status")
        .eq("user_id", user.id);
      const map: Record<string, string> = {};
      (data ?? []).forEach((r) => (map[r.event_id] = r.status));
      setRsvps(map);
    })();
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const log = (msg: string, data?: unknown) => console.log("[Create event]", msg, data ?? "");
    setSubmitError(null);
    setLoading(true);
    log("Submit started");
    try {
      const { data: { user } } = await supabase.auth.getUser();
      log("getUser result", { userId: user?.id ?? null });
      if (!user) {
        setSubmitError("You must be signed in to create an event request.");
        return;
      }
      const dateTime = date && time ? `${date}T${time}:00` : date ? `${date}T12:00:00` : new Date().toISOString();
      const payload = {
        organizer_id: user.id,
        title: title.trim(),
        description: description.trim(),
        event_type: eventType,
        date: dateTime,
        location: location.trim() || null,
        is_virtual: isVirtual,
        virtual_link: isVirtual ? virtualLink.trim() || null : null,
        max_attendees: maxAttendees ? parseInt(maxAttendees, 10) : null,
        status: "pending",
      };
      log("Insert payload", payload);
      const { data: inserted, error } = await supabase
        .from("events")
        .insert(payload)
        .select()
        .single();

      log("Insert result", { inserted: !!inserted, error: error?.message ?? null, details: error ?? null });

      if (error) {
        setSubmitError(error.message || "Failed to submit event request.");
        return;
      }
      if (!inserted) {
        setSubmitError("Something went wrong. Please try again.");
        return;
      }
      setEvents([...events, { ...inserted, organizerName: undefined }]);
      setOpen(false);
      setTitle("");
      setDescription("");
      setEventType("event");
      setDate("");
      setTime("");
      setLocation("");
      setIsVirtual(false);
      setVirtualLink("");
      setMaxAttendees("");
      log("Success — dialog closed, list updated");
    } catch (err) {
      console.error("[Create event] Caught error", err);
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRsvp(eventId: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { error } = await supabase.from("event_rsvps").upsert(
        { event_id: eventId, user_id: user.id, status: "going" },
        { onConflict: "event_id,user_id" }
      );
      if (!error) setRsvps((prev) => ({ ...prev, [eventId]: "going" }));
    } catch (err) {
      console.error("[Event RSVP] Caught error", err);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-lg gap-2">
              <Plus className="h-4 w-4" /> Create event request
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto" onOpenAutoFocus={() => setSubmitError(null)}>
            <DialogHeader>
              <DialogTitle>Create event request</DialogTitle>
              <p className="text-sm text-muted-foreground">Events require admin approval.</p>
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
                <Select value={eventType} onValueChange={(v) => setEventType(v as (typeof EVENT_TYPES)[number])}>
                  <SelectTrigger className="bg-card border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-card border-border" />
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="bg-card border-border" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} className="bg-card border-border" />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={isVirtual} onCheckedChange={setIsVirtual} />
                <Label>Virtual event</Label>
              </div>
              {isVirtual && (
                <div className="space-y-2">
                  <Label>Virtual link</Label>
                  <Input value={virtualLink} onChange={(e) => setVirtualLink(e.target.value)} placeholder="https://..." className="bg-card border-border" />
                </div>
              )}
              <div className="space-y-2">
                <Label>Max attendees (optional)</Label>
                <Input type="number" min="1" value={maxAttendees} onChange={(e) => setMaxAttendees(e.target.value)} className="bg-card border-border" />
              </div>
              <Button type="submit" className="w-full rounded-lg" disabled={loading}>
                {loading ? "Submitting…" : "Submit for approval"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {events.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">No events yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => (
            <EventCard
              key={e.id}
              event={e}
              organizerName={e.organizerName}
              onRsvp={e.status === "approved" ? handleRsvp : undefined}
              rsvpStatus={rsvps[e.id]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
