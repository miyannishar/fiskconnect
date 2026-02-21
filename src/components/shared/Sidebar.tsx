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
  className?: string;
}

export function Sidebar({ navItems, className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen w-56 border-r border-white/10 bg-card",
        "flex flex-col gap-1 p-4",
        "max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:h-auto max-md:w-full max-md:flex-row max-md:justify-around max-md:border-t max-md:py-2",
        className
      )}
    >
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/student" && item.href !== "/alumni" && item.href !== "/admin" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/20 text-primary"
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            )}
          >
            {item.icon}
            <span className="max-md:sr-only">{item.label}</span>
          </Link>
        );
      })}
    </aside>
  );
}
