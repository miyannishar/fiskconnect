"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Search, Menu, X } from "lucide-react";
import { Logo } from "@/components/atoms/Logo";
import { NavLink } from "@/components/molecules/NavLink";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Organism: Landing page navigation – top bar + main header with mobile menu. */
export function LandingNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top bar – CTA strip */}
      <div className="landing-nav__top-bar bg-primary text-primary-foreground">
        <div className="landing-nav__top-bar-inner max-w-6xl mx-auto px-4 h-10 flex items-center justify-between text-xs sm:text-sm">
          <span className="landing-nav__top-bar-text truncate">
            Help build a student&apos;s future <strong>TODAY.</strong>
          </span>
          <div className="landing-nav__top-bar-actions flex items-center gap-2 sm:gap-4 shrink-0">
            <Link
              href="/login"
              className="flex items-center gap-1.5 font-medium opacity-95 hover:opacity-100 transition-opacity min-h-[44px] sm:min-h-0 items-center justify-center"
            >
              <Search className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span className="hidden min-[400px]:inline">Search</span>
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-1.5 font-semibold hover:underline min-h-[44px] sm:min-h-0 items-center justify-center"
            >
              <Heart className="h-3.5 w-3.5 shrink-0" aria-hidden />
              DONATE
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="landing-nav sticky top-0 z-50 border-b border-border bg-card shadow-sm">
        <div className="landing-nav__inner max-w-6xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between gap-4">
          <Logo href="/" showWordmark={true} className="shrink-0" />

          {/* Desktop nav */}
          <nav
            className="landing-nav__desktop hidden md:flex items-center gap-4 lg:gap-6 text-sm font-medium text-muted-foreground"
            aria-label="Main navigation"
          >
            <NavLink href="/login">LOGIN</NavLink>
            <NavLink href="/login">ALUMNI</NavLink>
            <NavLink href="/signup" variant="ghost">
              Sign up
            </NavLink>
            <Button asChild size="default" className="rounded-md font-semibold">
              <Link href="/signup">Get started</Link>
            </Button>
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="landing-nav__menu-btn md:hidden flex items-center justify-center min-h-[44px] min-w-[44px] rounded-md text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Open menu"
            aria-expanded={mobileMenuOpen}
          >
            <Menu className="h-6 w-6" aria-hidden />
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={cn(
          "landing-nav__mobile fixed inset-0 z-50 md:hidden",
          mobileMenuOpen ? "visible" : "invisible"
        )}
        aria-hidden={!mobileMenuOpen}
      >
        <button
          type="button"
          onClick={() => setMobileMenuOpen(false)}
          className="absolute inset-0 bg-black/50 transition-opacity"
          aria-label="Close menu"
        />
        <div
          className={cn(
            "landing-nav__mobile-panel absolute right-0 top-0 bottom-0 w-full max-w-sm bg-card shadow-xl flex flex-col",
            "transition-transform duration-200 ease-out",
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="landing-nav__mobile-header flex items-center justify-between p-4 border-b border-border">
            <Logo href="/" showWordmark={true} />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav
            className="landing-nav__mobile-nav flex flex-col p-4 gap-1"
            aria-label="Mobile navigation"
          >
            <NavLink
              href="/login"
              className="w-full justify-start py-3 text-base"
              onClick={() => setMobileMenuOpen(false)}
            >
              LOGIN
            </NavLink>
            <NavLink
              href="/login"
              className="w-full justify-start py-3 text-base"
              onClick={() => setMobileMenuOpen(false)}
            >
              ALUMNI
            </NavLink>
            <NavLink
              href="/signup"
              variant="ghost"
              className="w-full justify-start py-3 text-base"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign up
            </NavLink>
            <Button asChild className="w-full mt-4 rounded-md font-semibold" size="lg">
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                Get started
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </>
  );
}
