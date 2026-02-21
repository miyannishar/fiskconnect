import Link from "next/link";
import { Instagram, Linkedin, Youtube, Twitter } from "lucide-react";
import { Logo } from "@/components/atoms/Logo";

/** Dayos-style footer: black bg, grid with logo, link groups, bottom row (legal, socials). */
const linkGroups = [
  {
    label: "Students",
    items: [
      { label: "Opportunities", href: "/login" },
      { label: "Find alumni", href: "/login" },
      { label: "Dashboard", href: "/login" },
    ],
  },
  {
    label: "Alumni",
    items: [
      { label: "Give back", href: "/login" },
      { label: "Opportunity Board", href: "/login" },
    ],
  },
  {
    label: "Campus",
    items: [
      { label: "About", href: "/" },
      { label: "Contact", href: "/login" },
    ],
  },
];

const socialItems = [
  { href: "https://instagram.com/fiskuniversity", label: "Instagram", icon: Instagram },
  { href: "https://linkedin.com/school/fiskuniversity", label: "LinkedIn", icon: Linkedin },
  { href: "https://youtube.com/fiskuniversity", label: "YouTube", icon: Youtube },
  { href: "https://twitter.com/fiskuniversity", label: "Twitter", icon: Twitter },
];

export function FooterSection() {
  return (
    <footer className="footer bg-black text-white overflow-clip">
      {/* Top: nav bar (dayos repeats TheNav with theme black) */}
      <div className="footer__nav h-[var(--nav-height)] flex items-center justify-between px-4 md:px-8 max-w-[1600px] mx-auto">
        <Logo href="/" showWordmark={true} className="h-8 text-white [&>span:first-child]:bg-white [&>span:first-child]:text-black" />
        <Link
          href="/signup"
          className="text-sm font-semibold text-white hover:opacity-80 transition-opacity"
        >
          Get started
        </Link>
      </div>

      <div className="footer__wrap py-10 md:py-16 px-4 md:px-8 max-w-[1600px] mx-auto">
        <div className="footer__top grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-6 font-medium text-base leading-tight tracking-tight">
          {/* Left: logo + back to top (mobile) / mail */}
          <div className="md:col-span-3 flex flex-col md:flex-row md:items-start gap-4">
            <Link href="/" className="sr-only md:not-sr-only md:block">
              FiskConnect Home
            </Link>
            <div className="flex flex-row items-center justify-between md:block">
              <span className="text-white/70">Questions?</span>
              <Link
                href="/login"
                className="text-primary hover:underline ml-1"
              >
                Contact us
              </Link>
            </div>
          </div>

          {/* Right: link groups */}
          <div className="md:col-span-9 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
            {linkGroups.map((group) => (
              <div key={group.label} className="flex flex-col gap-3" role="group">
                <span className="text-white font-medium">{group.label}</span>
                <ul className="flex flex-col gap-2 text-white/60">
                  {group.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="footer__link hover:text-white transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: legal, addresses, socials */}
        <div className="footer__bottom mt-12 md:mt-16 pt-8 border-t border-white/20 text-sm text-white/50 font-mono tracking-tight">
          <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-end md:justify-between">
            <p className="md:max-w-md">
              Built with care at Future Fisk Hackathon 2026. FiskConnect bridges students, alumni & administration.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-white/60">1000 17th Ave N, Nashville, TN 37208</span>
              <ul className="flex items-center gap-2">
                {socialItems.map(({ href, label, icon: Icon }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 text-white hover:bg-white hover:text-black transition-colors"
                      aria-label={label}
                    >
                      <Icon className="h-4 w-4" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <ul className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-white/50">
            <li>
              <Link href="/login" className="hover:text-white transition-colors">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-white transition-colors">
                Terms
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
