import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/0.15),transparent)]" />
      <div className="relative z-10 space-y-8 max-w-4xl">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground animate-in fade-in slide-in-from-bottom-4 duration-700">
          FiskConnect
        </h1>
        <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          Bridging Fisk Students, Alumni & Administration.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <Button asChild size="lg" className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8">
            <Link href="/signup">Sign Up</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-lg border-primary/50 text-primary hover:bg-primary/10 text-base px-8">
            <Link href="/login">Log In</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
