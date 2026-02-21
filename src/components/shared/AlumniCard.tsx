import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Profile } from "@/lib/types";
import { cn } from "@/lib/utils";
import { GraduationCap, Briefcase } from "lucide-react";

interface AlumniCardProps {
  alumni: Profile;
  onConnect?: (alumni: Profile) => void;
  className?: string;
}

export function AlumniCard({ alumni, onConnect, className }: AlumniCardProps) {
  const skills = (alumni.skills ?? []).slice(0, 5);
  const graduationYear = alumni.graduation_year ? `Class of ${alumni.graduation_year}` : null;

  return (
    <Card className={cn("border-border/50 bg-card shadow-sm transition-shadow hover:shadow-md hover:border-primary/20", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={alumni.avatar_url ?? undefined} alt={alumni.full_name ?? alumni.email} />
            <AvatarFallback className="bg-primary/20 text-primary">
              {(alumni.full_name ?? alumni.email).slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{alumni.full_name ?? alumni.email}</h3>
            {graduationYear && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <GraduationCap className="h-3 w-3 shrink-0" /> {graduationYear}
              </p>
            )}
          </div>
          {alumni.open_to_mentor && (
            <Badge variant="secondary" className="bg-success/20 text-success shrink-0 text-xs">
              Open to Mentoring
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {(alumni.current_title || alumni.current_company) && (
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Briefcase className="h-3.5 w-3.5 shrink-0" />
            {[alumni.current_title, alumni.current_company].filter(Boolean).join(" @ ")}
          </p>
        )}
        {alumni.major && (
          <p className="text-xs text-muted-foreground">Major: {alumni.major}</p>
        )}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {skills.map((s) => (
              <Badge key={s} variant="outline" className="text-xs border-white/20 font-normal">
                {s}
              </Badge>
            ))}
          </div>
        )}
        {onConnect && (
          <Button
            size="sm"
            variant="outline"
            className="mt-2 w-full rounded-lg border-primary/30 text-primary hover:bg-primary/10"
            onClick={() => onConnect(alumni)}
          >
            Connect
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
