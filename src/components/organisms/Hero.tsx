"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroHeadingLines } from "@/components/molecules/HeroHeadingLines";
import { BackgroundPaths } from "@/components/ui/background-paths";

/** Hero: centered text, line-by-line heading animation, desc, CTAs. */
const HERO_LINES = [
  "FiskConnect",
  "Activating the",
  "Bulldog Network.",
];

const HERO_DESC =
  "Connecting mentorship, Fisk and Bulldog impact. To opportunity. One platform. One network.";

export function Hero() {
  return (
    <section
      className="hero-home relative w-full flex flex-col items-center justify-center bg-[hsl(var(--muted))] text-foreground overflow-x-clip pt-[calc(var(--nav-height,4rem)+2rem)] sm:pt-[calc(var(--nav-height,4rem)+3.2rem)] pb-6 sm:pb-8 md:pb-12 aspect-[1440/800] max-md:aspect-auto max-md:pb-0 mb-[-1px] min-h-[50vh] sm:min-h-[60vh]"
      aria-label="Welcome"
    >
      <div className="absolute inset-0 pointer-events-none opacity-[0.4]">
        <BackgroundPaths />
      </div>
      <div className="hero-home__container relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col items-center text-center">
        <div className="hero-home__content flex flex-col items-center text-center">
          <HeroHeadingLines lines={HERO_LINES} className="text-center" mutedIndices={[0]} />
          <p className="hero-home__desc mt-4 sm:mt-6 md:mt-8 text-[1.25rem] leading-[1.4] sm:text-[1.9rem] sm:leading-[1.35] md:text-[2.2rem] md:leading-[1.25] text-muted-foreground max-w-xl text-center px-1">
            {HERO_DESC}
          </p>
        </div>

        <div className="hero-home__actions mt-4 sm:mt-6 md:mt-8 flex flex-wrap gap-2 sm:gap-3 justify-center">
          <Button
            asChild
            size="lg"
            className="rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold px-6 h-12 text-base"
          >
            <Link href="/signup">Get started</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-md border-2 border-foreground/20 text-foreground hover:bg-foreground/5 font-medium px-6 h-12 text-base"
          >
            <Link href="/login">Log in</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
