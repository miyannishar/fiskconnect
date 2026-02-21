"use client";

import { Gift } from "lucide-react";
import Link from "next/link";

/**
 * Bento grid section: headline, stats, and tiled cards with hover scale/rotate.
 * Uses Fisk design tokens (primary, secondary, accent, muted, foreground).
 */
export function ColorfulBentoGrid() {
  return (
    <section
      id="resources"
      className="bg-background rounded-2xl sm:rounded-3xl p-3 sm:p-4 my-8 sm:my-12 md:my-16 max-w-6xl mx-auto border border-border/50"
    >
      <div className="flex flex-col md:flex-row items-end justify-between w-full">
        <div className="flex flex-col my-6 sm:my-8 md:my-12 w-full items-start justify-start gap-4">
          <div className="flex flex-col md:flex-row gap-2 items-end w-full justify-between">
            <h2 className="relative text-2xl sm:text-4xl md:text-5xl font-sans font-semibold max-w-xl text-left leading-[1.15] sm:leading-[1em] text-foreground">
              Bulldog resources,{" "}
              <br />
              <span>
                <Gift
                  className="inline-flex text-primary fill-primary/10 rotate-12"
                  size={40}
                  strokeWidth={2}
                />
              </span>{" "}
              free for the network.
            </h2>
            <p className="max-w-sm font-semibold text-sm sm:text-md text-muted-foreground">
              Mentorship, opportunities, and connection. All in one place — built for Fisk and ready to use.
            </p>
          </div>

          <div className="flex flex-row flex-wrap text-primary gap-3 sm:gap-6 items-start justify-start sm:justify-center">
            <p className="text-sm sm:text-base font-medium">Students & alumni</p>
            <p className="text-sm sm:text-base font-medium">One platform, one network</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 md:items-start md:justify-start gap-3 sm:gap-4">
        <Link
          href="/signup"
          className="md:col-span-2 overflow-hidden md:hover:scale-[1.02] hover:shadow-lg hover:rotate-1 transition-all duration-200 ease-in-out min-h-[280px] sm:h-[330px] overflow-hidden relative bg-accent/20 rounded-xl flex flex-col sm:flex-row items-center gap-4 sm:gap-8 justify-between px-3 pt-3 pb-6 sm:pb-6"
        >
          <div className="relative flex flex-col items-start justify-center sm:ml-4 ml-2 gap-0 w-full sm:w-auto">
            <p className="-rotate-1 sm:ml-4 mb-1 text-foreground text-sm sm:text-base">Get started</p>
            <h3 className="-rotate-1 text-lg sm:text-2xl font-semibold text-center px-4 py-2 sm:px-6 sm:py-2 bg-foreground text-background rounded-full whitespace-nowrap w-fit">
              Mentorship + opportunities
            </h3>
          </div>
          <div className="w-full sm:flex-1 min-h-[80px] sm:min-h-0 object-fill rounded-xl" />
        </Link>

        <Link
          href="/login"
          className="overflow-hidden md:hover:scale-105 hover:shadow-lg hover:rotate-3 transition-all duration-200 ease-in-out relative bg-primary/20 min-h-[240px] sm:h-[330px] rounded-xl flex flex-col items-center justify-between px-3 py-6"
        >
          <div className="flex flex-col items-center justify-center gap-1">
            <p className="rotate-6 mb-1 text-foreground text-sm sm:text-base">Alumni & students</p>
            <h3 className="rotate-6 text-lg sm:text-2xl font-semibold text-center px-4 py-2 sm:px-6 sm:py-2 bg-foreground text-background rounded-full">
              Connect
            </h3>
          </div>
          <div className="w-full object-fill rounded-xl" />
        </Link>

        <Link
          href="/signup"
          className="overflow-hidden md:hover:scale-105 hover:shadow-lg hover:-rotate-3 transition-all duration-200 ease-in-out relative bg-secondary/20 min-h-[240px] sm:h-[330px] rounded-xl flex flex-col items-center justify-between px-4 sm:px-5 py-6"
        >
          <div className="flex flex-col items-center justify-center gap-1">
            <p className="-rotate-3 mb-1 text-foreground text-sm sm:text-base">One network</p>
            <h3 className="-rotate-3 text-lg sm:text-2xl font-semibold text-center px-4 py-2 sm:px-6 sm:py-2 bg-foreground text-background rounded-full">
              Community
            </h3>
          </div>
          <div className="w-full object-fill rounded-xl" />
        </Link>

        <div className="overflow-hidden md:hover:scale-105 hover:shadow-lg hover:rotate-4 transition-all duration-200 ease-in-out relative bg-muted min-h-[220px] sm:h-[330px] rounded-xl flex flex-col items-center justify-center px-4 sm:px-5 py-6 pointer-events-none">
          <p className="-rotate-3 mb-1 text-foreground text-sm sm:text-base">Blog & guides</p>
          <h3 className="-rotate-3 text-lg sm:text-2xl font-semibold text-center px-4 py-2 sm:px-6 sm:py-2 bg-muted-foreground/20 text-foreground rounded-full">
            Coming soon
          </h3>
        </div>

        <div className="flex flex-col items-center justify-center overflow-hidden md:hover:scale-105 hover:shadow-lg hover:-rotate-6 transition-all duration-200 ease-in-out relative bg-primary/20 min-h-[220px] sm:h-[330px] rounded-xl px-4 sm:px-5 py-6 pointer-events-none">
          <p className="rotate-6 mb-1 text-foreground text-sm sm:text-base">Playbooks</p>
          <h3 className="rotate-6 text-lg sm:text-2xl font-semibold text-center px-4 py-2 sm:px-6 sm:py-2 bg-primary-foreground/20 text-foreground rounded-full">
            Coming soon
          </h3>
        </div>
      </div>
    </section>
  );
}
