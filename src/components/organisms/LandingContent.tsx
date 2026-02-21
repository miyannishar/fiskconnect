"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { landingImages, PORTAL_SCREENSHOT } from "@/lib/landing-images";

/** Dayos-style sections: same container, grid, and card config; FiskConnect text only. */

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) el.classList.add("revealed");
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function BulletIcon({ dark = false }: { dark?: boolean }) {
  return (
    <span className="inline-flex shrink-0 w-2 h-2 mt-1.5 mr-2 align-top">
      <Image
        src={dark ? "/assets/icons/bullet-yellow.svg" : "/assets/icons/bullet-black.svg"}
        alt=""
        width={8}
        height={8}
        className="w-full h-full object-contain"
        aria-hidden
      />
    </span>
  );
}

function Section({
  children,
  dark = false,
  className = "",
}: {
  children: React.ReactNode;
  dark?: boolean;
  className?: string;
}) {
  const ref = useReveal();
  return (
    <section
      ref={ref}
      className={cn(
        "py-8 sm:py-12 md:py-16 lg:py-20 animate-on-scroll",
        dark ? "bg-secondary text-secondary-foreground" : "bg-background text-foreground",
        className
      )}
    >
      <div className="dayos-container">{children}</div>
    </section>
  );
}

function SectionTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <h2
      className={cn(
        "font-condensed font-bold uppercase tracking-tight",
        "text-2xl leading-[0.95] sm:text-[2.75rem] sm:leading-[0.9] md:text-[3.5rem] lg:text-[5rem] xl:text-[6.4rem] tracking-[-0.03em]",
        className
      )}
    >
      {children}
    </h2>
  );
}

