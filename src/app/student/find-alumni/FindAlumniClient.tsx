"use client";

import { useState } from "react";
import { SourcedAlumniCard } from "@/components/shared/SourcedAlumniCard";
import { Button } from "@/components/ui/button";
import type { SourcedAlumni } from "@/lib/types";

const SOURCING_API_URL = process.env.NEXT_PUBLIC_SOURCING_API_URL || "";

export function FindAlumniClient() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alumni, setAlumni] = useState<SourcedAlumni[]>([]);

  async function handleSearch() {
    if (!query.trim() || !SOURCING_API_URL) {
      setError(SOURCING_API_URL ? "Describe the help you need." : "Search is not configured.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${SOURCING_API_URL}/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || res.statusText || "Search failed");
      }
      const data = await res.json();
      setAlumni((data.alumni || []) as SourcedAlumni[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Search failed");
      setAlumni([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="find-alumni space-y-4 w-full max-w-4xl">
      <p className="find-alumni__intro text-sm sm:text-base text-muted-foreground">
        Ask for the <strong>help</strong> you need—e.g. resume for Microsoft or big tech, interview prep, career advice. We&apos;ll find alumni who match and show their cards so you can reach out on LinkedIn.
      </p>
      <div className="find-alumni__form flex flex-col gap-3 sm:gap-4">
        <textarea
          placeholder="e.g. I need help with my resume for a software engineering role at Microsoft or another big tech company"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="find-alumni__input min-h-[120px] sm:min-h-[100px] w-full rounded-lg border border-border bg-card px-3 py-3 sm:py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          disabled={!SOURCING_API_URL}
          aria-label="Describe the help you need"
        />
        <Button
          onClick={handleSearch}
          disabled={loading || !query.trim() || !SOURCING_API_URL}
          className="find-alumni__submit w-full sm:w-auto min-h-[48px] sm:min-h-0"
        >
          {loading ? "Finding people who can help…" : "Find people who can help"}
        </Button>
      </div>
      {error && (
        <p className="find-alumni__error text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      {!SOURCING_API_URL && (
        <p className="text-sm text-muted-foreground">
          Set NEXT_PUBLIC_SOURCING_API_URL to use help search.
        </p>
      )}
      {alumni.length === 0 && !loading && !error && SOURCING_API_URL && query.trim() && (
        <p className="find-alumni__empty py-8 text-center text-muted-foreground text-sm sm:text-base">
          No matching alumni yet. Try describing the help you need above.
        </p>
      )}
      {alumni.length > 0 && (
        <>
          <p className="find-alumni__results-label text-sm text-muted-foreground">
            Alumni who may be able to help—reach out via LinkedIn.
          </p>
          <div className="find-alumni__grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {alumni.map((a) => (
              <SourcedAlumniCard key={a.id} alumni={a} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
