"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDateTime } from "@/lib/utils";
import type { Event } from "@/lib/types";

type EventWithOrganizer = Event & { organizerName?: string | null };

export function AdminEventsClient({ initialEvents }: { initialEvents: EventWithOrganizer[] }) {
  const [events, setEvents] = useState(initialEvents);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selected, setSelected] = useState<EventWithOrganizer | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const filtered = events.filter(
    (e) => statusFilter === "all" || e.status === statusFilter
  );

  async function updateStatus(eventId: string, status: "approved" | "rejected") {
    setLoading(true);
    await supabase
      .from("events")
      .update({ status, admin_notes: adminNotes || null })
      .eq("id", eventId);
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, status, admin_notes: adminNotes || null } : e))
    );
    setSelected(null);
    setAdminNotes("");
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] bg-card border-white/10">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground">No events match.</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((e) => (
            <Card key={e.id} className="bg-card border-white/10">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{e.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      By {e.organizerName ?? "Unknown"} · {formatDateTime(e.date)}
                    </p>
                  </div>
                  <Badge
                    variant={
                      e.status === "approved"
                        ? "default"
                        : e.status === "rejected"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {e.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{e.description}</p>
                {e.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="rounded-lg bg-success hover:bg-success/90"
                      onClick={() => setSelected(e)}
                    >
                      Review
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="bg-card border-white/10 max-w-lg">
          <DialogHeader>
            <DialogTitle>{selected?.title}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{selected.description}</p>
              <p className="text-xs text-muted-foreground">
                Organizer: {selected.organizerName} · {formatDateTime(selected.date)}
                {selected.location && ` · ${selected.location}`}
              </p>
              <div className="space-y-2">
                <Label>Admin notes (optional)</Label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Notes for the organizer..."
                  className="bg-card border-white/10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  className="rounded-lg bg-success hover:bg-success/90"
                  disabled={loading}
                  onClick={() => updateStatus(selected.id, "approved")}
                >
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  className="rounded-lg"
                  disabled={loading}
                  onClick={() => updateStatus(selected.id, "rejected")}
                >
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