export function LandingContent() {
  const [expandedFoundation, setExpandedFoundation] = useState<number | null>(null);

  return (
    <>
      {/* Foundation: dayos pricing-card style */}
      <Section>
        <SectionTitle className="text-foreground">Built on what Fisk already has</SectionTitle>
        <p className="mt-4 text-base sm:text-[1.6rem] text-muted-foreground max-w-2xl">
          We’re not starting from zero. Fisk’s existing systems are the base; FiskConnect plugs into them.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-10 [&_.dayos-pricing-card]:col-span-1">
          {[
            { pre: "Platform", title: "Alumni platform", detail: "Est. 2014 — a proven base to extend, not replace.", i: 0 },
            { pre: "Giving", title: "Donation & giving", detail: "Infrastructure that already supports engagement.", i: 1 },
            { pre: "Team", title: "Alumni relations", detail: "Dedicated team ready to work with a living network.", i: 2 },
            { pre: "Portal", title: "Student portal", detail: "Where students already log in every day.", i: 3 },
          ].map(({ pre, title, detail, i }) => (
            <div key={i} className="dayos-pricing-card stagger-item min-h-0">
              <div className="dayos-pricing-card__line" />
              <span className="dayos-pricing-card__icon flex items-center justify-center">
                <Image src="/assets/icons/bullet-black.svg" alt="" width={10} height={10} aria-hidden />
              </span>
              <button
                type="button"
                onClick={() => setExpandedFoundation(expandedFoundation === i ? null : i)}
                className="dayos-pricing-card__top"
              >
                <span className="block text-xs font-condensed font-bold uppercase tracking-tight text-muted-foreground">{pre}</span>
                <span className="mt-1 block font-condensed text-xl md:text-2xl font-bold uppercase text-foreground">{title}</span>
                <div
                  className={cn(
                    "dayos-pricing-card__points mt-3",
                    expandedFoundation === i ? "max-h-24" : "max-h-0"
                  )}
                >
                  <p className="text-sm text-muted-foreground">{detail}</p>
                </div>
              </button>
            </div>
          ))}
        </div>
        <p className="mt-10 text-[1.8rem] font-medium text-foreground">
          The infrastructure is there. We’re here to activate it.
        </p>
      </Section>

      {/* Opportunity: dayos carousel-card style (3 cards) */}
      <Section dark>
        <SectionTitle className="text-white">From platform to network</SectionTitle>
        <p className="mt-4 text-white/80 text-base sm:text-[1.6rem] max-w-2xl">
          Today’s tools are powerful, but often live outside the flow students use every day. The next step is bringing the network inside.
        </p>
        <div className="dayos-grid mt-10">
          {[
            { heading: "External links mean out of sight", desc: "Visibility drops when it’s one more tab.", img: landingImages.opportunity[0] },
            { heading: "Engagement stays in silos", desc: "We can make it interactive and central.", img: landingImages.opportunity[1] },
            { heading: "Integration changes the game", desc: "Right inside the student workflow.", img: landingImages.opportunity[2] },
          ].map((item, i) => (
            <div key={i} className={cn("dayos-carousel-card dayos-carousel-card--dark stagger-item")}>
              <div className="dayos-carousel-card__image relative overflow-hidden">
                <Image src={item.img} alt="" fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
              </div>
              <div className="dayos-carousel-card__details">
                <div>
                  <h3 className="font-condensed font-bold text-lg uppercase text-white">{item.heading}</h3>
                  <p className="mt-2 text-sm text-white/70">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-10 text-white/95 text-base sm:text-[1.6rem]">
          Not a replacement — an evolution. When connection lives where students already are, the network becomes part of daily life.
        </p>
      </Section>

      {/* One network, three corners: same carousel cards (no triangle) */}
      <Section>
        <SectionTitle className="text-foreground">One network, three corners</SectionTitle>
        <p className="mt-4 text-muted-foreground text-base sm:text-[1.6rem] max-w-2xl">
          Students, alumni, and administration stay in sync. FiskConnect sits inside the existing portal so everyone meets in one place.
        </p>
        <div className="dayos-grid mt-10">
          {[
            { heading: "Students", desc: "Find mentors and opportunities in one place, inside the portal.", img: landingImages.threeCorners[0] },
            { heading: "Alumni", desc: "Give back — post opportunities and stay connected with campus.", img: landingImages.threeCorners[1] },
            { heading: "Administration", desc: "Orchestrate connections and oversee the community.", img: landingImages.threeCorners[2] },
          ].map((item, i) => (
            <div key={i} className="dayos-carousel-card stagger-item">
              <div className="dayos-carousel-card__image relative overflow-hidden">
                <Image src={item.img} alt="" fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
              </div>
              <div className="dayos-carousel-card__details">
                <div>
                  <h3 className="font-condensed font-bold text-lg uppercase text-foreground">{item.heading}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-8 font-condensed font-bold text-lg uppercase text-secondary text-center">
          Enhancement, not replacement.
        </p>
      </Section>

      {/* Impact: dayos carousel cards (dark) */}
      <Section dark>
        <SectionTitle className="text-white">Impact that compounds</SectionTitle>
        <p className="mt-4 text-white/80 text-base sm:text-[1.6rem] max-w-2xl">
          From first connections to long-term community, the effects stack.
        </p>
        <div className="dayos-grid mt-10">
          {[
            { period: "Soon", items: ["More mentors in students’ corners", "Opportunities shared where students already are"], img: landingImages.impact[0] },
            { period: "Next", items: ["Stronger placement stories", "Alumni showing up more often"], img: landingImages.impact[1] },
            { period: "Later", items: ["A deeper donor pipeline", "Generations of Fisk staying linked"], img: landingImages.impact[2] },
          ].map((block, i) => (
            <div key={i} className={cn("dayos-carousel-card dayos-carousel-card--dark stagger-item")}>
              <div className="dayos-carousel-card__image relative overflow-hidden">
                <Image src={block.img} alt="" fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
              </div>
              <div className="dayos-carousel-card__details">
                <h3 className="font-condensed font-bold text-white text-lg uppercase">{block.period}</h3>
                <ul className="mt-4 space-y-2 list-none pl-0">
                  {block.items.map((item, j) => (
                    <li key={j} className="flex items-start text-white/85 text-sm">
                      <BulletIcon dark />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* What it is + CTA: dayos carousel card (full width) */}
      <Section>
        <SectionTitle className="text-foreground">What FiskConnect is</SectionTitle>
        <p className="mt-4 text-muted-foreground text-base sm:text-[1.6rem] leading-relaxed max-w-2xl">
          A proposal to turn Fisk’s alumni network into something students can actually use — every day. Built at the hackathon, designed to live inside Fisk’s portal and grow with the university.
        </p>
        <h3 className="font-condensed text-2xl font-bold uppercase mt-10 text-foreground">What it does</h3>
        <ul className="mt-4 space-y-2 text-muted-foreground text-base sm:text-[1.6rem] list-none pl-0">
          <li className="flex items-start">
            <BulletIcon />
            <span>Bridges students and alumni directly</span>
          </li>
          <li className="flex items-start">
            <BulletIcon />
            <span>Surfaces mentorship and opportunities in one place</span>
          </li>
          <li className="flex items-start">
            <BulletIcon />
            <span>Makes the Fisk network part of the daily routine</span>
          </li>
        </ul>
        <div className="mt-12 pt-10 border-t border-border">
          <p className="font-condensed font-bold text-xl uppercase text-foreground mb-6">See it in action</p>
          <Link
            href="/signup"
            className="group block dayos-carousel-card stagger-item md:max-w-2xl"
          >
            <div className="dayos-carousel-card__image relative overflow-hidden">
              {/* Replace PORTAL_SCREENSHOT with your Fisk portal screenshot: e.g. /assets/images/portal-preview.jpg */}
              <Image
                src={PORTAL_SCREENSHOT}
                alt="FiskConnect inside the portal"
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </div>
            <div className="dayos-carousel-card__details">
              <div>
                <h4 className="font-condensed font-bold text-lg uppercase text-foreground">Inside the portal</h4>
                <p className="mt-2 text-sm text-muted-foreground">
                  Alumni and opportunities in one place. One click to connect.
                </p>
              </div>
              <span className="mt-4 inline-flex font-semibold text-secondary hover:underline">Get started →</span>
            </div>
          </Link>
        </div>
      </Section>
    </>
  );
}
