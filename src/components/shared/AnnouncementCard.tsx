import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Announcement } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Pin } from "lucide-react";

interface AnnouncementCardProps {
  announcement: Announcement;
  authorName?: string | null;
  className?: string;
}

export function AnnouncementCard({
  announcement,
  authorName,
  className,
}: AnnouncementCardProps) {
  const date = new Date(announcement.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card className={cn("border-border/50 bg-card shadow-sm transition-shadow hover:shadow-md hover:border-primary/20", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-foreground text-lg">{announcement.title}</CardTitle>
          {announcement.pinned && (
            <Badge variant="secondary" className="bg-primary/20 text-primary gap-1">
              <Pin className="h-3 w-3" /> Pinned
            </Badge>
          )}
        </div>
        <CardDescription>
          {authorName && <span>By {authorName}</span>}
          <span className="mx-1">·</span>
          <span>{date}</span>
          <span className="mx-1">·</span>
          <span className="capitalize">{announcement.audience}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{announcement.content}</p>
      </CardContent>
    </Card>
  );
}
