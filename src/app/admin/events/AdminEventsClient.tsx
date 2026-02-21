"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DataCard } from "@/components/shared/DataCard";
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
    <div className="space-y-6">
      <DataCard
        title="Event requests"
        description="Review and approve or reject event submissions."
        action={
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px] border-border">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        }
      >
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">No events match.</p>
        ) : (
          <div className="space-y-4">
            {filtered.map((e) => (
              <Card key={e.id} className="border-border/50 bg-card/50 shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-4">
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
                  <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{e.description}</p>
                  {e.status === "pending" && (
                    <Button
                      size="sm"
                      className="bg-success hover:bg-success/90"
                      onClick={() => setSelected(e)}
                    >
                      Review
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DataCard>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg border-border bg-card">
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
                  className="border-border"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  className="bg-success hover:bg-success/90"
                  disabled={loading}
                  onClick={() => updateStatus(selected.id, "approved")}
                >
                  Approve
                </Button>
                <Button
                  variant="destructive"
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
