"use client";

import { useState, useMemo } from "react";
import { AlumniCard } from "@/components/shared/AlumniCard";
import { Input } from "@/components/ui/input";
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { Profile } from "@/lib/types";

const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Government",
  "Nonprofit",
  "Consulting",
  "Media",
  "Other",
];

export function FindAlumniClient({ initialAlumni }: { initialAlumni: Profile[] }) {
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("all");
  const [locationFilter, setLocationFilter] = useState("");
  const [openToMentorOnly, setOpenToMentorOnly] = useState(false);
  const [gradYearFrom, setGradYearFrom] = useState("");
  const [gradYearTo, setGradYearTo] = useState("");
  const [connectModalAlumni, setConnectModalAlumni] = useState<Profile | null>(null);

  const filtered = useMemo(() => {
    return initialAlumni.filter((a) => {
      const searchLower = search.toLowerCase();
      const matchSearch =
        !search ||
        (a.full_name?.toLowerCase().includes(searchLower)) ||
        (a.email?.toLowerCase().includes(searchLower)) ||
        (a.current_company?.toLowerCase().includes(searchLower)) ||
        (a.current_title?.toLowerCase().includes(searchLower)) ||
        (a.major?.toLowerCase().includes(searchLower)) ||
        (a.skills?.some((s) => s.toLowerCase().includes(searchLower)));
      const matchIndustry = industry === "all" || a.industry === industry;
      const matchLocation =
        !locationFilter ||
        (a.location?.toLowerCase().includes(locationFilter.toLowerCase()));
      const matchMentor = !openToMentorOnly || a.open_to_mentor;
      const matchYearFrom = !gradYearFrom || (a.graduation_year != null && a.graduation_year >= parseInt(gradYearFrom, 10));
      const matchYearTo = !gradYearTo || (a.graduation_year != null && a.graduation_year <= parseInt(gradYearTo, 10));
      return matchSearch && matchIndustry && matchLocation && matchMentor && matchYearFrom && matchYearTo;
    });
  }, [initialAlumni, search, industry, locationFilter, openToMentorOnly, gradYearFrom, gradYearTo]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <Input
          placeholder="Search by name, company, title, skills, major..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-card border-white/10 max-w-md"
        />
        <div className="flex flex-wrap items-center gap-4">
          <Select value={industry} onValueChange={setIndustry}>
            <SelectTrigger className="w-[160px] bg-card border-white/10">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All industries</SelectItem>
              {INDUSTRIES.map((i) => (
                <SelectItem key={i} value={i}>
                  {i}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Location"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-[160px] bg-card border-white/10"
          />
          <div className="flex items-center gap-2">
            <Switch
              id="mentor"
              checked={openToMentorOnly}
              onCheckedChange={setOpenToMentorOnly}
            />
            <Label htmlFor="mentor">Open to mentoring only</Label>
          </div>
          <Input
            type="number"
            placeholder="Grad year from"
            value={gradYearFrom}
            onChange={(e) => setGradYearFrom(e.target.value)}
            className="w-[120px] bg-card border-white/10"
          />
          <Input
            type="number"
            placeholder="Grad year to"
            value={gradYearTo}
            onChange={(e) => setGradYearTo(e.target.value)}
            className="w-[120px] bg-card border-white/10"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">No alumni match your filters.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => (
            <AlumniCard
              key={a.id}
              alumni={a}
              onConnect={(alumni) => setConnectModalAlumni(alumni)}
            />
          ))}
        </div>
      )}

      <Dialog open={!!connectModalAlumni} onOpenChange={() => setConnectModalAlumni(null)}>
        <DialogContent className="bg-card border-white/10">
          <DialogHeader>
            <DialogTitle>Connect with {connectModalAlumni?.full_name ?? "Alumni"}</DialogTitle>
          </DialogHeader>
          {connectModalAlumni && (
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">Reach out via email or LinkedIn:</p>
              <p>
                <strong>Email:</strong>{" "}
                <a href={`mailto:${connectModalAlumni.email}`} className="text-primary hover:underline">
                  {connectModalAlumni.email}
                </a>
              </p>
              {connectModalAlumni.linkedin_url && (
                <p>
                  <strong>LinkedIn:</strong>{" "}
                  <a
                    href={connectModalAlumni.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {connectModalAlumni.linkedin_url}
                  </a>
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
