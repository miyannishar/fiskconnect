import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  active?: boolean;
  variant?: "default" | "primary" | "ghost";
  onClick?: () => void;
}

/** Molecule: Single navigation link with consistent styling. */
export function NavLink({
  href,
  children,
  className,
  active,
  variant = "default",
  onClick,
}: NavLinkProps) {
  const base =
    "nav-link inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0";

  const variants = {
    default: "text-muted-foreground hover:text-foreground hover:bg-muted/50",
    primary:
      "text-primary bg-primary/10 hover:bg-primary/20 text-foreground font-semibold",
    ghost: "text-muted-foreground hover:text-foreground hover:bg-transparent",
  };

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        base,
        variants[variant],
        active && "text-secondary font-medium",
        className
      )}
    >
      {children}
    </Link>
  );
}
