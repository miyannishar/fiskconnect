import Link from "next/link";
import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";
import { SocialLinks } from "@/components/molecules/SocialLinks";

const socialItems = [
  {
    href: "https://instagram.com/fiskuniversity",
    label: "Instagram",
    icon: <Instagram className="h-5 w-5" />,
  },
  {
    href: "https://facebook.com/fiskuniversity",
    label: "Facebook",
    icon: <Facebook className="h-5 w-5" />,
  },
  {
    href: "https://twitter.com/fiskuniversity",
    label: "Twitter",
    icon: <Twitter className="h-5 w-5" />,
  },
  {
    href: "https://youtube.com/fiskuniversity",
    label: "YouTube",
    icon: <Youtube className="h-5 w-5" />,
  },
];

/** Organism: Site footer – social strip + links + CTA block. */
export function FooterSection() {
  return (
    <footer className="footer bg-secondary text-secondary-foreground">
      <div className="footer__social-strip bg-background border-b border-border">
        <div className="footer__social-inner max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 text-sm">
          <span className="text-muted-foreground text-center sm:text-left">
            Follow <strong className="text-accent">Fisk</strong> on social:
          </span>
          <SocialLinks items={socialItems} />
        </div>
      </div>

      <div className="footer__main max-w-6xl mx-auto px-4 py-10 sm:py-12 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
        <div className="footer__links md:col-span-2 space-y-6">
          <h3 className="footer__heading text-sm font-semibold uppercase tracking-wider text-white/90">
            Student resources
          </h3>
          <ul
            className="footer__list grid grid-cols-2 gap-x-6 gap-y-3 sm:gap-x-8 sm:gap-y-2 text-sm text-white/80"
            role="list"
          >
            <li>
              <Link
                href="/login"
                className="footer__link hover:text-white hover:underline min-h-[44px] flex items-center"
              >
                Opportunities
              </Link>
            </li>
            <li>
              <Link
                href="/login"
                className="footer__link hover:text-white hover:underline min-h-[44px] flex items-center"
              >
                Find alumni
              </Link>
            </li>
            <li>
              <Link
                href="/login"
                className="footer__link hover:text-white hover:underline min-h-[44px] flex items-center"
              >
                Dashboard
              </Link>
            </li>
          </ul>
          <h3 className="footer__heading text-sm font-semibold uppercase tracking-wider text-white/90 pt-4">
            Campus links
          </h3>
          <ul
            className="footer__list grid grid-cols-2 gap-x-6 gap-y-3 sm:gap-x-8 sm:gap-y-2 text-sm text-white/80"
            role="list"
          >
            <li>
              <Link
                href="/"
                className="footer__link hover:text-white hover:underline min-h-[44px] flex items-center"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/login"
                className="footer__link hover:text-white hover:underline min-h-[44px] flex items-center"
              >
                Contact
              </Link>
            </li>
          </ul>
          <p className="footer__copy text-xs text-white/60 pt-6 max-w-xl">
            Built with care at Future Fisk Hackathon 2026. FiskConnect bridges
            students, alumni & administration.
          </p>
        </div>

        <div className="footer__cta bg-accent/90 rounded-lg p-6 flex flex-col justify-center items-center md:items-start text-center md:text-left">
          <div className="bg-white/10 px-3 py-1.5 rounded text-sm font-bold text-white mb-4">
            FISK CONNECT
          </div>
          <p className="text-sm text-white/90 mb-4">
            1000 17th Ave N, Nashville, TN 37208
          </p>
          <Link
            href="/login"
            className="footer__cta-link text-sm font-semibold text-white hover:underline min-h-[44px] inline-flex items-center"
          >
            CONTACT US
          </Link>
        </div>
      </div>
    </footer>
  );
}
