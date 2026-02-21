"use client";

import { useState, useMemo } from "react";
import { OpportunityCard } from "@/components/shared/OpportunityCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Opportunity } from "@/lib/types";

type OpportunityWithAuthor = Opportunity & { authorName?: string | null };

const TYPES = ["internship", "job", "research", "volunteer", "project", "other"] as const;

export function StudentOpportunitiesClient({
  initialOpportunities,
}: {
  initialOpportunities: OpportunityWithAuthor[];
}) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState("");

  const filtered = useMemo(() => {
    return initialOpportunities.filter((o) => {
      const matchSearch =
        !search ||
        o.title.toLowerCase().includes(search.toLowerCase()) ||
        (o.description?.toLowerCase().includes(search.toLowerCase())) ||
        (o.company?.toLowerCase().includes(search.toLowerCase()));
      const matchType = typeFilter === "all" || o.type === typeFilter;
      const matchLocation =
        !locationFilter ||
        (o.location?.toLowerCase().includes(locationFilter.toLowerCase()));
      return matchSearch && matchType && matchLocation;
    });
  }, [initialOpportunities, search, typeFilter, locationFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          placeholder="Search by keyword..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-card border-white/10 max-w-xs"
        />
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px] bg-card border-white/10">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder="Location"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="bg-card border-white/10 max-w-xs"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">
          No opportunities match your filters.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((o) => (
            <OpportunityCard key={o.id} opportunity={o} authorName={o.authorName} showViewDetails />
          ))}
        </div>
      )}
    </div>
  );
}
