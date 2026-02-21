import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative min-h-[75vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden bg-gradient-to-b from-surface to-background">
      {/* Subtle blue accent – Fisk style */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,hsl(var(--fisk-royal)/0.08),transparent)]" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary/10 to-transparent" />
      <div className="relative z-10 space-y-8 max-w-4xl">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
          <span className="text-fisk-navy">FiskConnect</span> welcomes
        </h1>
        <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto">
          the class of 2029. Apply{" "}
          <span className="text-primary font-semibold">TODAY!</span>
        </p>
        <p className="text-base text-muted-foreground max-w-xl mx-auto">
          Bridging Fisk students, alumni & administration.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button
            asChild
            size="lg"
            className="rounded-lg bg-primary text-primary-foreground hover:opacity-90 text-base px-8 shadow-md"
          >
            <Link href="/signup">Sign up</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-lg border-fisk-navy/30 text-fisk-navy hover:bg-fisk-navy/10 text-base px-8"
          >
            <Link href="/login">Log in</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
