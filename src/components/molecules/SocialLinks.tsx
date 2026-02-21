import { cn } from "@/lib/utils";

export interface SocialItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface SocialLinksProps {
  items: SocialItem[];
  className?: string;
}

/** Molecule: Row of social icon links with accessible labels. */
export function SocialLinks({ items, className }: SocialLinksProps) {
  return (
    <div
      className={cn(
        "social-links flex flex-wrap items-center justify-center gap-3 sm:gap-4",
        className
      )}
      role="list"
    >
      {items.map((item) => (
        <a
          key={item.label}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "social-links__item text-accent hover:opacity-80 transition-opacity",
            "min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-md",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
          aria-label={item.label}
        >
          {item.icon}
        </a>
      ))}
    </div>
  );
}
