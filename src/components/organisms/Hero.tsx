import Link from "next/link";
import { Button } from "@/components/ui/button";

/** Organism: Landing hero section – headline, subtext, CTAs. */
export function Hero() {
  return (
    <section
      className="hero relative min-h-[70vh] sm:min-h-[75vh] flex flex-col items-center justify-center text-center px-4 py-12 sm:py-16 overflow-hidden bg-gradient-to-b from-surface to-background"
      aria-label="Welcome"
    >
      <div
        className="hero__bg-accent absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,hsl(var(--fisk-royal)/0.08),transparent)] pointer-events-none"
        aria-hidden
      />
      <div
        className="hero__bg-bottom absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none"
        aria-hidden
      />

      <div className="hero__content relative z-10 space-y-6 sm:space-y-8 max-w-4xl">
        <h1 className="hero__title text-3xl min-[480px]:text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
          <span className="text-secondary">FiskConnect</span> welcomes
        </h1>
        <p className="hero__subtitle text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          the class of 2029. Apply{" "}
          <span className="text-primary font-semibold">TODAY!</span>
        </p>
        <p className="hero__tagline text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
          Bridging Fisk students, alumni & administration.
        </p>
        <div className="hero__actions flex flex-col min-[480px]:flex-row gap-3 sm:gap-4 justify-center pt-2 sm:pt-4">
          <Button
            asChild
            size="lg"
            className="hero__cta-primary rounded-lg bg-primary text-primary-foreground hover:opacity-90 text-base px-6 sm:px-8 shadow-md min-h-[48px] sm:min-h-0"
          >
            <Link href="/signup">Sign up</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="hero__cta-secondary rounded-lg border-secondary/30 text-secondary hover:bg-secondary/10 text-base px-6 sm:px-8 min-h-[48px] sm:min-h-0"
          >
            <Link href="/login">Log in</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
