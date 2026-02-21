import Link from "next/link";
import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-fisk-navy text-white">
      {/* Top strip – social */}
      <div className="bg-background border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center justify-center gap-4 text-sm">
          <span className="text-muted-foreground">
            Follow <strong className="text-fisk-royal">Fisk</strong> on social:
          </span>
          <div className="flex items-center gap-3">
            <a
              href="https://instagram.com/fiskuniversity"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fisk-royal hover:opacity-80 transition-opacity"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="https://facebook.com/fiskuniversity"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fisk-royal hover:opacity-80 transition-opacity"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com/fiskuniversity"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fisk-royal hover:opacity-80 transition-opacity"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="https://youtube.com/fiskuniversity"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fisk-royal hover:opacity-80 transition-opacity"
              aria-label="YouTube"
            >
              <Youtube className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main footer – two-tone Fisk style */}
      <div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">
            Student resources
          </h3>
          <ul className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-white/80">
            <li><Link href="/login" className="hover:text-white hover:underline">Opportunities</Link></li>
            <li><Link href="/login" className="hover:text-white hover:underline">Find alumni</Link></li>
            <li><Link href="/login" className="hover:text-white hover:underline">Dashboard</Link></li>
          </ul>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90 pt-4">
            Campus links
          </h3>
          <ul className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-white/80">
            <li><Link href="/" className="hover:text-white hover:underline">About</Link></li>
            <li><Link href="/login" className="hover:text-white hover:underline">Contact</Link></li>
          </ul>
          <p className="text-xs text-white/60 pt-6 max-w-xl">
            Built with care at Future Fisk Hackathon 2026. FiskConnect bridges students, alumni & administration.
          </p>
        </div>
        <div className="bg-fisk-royal/90 rounded-lg p-6 flex flex-col justify-center items-center md:items-start text-center md:text-left">
          <div className="bg-white/10 px-3 py-1.5 rounded text-sm font-bold text-white mb-4">
            FISK CONNECT
          </div>
          <p className="text-sm text-white/90 mb-4">
            1000 17th Ave N, Nashville, TN 37208
          </p>
          <Link
            href="/login"
            className="text-sm font-semibold text-white hover:underline"
          >
            CONTACT US
          </Link>
        </div>
      </div>
    </footer>
  );
}
