"use client";

import { useEffect, useState } from "react";
import { SourcedAlumniCard } from "@/components/shared/SourcedAlumniCard";
import { AILoader } from "@/components/ui/ai-loader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { SourcedAlumni } from "@/lib/types";
import { Briefcase, ExternalLink, Mail, MessageCircle, Star } from "lucide-react";

const SOURCING_API_URL = process.env.NEXT_PUBLIC_SOURCING_API_URL || "";
const FAVORITE_ALUMNI_STORAGE_KEY = "fisk-student-favorite-alumni";

function loadFavoritesFromStorage(): SourcedAlumni[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FAVORITE_ALUMNI_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as SourcedAlumni[]) : [];
  } catch {
    return [];
  }
}

function saveFavoritesToStorage(list: SourcedAlumni[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(FAVORITE_ALUMNI_STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

/** Mock alumni email: firstLetter(firstName)-lastname+number@alum.fisk.edu */
function getMockEmail(alumni: SourcedAlumni): string {
  const parts = alumni.fullName.trim().split(/\s+/);
  const first = parts[0] ?? "alumni";
  const last = parts[parts.length - 1] ?? "user";
  const firstLetter = first.charAt(0).toLowerCase();
  const lastLower = last.toLowerCase().replace(/\W/g, "");
  const num = alumni.id ? parseInt(alumni.id.slice(-1), 16) % 10 || 1 : 1;
  return `${firstLetter}${lastLower}${num}@alum.fisk.edu`;
}

const SUGGESTED_PROMPTS = [
  "I really want to work as a law consultant",
  "I want to be a data analyst and I need some career advice",
  "I need help with my resume review.",
  "I am having hard time managing my finances and I need some help from my network.",
];

export function FindAlumniClient() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alumni, setAlumni] = useState<SourcedAlumni[]>([]);
  const [selectedAlumni, setSelectedAlumni] = useState<SourcedAlumni | null>(null);
  const [favoriteAlumni, setFavoriteAlumni] = useState<SourcedAlumni[]>([]);

  useEffect(() => {
    setFavoriteAlumni(loadFavoritesFromStorage());
  }, []);

  function addToFavorites(a: SourcedAlumni) {
    setFavoriteAlumni((prev) => {
      if (prev.some((x) => x.id === a.id)) return prev;
      const next = [...prev, a];
      saveFavoritesToStorage(next);
      return next;
    });
  }

  function removeFromFavorites(id: string) {
    setFavoriteAlumni((prev) => {
      const next = prev.filter((x) => x.id !== id);
      saveFavoritesToStorage(next);
      return next;
    });
  }

  function isFavorite(id: string) {
    return favoriteAlumni.some((x) => x.id === id);
  }

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
    <div className="find-alumni space-y-6 w-full max-w-4xl">
      <p className="find-alumni__intro text-base sm:text-lg text-muted-foreground leading-relaxed">
        Ask for the <strong>help</strong> you need—resume review, interview prep, career advice. We&apos;ll match you with alumni you can reach out to on LinkedIn.
      </p>

      {/* Favorite Alumni section */}
      {favoriteAlumni.length > 0 && (
        <section className="find-alumni__favorites space-y-3" aria-label="Favorite alumni">
          <h2 className="text-sm font-medium text-foreground">Favorite alumni</h2>
          <p className="text-xs text-muted-foreground">
            Alumni you&apos;ve saved from search. Click a card to view details or remove from favorites.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteAlumni.map((a) => (
              <SourcedAlumniCard
                key={a.id}
                alumni={a}
                onSelect={() => setSelectedAlumni(a)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Search card */}
      <div className="find-alumni__card rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6">
          <label htmlFor="find-alumni-query" className="block text-sm font-medium text-foreground mb-2">
            What kind of help are you looking for?
          </label>
          <textarea
            id="find-alumni-query"
            placeholder="e.g. I need help with my resume for a software engineering role at Microsoft or another big tech company"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="find-alumni__input min-h-[140px] sm:min-h-[120px] w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-y"
            disabled={!SOURCING_API_URL}
            aria-label="Describe the help you need"
          />
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
            Try a suggested prompt below or write your own.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setQuery(prompt)}
                disabled={!SOURCING_API_URL}
                className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1.5 text-xs sm:text-sm text-muted-foreground hover:bg-muted/60 hover:text-foreground hover:border-primary/30 transition-colors disabled:opacity-50 disabled:pointer-events-none"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
          <Button
            onClick={handleSearch}
            disabled={loading || !query.trim() || !SOURCING_API_URL}
            className="find-alumni__submit w-full sm:w-auto min-h-[48px] px-6 text-base"
          >
            {loading ? "Searching…" : "Find people who can help"}
          </Button>
        </div>
      </div>

      {loading && (
        <div className="find-alumni__loading rounded-2xl border border-border bg-muted/30 py-10 sm:py-12">
          <AILoader text="Finding alumni" size="large" />
        </div>
      )}
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
              <SourcedAlumniCard
                key={a.id}
                alumni={a}
                onSelect={() => setSelectedAlumni(a)}
              />
            ))}
          </div>
        </>
      )}

      {/* Alumni detail modal */}
      <Dialog open={!!selectedAlumni} onOpenChange={(open) => !open && setSelectedAlumni(null)}>
        <DialogContent className="bg-card border-border max-w-md max-h-[90vh] overflow-y-auto">
          {selectedAlumni && (
            <>
              <DialogHeader>
                <DialogTitle className="sr-only">{selectedAlumni.fullName}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-14 w-14 border border-border">
                    <AvatarImage src={selectedAlumni.photo || undefined} alt={selectedAlumni.fullName} />
                    <AvatarFallback className="bg-primary/20 text-primary text-lg">
                      {selectedAlumni.fullName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-foreground text-lg">{selectedAlumni.fullName}</h3>
                    {selectedAlumni.headline && (
                      <p className="text-sm text-muted-foreground mt-0.5">{selectedAlumni.headline}</p>
                    )}
                  </div>
                </div>
                {(selectedAlumni.currentTitle || selectedAlumni.currentCompany) && (
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Briefcase className="h-4 w-4 shrink-0" />
                    {[selectedAlumni.currentTitle, selectedAlumni.currentCompany].filter(Boolean).join(" @ ")}
                  </p>
                )}
                {selectedAlumni.location && (
                  <p className="text-sm text-muted-foreground">{selectedAlumni.location}</p>
                )}
                {selectedAlumni.aboutSnippet && (
                  <p className="text-sm text-muted-foreground">{selectedAlumni.aboutSnippet}</p>
                )}
                {(selectedAlumni.skills?.length ?? 0) > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedAlumni.skills!.map((s) => (
                      <Badge key={s} variant="outline" className="text-xs font-normal">
                        {s}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="pt-2 border-t border-border space-y-2">
                  <p className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="text-muted-foreground">Email:</span>
                    <a
                      href={`mailto:${getMockEmail(selectedAlumni)}`}
                      className="text-primary hover:underline truncate"
                    >
                      {getMockEmail(selectedAlumni)}
                    </a>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedAlumni.linkedinUrl && (
                      <Button size="sm" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10" asChild>
                        <a
                          href={selectedAlumni.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5"
                        >
                          LinkedIn <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                    )}
                    {isFavorite(selectedAlumni.id) ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="inline-flex items-center gap-1.5"
                        onClick={() => removeFromFavorites(selectedAlumni.id)}
                      >
                        <Star className="h-3.5 w-3.5 fill-current" />
                        Remove from favorites
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="inline-flex items-center gap-1.5"
                        onClick={() => addToFavorites(selectedAlumni)}
                      >
                        <Star className="h-3.5 w-3.5" />
                        Add to favorites
                      </Button>
                    )}
                    {/* TODO: implement chat — coming soon */}
                    <Button size="sm" variant="secondary" disabled className="inline-flex items-center gap-1.5" title="Coming soon">
                      <MessageCircle className="h-3.5 w-3.5" />
                      Chat (coming soon)
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
