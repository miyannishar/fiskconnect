"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Molecule: Dayos-style heading with line-by-line slide-up animation. */
export function HeroHeadingLines({
  lines,
  className,
  mutedIndices = [],
}: {
  lines: string[];
  className?: string;
  /** Line indices to render smaller and muted (e.g. [0] for "FiskConnect"). */
  mutedIndices?: number[];
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <h1
      className={cn(
        "hero-heading-lines font-condensed text-foreground uppercase font-bold tracking-tight",
        "text-[4rem] leading-[0.9] sm:text-[5rem] md:text-[6.5rem] lg:text-[7.5rem] md:leading-[0.9] tracking-[-0.03em]",
        className
      )}
    >
      {lines.map((line, i) => {
        const isMuted = mutedIndices.includes(i);
        return (
          <span
            key={i}
            className="hero-heading-lines__line-wrap block w-fit mx-auto overflow-hidden"
          >
            <span
              className={cn(
                "hero-heading-lines__line block whitespace-nowrap",
                isMuted && "text-muted-foreground font-semibold text-[2.25rem] sm:text-[2.75rem] md:text-[3.25rem] lg:text-[3.75rem]",
                mounted && "hero-heading-lines__line--animate"
              )}
              style={mounted ? { animationDelay: `${i * 0.1}s` } : undefined}
            >
              {line}
            </span>
          </span>
        );
      })}
    </h1>
  );
}
