"use client";

import Link from "next/link";
import {
  GraduationCap,
  Users,
  Shield,
  Megaphone,
  FileCheck,
  Trophy,
} from "lucide-react";

const features = [
  {
    title: "Students",
    description: "Find mentors, discover opportunities, and connect with alumni who've been there.",
    icon: GraduationCap,
    href: "/login",
  },
  {
    title: "Alumni",
    description: "Give back — post opportunities, mentor students, and stay connected.",
    icon: Users,
    href: "/login",
  },
  {
    title: "Administration",
    description: "Orchestrate connections, manage announcements, and oversee the community.",
    icon: Shield,
    href: "/login",
  },
];

const quickLinks = [
  { label: "Events", icon: Megaphone },
  { label: "Alumni", icon: Users },
  { label: "Academics", icon: FileCheck },
  { label: "Apply", icon: GraduationCap },
  { label: "Athletics", icon: Trophy },
];

/** How it works – dayos-style container, grid, and cards; last section before footer. */
export function FeaturesSection() {
  return (
    <section
      className="features bg-background"
      aria-labelledby="features-heading"
    >
      <div className="dayos-container py-12 sm:py-16 md:py-20">
        <h2
          id="features-heading"
          className="font-condensed text-[2.75rem] sm:text-[3.5rem] md:text-[5rem] font-bold uppercase tracking-tight text-secondary"
        >
          How it works
        </h2>
        <p className="mt-4 text-[1.6rem] text-muted-foreground max-w-2xl">
          Three roles, one community. Your Fisk email determines your experience.
        </p>

        <div className="dayos-grid mt-10">
          {features.map((f) => (
            <Link
              key={f.title}
              href={f.href}
              className="dayos-carousel-card group"
            >
              <div className="dayos-carousel-card__image flex items-center justify-center bg-muted/50">
                <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary/20 transition-colors">
                  <f.icon className="w-7 h-7 shrink-0" />
                </div>
              </div>
              <div className="dayos-carousel-card__details">
                <h3 className="font-condensed font-bold text-lg uppercase text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
                <span className="mt-4 inline-flex text-sm font-medium text-secondary hover:underline">Learn more →</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {quickLinks.map((q) => (
            <button
              key={q.label}
              type="button"
              className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-border bg-card hover:bg-muted/50 hover:border-secondary/30 transition-colors min-h-[5rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center text-secondary">
                <q.icon className="w-5 h-5 shrink-0" />
              </div>
              <span className="text-sm font-medium text-foreground">{q.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
