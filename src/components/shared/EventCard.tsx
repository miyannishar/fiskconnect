import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Event } from "@/lib/types";
import { cn } from "@/lib/utils";
import { MapPin, Video } from "lucide-react";

interface EventCardProps {
  event: Event;
  organizerName?: string | null;
  onRsvp?: (eventId: string) => void;
  rsvpStatus?: string | null;
  className?: string;
}

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  approved: "default",
  rejected: "destructive",
};

const typeLabels: Record<string, string> = {
  event: "Event",
  opportunity: "Opportunity",
  survey: "Survey",
  workshop: "Workshop",
  other: "Other",
};

export function EventCard({
  event,
  organizerName,
  onRsvp,
  rsvpStatus,
  className,
}: EventCardProps) {
  const date = new Date(event.date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <Card className={cn("border-border/50 bg-card shadow-sm transition-shadow hover:shadow-md hover:border-primary/20", className)}>
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="bg-primary/20 text-primary">
            {typeLabels[event.event_type] ?? event.event_type}
          </Badge>
          <Badge variant={statusVariant[event.status] ?? "outline"}>
            {event.status === "pending" && "Pending Approval"}
            {event.status === "approved" && "Approved"}
            {event.status === "rejected" && "Rejected"}
          </Badge>
          {event.is_virtual && (
            <Badge variant="outline" className="border-white/20 gap-1">
              <Video className="h-3 w-3" /> Virtual
            </Badge>
          )}
        </div>
        <CardTitle className="text-foreground text-lg">{event.title}</CardTitle>
        <CardDescription>
          {organizerName && <span>By {organizerName}</span>}
          <span className="mx-1">·</span>
          <span>{date}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
        {event.location && (
          <p className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
            <MapPin className="h-3 w-3" /> {event.location}
          </p>
        )}
      </CardContent>
      {event.status === "approved" && onRsvp && (
        <CardFooter className="pt-2">
          <Button
            size="sm"
            className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => onRsvp(event.id)}
          >
            {rsvpStatus === "going" ? "You're going" : rsvpStatus === "interested" ? "Interested" : "RSVP"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
