"use client";

import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GraduationCap, Users, Shield, Megaphone, FileCheck, Trophy } from "lucide-react";

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

const stats = [
  { value: "500+", label: "Alumni Connected" },
  { value: "120", label: "Opportunities Posted" },
  { value: "50", label: "Mentorships Formed" },
];

export function Features() {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-fisk-navy mb-2">
          How it works
        </h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-14">
          Three roles, one community. Your Fisk email determines your experience.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {features.map((f) => (
            <Link key={f.title} href={f.href}>
              <Card className="h-full border border-border bg-card shadow-sm transition-all hover:shadow-lg hover:border-fisk-royal/40 hover:-translate-y-0.5">
                <CardHeader className="space-y-3">
                  <div className="w-12 h-12 rounded-lg bg-fisk-royal/10 flex items-center justify-center text-fisk-royal">
                    <f.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-foreground text-lg">{f.title}</CardTitle>
                  <CardDescription className="text-muted-foreground text-sm">
                    {f.description}
                  </CardDescription>
                  <span className="text-sm font-medium text-fisk-royal hover:underline">
                    Learn more →
                  </span>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        {/* Interactive icon strip – Fisk style */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-20">
          {quickLinks.map((q) => (
            <button
              key={q.label}
              type="button"
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card hover:bg-fisk-navy/5 hover:border-fisk-navy/30 transition-colors group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/15 flex items-center justify-center text-fisk-navy group-hover:bg-primary/25 transition-colors">
                <q.icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-foreground">{q.label}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6 text-center pt-8 border-t border-border">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-3xl sm:text-4xl font-bold text-fisk-navy">
                {s.value}
              </div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
