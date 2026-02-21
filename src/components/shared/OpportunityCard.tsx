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
import type { Opportunity } from "@/lib/types";
import { cn } from "@/lib/utils";
import { MapPin, Building2, ExternalLink } from "lucide-react";

interface OpportunityCardProps {
  opportunity: Opportunity;
  authorName?: string | null;
  showViewDetails?: boolean;
  className?: string;
}

const typeLabels: Record<string, string> = {
  internship: "Internship",
  job: "Job",
  research: "Research",
  volunteer: "Volunteer",
  project: "Project",
  other: "Other",
};

export function OpportunityCard({
  opportunity,
  authorName,
  showViewDetails = true,
  className,
}: OpportunityCardProps) {
  const date = opportunity.created_at
    ? new Date(opportunity.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <Card className={cn("border-border/50 bg-card shadow-sm transition-shadow hover:shadow-md hover:border-primary/20", className)}>
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="bg-primary/20 text-primary">
            {typeLabels[opportunity.type] ?? opportunity.type}
          </Badge>
          {opportunity.is_remote && (
            <Badge variant="outline" className="border-white/20">
              Remote
            </Badge>
          )}
        </div>
        <CardTitle className="text-foreground text-lg">{opportunity.title}</CardTitle>
        {(opportunity.company || opportunity.location) && (
          <CardDescription className="flex flex-wrap items-center gap-3 text-sm">
            {opportunity.company && (
              <span className="flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" />
                {opportunity.company}
              </span>
            )}
            {opportunity.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {opportunity.location}
              </span>
            )}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground line-clamp-2">{opportunity.description}</p>
        {authorName && (
          <p className="text-xs text-muted-foreground mt-2">Posted by {authorName}</p>
        )}
        <p className="text-xs text-muted-foreground">{date}</p>
      </CardContent>
      {showViewDetails && (
        <CardFooter className="pt-2">
          {opportunity.link ? (
            <Button asChild variant="outline" size="sm" className="rounded-lg border-white/20">
              <a href={opportunity.link} target="_blank" rel="noopener noreferrer">
                Apply <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="rounded-lg border-white/20" asChild>
              <span>View Details</span>
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}

// CardTitle is used but not in the card export - it's from Card. Checking - we have CardTitle in card.tsx. I need to add the import.