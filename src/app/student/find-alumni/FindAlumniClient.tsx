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
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Ask for the <strong>help</strong> you need—e.g. resume for Microsoft or big tech, interview prep, career advice. We&apos;ll find alumni who match and show their cards so you can reach out on LinkedIn.
      </p>
      <div className="flex flex-col gap-2">
        <textarea
          placeholder="e.g. I need help with my resume for a software engineering role at Microsoft or another big tech company"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-h-[100px] w-full max-w-xl rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={!SOURCING_API_URL}
        />
        <Button
          onClick={handleSearch}
          disabled={loading || !query.trim() || !SOURCING_API_URL}
        >
          {loading ? "Finding people who can help…" : "Find people who can help"}
        </Button>
      </div>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      {!SOURCING_API_URL && (
        <p className="text-sm text-muted-foreground">
          Set NEXT_PUBLIC_SOURCING_API_URL to use help search.
        </p>
      )}
      {alumni.length === 0 && !loading && !error && SOURCING_API_URL && query.trim() && (
        <p className="py-8 text-center text-muted-foreground">No matching alumni yet. Try describing the help you need above.</p>
      )}
      {alumni.length > 0 && (
        <>
          <p className="text-sm text-muted-foreground">
            Alumni who may be able to help—reach out via LinkedIn.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {alumni.map((a) => (
              <SourcedAlumniCard key={a.id} alumni={a} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
