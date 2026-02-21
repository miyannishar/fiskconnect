"use client";

import {
  GraduationCap,
  Users,
  Shield,
  Megaphone,
  FileCheck,
  Trophy,
} from "lucide-react";
import { FeatureCard } from "@/components/molecules/FeatureCard";

const features = [
  {
    title: "Students",
    description:
      "Find mentors, discover opportunities, and connect with alumni who've been there.",
    icon: GraduationCap,
    href: "/login",
  },
  {
    title: "Alumni",
    description:
      "Give back — post opportunities, mentor students, and stay connected.",
    icon: Users,
    href: "/login",
  },
  {
    title: "Administration",
    description:
      "Orchestrate connections, manage announcements, and oversee the community.",
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

const stats = [
  { value: "500+", label: "Alumni Connected" },
  { value: "120", label: "Opportunities Posted" },
  { value: "50", label: "Mentorships Formed" },
];

/** Organism: How it works – feature cards, quick links, stats. */
export function FeaturesSection() {
  return (
    <section
      className="features py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-background"
      aria-labelledby="features-heading"
    >
      <div className="features__inner max-w-6xl mx-auto">
        <h2
          id="features-heading"
          className="features__title text-2xl sm:text-3xl font-bold text-center text-secondary mb-2"
        >
          How it works
        </h2>
        <p className="features__description text-muted-foreground text-center max-w-2xl mx-auto mb-10 sm:mb-14 text-sm sm:text-base">
          Three roles, one community. Your Fisk email determines your experience.
        </p>

        <div className="features__grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-14 sm:mb-20">
          {features.map((f) => (
            <FeatureCard
              key={f.title}
              title={f.title}
              description={f.description}
              href={f.href}
              icon={f.icon}
            />
          ))}
        </div>

        <div className="features__quick-links grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 mb-14 sm:mb-20">
          {quickLinks.map((q) => (
            <button
              key={q.label}
              type="button"
              className="features__quick-link flex flex-col items-center gap-2 p-4 sm:p-5 rounded-xl border border-border bg-card hover:bg-secondary/5 hover:border-secondary/30 transition-colors group min-h-[100px] sm:min-h-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/15 flex items-center justify-center text-secondary group-hover:bg-primary/25 transition-colors">
                <q.icon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-foreground">
                {q.label}
              </span>
            </button>
          ))}
        </div>

        <div className="features__stats grid grid-cols-3 gap-4 sm:gap-6 text-center pt-8 border-t border-border">
          {stats.map((s) => (
            <div key={s.label} className="features__stat">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary">
                {s.value}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
