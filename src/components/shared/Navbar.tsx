"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, LayoutDashboard } from "lucide-react";

interface NavbarProps {
  title?: string;
}

export function Navbar({ title = "FiskConnect" }: NavbarProps) {
  const { user, profile, loading, logout } = useAuth();

  if (loading) {
    return (
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-card/95 px-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/80 md:pl-60">
        <span className="font-semibold text-foreground">{title}</span>
        <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-card/95 px-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/80 md:pl-60">
      <Link
        href={
          profile
            ? profile.role === "student"
              ? "/student"
              : profile.role === "alumni"
                ? "/alumni"
                : "/admin"
            : "/"
        }
        className="font-semibold text-foreground transition-colors hover:text-primary"
      >
        {title}
      </Link>
      {user && profile ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <Avatar className="h-8 w-8 border border-border">
                <AvatarImage
                  src={profile.avatar_url ?? undefined}
                  alt={profile.full_name ?? profile.email}
                />
                <AvatarFallback className="bg-primary/20 text-sm text-primary">
                  {(profile.full_name ?? profile.email).slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="hidden max-w-[140px] truncate text-sm text-muted-foreground sm:inline">
                {profile.full_name ?? profile.email}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 border-border bg-card"
          >
            <DropdownMenuItem asChild>
              <Link
                href={
                  profile.role === "student"
                    ? "/student"
                    : profile.role === "alumni"
                      ? "/alumni"
                      : "/admin"
                }
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => logout()}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/signup">Sign up</Link>
          </Button>
        </div>
      )}
    </header>
  );
}
