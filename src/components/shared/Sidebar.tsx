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
        "fixed left-0 top-0 z-40 flex h-screen w-60 flex-col border-r border-border bg-card shadow-sm",
        "max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:h-auto max-md:w-full max-md:flex-row max-md:justify-around max-md:border-t max-md:py-2",
        className
      )}
    >
      <div className="flex h-14 shrink-0 items-center border-b border-border px-4 max-md:hidden">
        <Link
          href={brandHref}
          className="flex items-center gap-2 font-semibold text-fisk-navy hover:text-fisk-royal transition-colors"
        >
          <span className="text-lg tracking-tight">{brandLabel}</span>
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3 max-md:flex-row max-md:justify-around max-md:overflow-visible">
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
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-fisk-royal/10 text-fisk-navy font-medium"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
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
