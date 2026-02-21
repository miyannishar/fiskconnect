import Link from "next/link";
import { Heart, Search } from "lucide-react";

export function LandingNav() {
  return (
    <>
      {/* Top bar – Fisk style: yellow CTA + Donate */}
      <div className="bg-primary text-primary-foreground">
        <div className="max-w-6xl mx-auto px-4 h-10 flex items-center justify-between text-sm">
          <span>
            Help build a student&apos;s future <strong>TODAY.</strong>
          </span>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="flex items-center gap-1.5 font-medium opacity-95 hover:opacity-100 transition-opacity"
            >
              <Search className="h-3.5 w-3.5" aria-hidden />
              Search
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-1.5 font-semibold hover:underline"
            >
              <Heart className="h-3.5 w-3.5" aria-hidden />
              DONATE
            </Link>
          </div>
        </div>
      </div>
      {/* Main nav – white bar, logo + links */}
      <header className="sticky top-0 z-50 border-b border-border bg-card shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-foreground hover:text-fisk-navy transition-colors"
          >
            <span className="bg-fisk-navy text-white px-3 py-1.5 rounded text-sm tracking-wide">
              FISK
            </span>
            <span className="text-fisk-navy hidden sm:inline">CONNECT</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/login" className="hover:text-fisk-royal transition-colors">
              LOGIN
            </Link>
            <Link href="/login" className="hover:text-fisk-royal transition-colors">
              ALUMNI
            </Link>
            <Link href="/signup" className="text-fisk-royal hover:underline">
              Sign up
            </Link>
            <Link
              href="/signup"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-semibold hover:opacity-90 transition-opacity"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
