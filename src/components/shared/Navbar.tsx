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
import { LogOut } from "lucide-react";

interface NavbarProps {
  title?: string;
}

export function Navbar({ title = "FiskConnect" }: NavbarProps) {
  const { user, profile, loading, logout } = useAuth();

  if (loading) {
    return (
      <header className="sticky top-0 z-30 border-b border-white/10 bg-card/80 backdrop-blur">
        <div className="flex h-14 items-center justify-between px-4 md:pl-60">
          <span className="font-semibold text-foreground">{title}</span>
          <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-card/80 backdrop-blur">
      <div className="flex h-14 items-center justify-between px-4 md:pl-60">
        <Link href={profile ? (profile.role === "student" ? "/student" : profile.role === "alumni" ? "/alumni" : "/admin") : "/"} className="font-semibold text-foreground hover:text-primary transition-colors">
          {title}
        </Link>
        {user && profile ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile.avatar_url ?? undefined} alt={profile.full_name ?? profile.email} />
                  <AvatarFallback className="bg-primary/20 text-primary text-sm">
                    {(profile.full_name ?? profile.email).slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm text-muted-foreground max-w-[120px] truncate">
                  {profile.full_name ?? profile.email}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card border-white/10">
              <DropdownMenuItem asChild>
                <Link href={profile.role === "student" ? "/student" : profile.role === "alumni" ? "/alumni" : "/admin"}>
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => logout()} className="text-destructive focus:text-destructive">
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
            <Button asChild size="sm" className="rounded-lg">
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
