import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GraduationCap, Users, Shield } from "lucide-react";

const features = [
  {
    title: "Students",
    description: "Find mentors, discover opportunities, and connect with alumni who've been there.",
    icon: GraduationCap,
    color: "text-primary",
  },
  {
    title: "Alumni",
    description: "Give back effortlessly — post opportunities, mentor students, and stay connected.",
    icon: Users,
    color: "text-primary",
  },
  {
    title: "Administration",
    description: "Orchestrate connections, manage announcements, and oversee the community.",
    icon: Shield,
    color: "text-primary",
  },
];

const stats = [
  { value: "500+", label: "Alumni Connected" },
  { value: "120", label: "Opportunities Posted" },
  { value: "50", label: "Mentorships Formed" },
];

export function Features() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-foreground mb-4">
          How It Works
        </h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16">
          Three roles, one community. Your Fisk email determines your experience.
        </p>
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {features.map((f) => (
            <Card
              key={f.title}
              className="bg-card border-white/10 rounded-xl hover:border-primary/30 transition-colors"
            >
              <CardHeader>
                <div
                  className={`w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2 ${f.color}`}
                >
                  <f.icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-foreground">{f.title}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {f.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-3xl sm:text-4xl font-bold text-primary">
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
