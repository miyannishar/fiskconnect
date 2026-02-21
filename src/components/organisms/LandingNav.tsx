"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/atoms/Logo";
import { NavLink } from "@/components/molecules/NavLink";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Dayos-style landing nav: fixed bar, logo left, nav center, CTA right. */
export function LandingNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header
        className="landing-nav fixed top-0 left-0 right-0 z-[2000] h-[var(--nav-height)] flex items-center bg-[hsl(var(--muted))] text-foreground transition-opacity duration-100 ease-in-out"
        style={{ width: "calc(100% - var(--scrollbar-width, 0px))" }}
        role="navigation"
      >
        <div className="landing-nav__container h-full w-full max-w-[1600px] mx-auto flex items-center justify-between px-4 md:px-8">
          {/* Left: logo */}
          <div className="landing-nav__left flex items-center h-full shrink-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="landing-nav__menu-btn md:hidden flex items-center justify-center min-h-[44px] min-w-[44px] -ml-2 rounded-md text-foreground hover:bg-black/5"
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="h-6 w-6" aria-hidden />
            </button>
            <Logo href="/" showWordmark={true} className="h-8 shrink-0" />
          </div>

          {/* Center: nav links (desktop) */}
          <nav
            className="landing-nav__center absolute left-1/2 top-0 h-full -translate-x-1/2 hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium"
            aria-label="Main navigation"
          >
            <NavLink href="/login">Login</NavLink>
            <NavLink href="/login">Alumni</NavLink>
            <NavLink href="/login">Students</NavLink>
          </nav>

          {/* Right: CTA */}
          <div className="landing-nav__right flex items-center justify-end gap-2 shrink-0">
            <Button
              asChild
              size="sm"
              className="rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold h-10 px-4"
            >
              <Link href="/signup">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={cn(
          "landing-nav__mobile fixed inset-0 z-[2000] md:hidden",
          mobileMenuOpen ? "visible" : "invisible"
        )}
        aria-hidden={!mobileMenuOpen}
      >
        <button
          type="button"
          onClick={() => setMobileMenuOpen(false)}
          className="absolute inset-0 bg-black/40 transition-opacity"
          aria-label="Close menu"
        />
        <div
          className={cn(
            "landing-nav__mobile-panel absolute right-0 top-0 bottom-0 w-full max-w-sm bg-[hsl(var(--muted))] shadow-xl flex flex-col",
            "transition-transform duration-200 ease-out",
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="landing-nav__mobile-header flex items-center justify-between p-4 border-b border-border">
            <Logo href="/" showWordmark={true} />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md hover:bg-black/5"
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
              Login
            </NavLink>
            <NavLink
              href="/login"
              className="w-full justify-start py-3 text-base"
              onClick={() => setMobileMenuOpen(false)}
            >
              Alumni
            </NavLink>
            <NavLink
              href="/login"
              className="w-full justify-start py-3 text-base"
              onClick={() => setMobileMenuOpen(false)}
            >
              Students
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
