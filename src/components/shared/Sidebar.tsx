"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface NavItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
}

interface SidebarProps {
  navItems: NavItem[];
  brandHref?: string;
  brandLabel?: string;
  className?: string;
}

export function Sidebar({
  navItems,
  brandHref = "/",
  brandLabel = "FiskConnect",
  className,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "app-sidebar fixed left-0 top-0 z-40 flex h-screen w-60 flex-col border-r border-border bg-card shadow-sm",
        "max-md:top-auto max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:h-auto max-md:w-full max-md:flex-row max-md:justify-around max-md:border-t max-md:border-border max-md:py-2 max-md:pb-[env(safe-area-inset-bottom)] max-md:bg-card max-md:shadow-[0_-4px_12px_rgba(0,0,0,0.06)]",
        className
      )}
      aria-label="App navigation"
    >
      <div className="app-sidebar__brand flex h-14 shrink-0 items-center border-b border-border px-4 max-md:hidden">
        <Link
          href={brandHref}
          className="flex items-center gap-2 font-semibold text-secondary hover:text-accent transition-colors min-h-[44px] items-center"
        >
          <span className="text-lg tracking-tight">{brandLabel}</span>
        </Link>
      </div>
      <nav className="app-sidebar__nav flex flex-1 flex-col gap-0.5 overflow-y-auto p-3 max-md:flex-row max-md:justify-around max-md:overflow-visible max-md:gap-0">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/student" &&
              item.href !== "/alumni" &&
              item.href !== "/admin" &&
              pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "app-sidebar__link flex items-center justify-center md:justify-start gap-3 rounded-lg px-3 py-2.5 md:min-h-[44px] min-h-[48px] min-w-[48px] md:min-w-0 text-sm font-medium transition-colors [&_svg]:shrink-0",
                isActive
                  ? "bg-accent/10 text-secondary font-medium max-md:bg-secondary/10 max-md:text-secondary [&_svg]:text-current"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground max-md:text-foreground/90 max-md:[&_svg]:text-current"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {item.icon}
              <span className="max-md:sr-only">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
