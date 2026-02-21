"use client";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { SourcedAlumni } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Briefcase, ExternalLink } from "lucide-react";

interface SourcedAlumniCardProps {
  alumni: SourcedAlumni;
  className?: string;
}

export function SourcedAlumniCard({ alumni, className }: SourcedAlumniCardProps) {
  const skills = (alumni.skills ?? []).slice(0, 5);

  return (
    <Card
      className={cn(
        "border-border/50 bg-card shadow-sm transition-shadow hover:shadow-md hover:border-primary/20",
        className
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12 border border-border">
            <AvatarImage src={alumni.photo || undefined} alt={alumni.fullName} />
            <AvatarFallback className="bg-primary/20 text-primary">
              {alumni.fullName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-foreground">{alumni.fullName}</h3>
            {alumni.headline && (
              <p className="line-clamp-2 text-xs text-muted-foreground">{alumni.headline}</p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {(alumni.currentTitle || alumni.currentCompany) && (
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <Briefcase className="h-3.5 w-3.5 shrink-0" />
            {[alumni.currentTitle, alumni.currentCompany].filter(Boolean).join(" @ ")}
          </p>
        )}
        {alumni.location && (
          <p className="text-xs text-muted-foreground">{alumni.location}</p>
        )}
        {alumni.aboutSnippet && (
          <p className="line-clamp-2 text-xs text-muted-foreground">{alumni.aboutSnippet}</p>
        )}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {skills.map((s) => (
              <Badge
                key={s}
                variant="outline"
                className="border-white/20 text-xs font-normal"
              >
                {s}
              </Badge>
            ))}
          </div>
        )}
        {alumni.linkedinUrl && (
          <Button
            size="sm"
            variant="outline"
            className="mt-2 w-full border-primary/30 text-primary hover:bg-primary/10"
            asChild
          >
            <a
              href={alumni.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1"
            >
              View on LinkedIn <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
