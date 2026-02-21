import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  className?: string;
}

/** Molecule: Single feature/role card with icon, title, description, link. */
export function FeatureCard({
  title,
  description,
  href,
  icon: Icon,
  className,
}: FeatureCardProps) {
  return (
    <Link href={href} className={cn("feature-card block h-full", className)}>
      <Card
        className={cn(
          "feature-card__card relative h-full border border-border bg-card shadow-sm",
          "transition-all hover:shadow-lg hover:border-accent/40 hover:-translate-y-0.5",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
        )}
      >
        <span className="feature-card__bullet absolute top-[-0.6rem] left-1/2 -translate-x-1/2 flex items-center justify-center w-6 h-6" aria-hidden>
          <Image src="/assets/icons/bullet-black.svg" alt="" width={10} height={10} className="w-full h-full object-contain" />
        </span>
        <CardHeader className="space-y-3 p-4 sm:p-6 pt-6">
          <div
            className="feature-card__icon w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent"
            aria-hidden
          >
            <Icon className="w-6 h-6 shrink-0" />
          </div>
          <CardTitle className="feature-card__title text-foreground text-lg">
            {title}
          </CardTitle>
          <CardDescription className="feature-card__description text-muted-foreground text-sm">
            {description}
          </CardDescription>
          <span className="text-sm font-medium text-accent hover:underline">
            Learn more →
          </span>
        </CardHeader>
      </Card>
    </Link>
  );
}
