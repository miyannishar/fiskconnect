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
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }
    const dateTime = date && time ? `${date}T${time}:00` : date ? `${date}T12:00:00` : new Date().toISOString();
    const { data: inserted, error } = await supabase
      .from("events")
      .insert({
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
      })
      .select()
      .single();

    if (!error && inserted) {
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
    }
    setLoading(false);
  }

  async function handleRsvp(eventId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("event_rsvps").upsert(
      { event_id: eventId, user_id: user.id, status: "going" },
      { onConflict: "event_id,user_id" }
    );
    setRsvps((prev) => ({ ...prev, [eventId]: "going" }));
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
          <DialogContent className="bg-card border-white/10 max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create event request</DialogTitle>
              <p className="text-sm text-muted-foreground">Events require admin approval.</p>
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
                <Select value={eventType} onValueChange={(v) => setEventType(v as (typeof EVENT_TYPES)[number])}>
                  <SelectTrigger className="bg-card border-white/10">
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
                  <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-card border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="bg-card border-white/10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} className="bg-card border-white/10" />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={isVirtual} onCheckedChange={setIsVirtual} />
                <Label>Virtual event</Label>
              </div>
              {isVirtual && (
                <div className="space-y-2">
                  <Label>Virtual link</Label>
                  <Input value={virtualLink} onChange={(e) => setVirtualLink(e.target.value)} placeholder="https://..." className="bg-card border-white/10" />
                </div>
              )}
              <div className="space-y-2">
                <Label>Max attendees (optional)</Label>
                <Input type="number" min="1" value={maxAttendees} onChange={(e) => setMaxAttendees(e.target.value)} className="bg-card border-white/10" />
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
