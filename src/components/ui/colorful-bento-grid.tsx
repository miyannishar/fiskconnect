"use client";

import { cn } from "@/lib/utils";
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
      className="bg-background rounded-3xl p-4 my-16 max-w-6xl mx-auto border border-border/50"
    >
      <div className="flex flex-col md:flex-row items-end justify-between w-full">
        <div className="flex flex-col my-12 w-full items-start justify-start gap-4">
          <div className="flex flex-col md:flex-row gap-2 items-end w-full justify-between">
            <h2 className="relative text-4xl md:text-5xl font-sans font-semibold max-w-xl text-left leading-[1em] text-foreground">
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
            <p className="max-w-sm font-semibold text-md text-muted-foreground">
              Mentorship, opportunities, and connection. All in one place — built for Fisk and ready to use.
            </p>
          </div>

          <div className="flex flex-row text-primary gap-6 items-start justify-center">
            <p className="text-base whitespace-nowrap font-medium">Students & alumni</p>
            <p className="text-base whitespace-nowrap font-medium">One platform, one network</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 md:items-start md:justify-start gap-4">
        <Link
          href="/signup"
          className="md:col-span-2 overflow-hidden md:hover:scale-[1.02] hover:shadow-lg hover:rotate-1 transition-all duration-200 ease-in-out h-[330px] overflow-hidden relative bg-accent/20 rounded-xl flex flex-row items-center gap-8 justify-between px-3 pt-3 pb-6"
        >
          <div className="relative flex flex-col items-start justify-center ml-4 gap-0">
            <p className="-rotate-1 ml-4 mb-1 text-foreground">Get started</p>
            <h3 className="-rotate-1 text-2xl whitespace-nowrap font-semibold text-center px-6 py-2 bg-foreground text-background rounded-full">
              Mentorship + opportunities
            </h3>
          </div>
          <div className="w-full object-fill rounded-xl" />
        </Link>

        <Link
          href="/login"
          className="overflow-hidden md:hover:scale-105 hover:shadow-lg hover:rotate-3 transition-all duration-200 ease-in-out relative bg-primary/20 h-[330px] rounded-xl flex flex-col items-center justify-between px-3 py-6"
        >
          <div className="flex flex-col items-center justify-center gap-1">
            <p className="rotate-6 mb-1 text-foreground">Alumni & students</p>
            <h3 className="rotate-6 text-2xl font-semibold text-center px-6 py-2 bg-foreground text-background rounded-full">
              Connect
            </h3>
          </div>
          <div className="w-full object-fill rounded-xl" />
        </Link>

        <Link
          href="/signup"
          className="overflow-hidden md:hover:scale-105 hover:shadow-lg hover:-rotate-3 transition-all duration-200 ease-in-out relative bg-secondary/20 h-[330px] rounded-xl flex flex-col items-center justify-between px-5 py-6"
        >
          <div className="flex flex-col items-center justify-center gap-1">
            <p className="-rotate-3 mb-1 text-foreground">One network</p>
            <h3 className="-rotate-3 text-2xl font-semibold text-center px-6 py-2 bg-foreground text-background rounded-full">
              Community
            </h3>
          </div>
          <div className="w-full object-fill rounded-xl" />
        </Link>

        <div className="overflow-hidden md:hover:scale-105 hover:shadow-lg hover:rotate-4 transition-all duration-200 ease-in-out relative bg-muted h-[330px] rounded-xl flex flex-col items-center justify-center px-5 py-6 pointer-events-none">
          <p className="-rotate-3 mb-1 text-foreground">Blog & guides</p>
          <h3 className="-rotate-3 text-2xl font-semibold text-center px-6 py-2 bg-muted-foreground/20 text-foreground rounded-full">
            Coming soon
          </h3>
        </div>

        <div className="flex flex-col items-center justify-center overflow-hidden md:hover:scale-105 hover:shadow-lg hover:-rotate-6 transition-all duration-200 ease-in-out relative bg-primary/20 h-[330px] rounded-xl px-5 py-6 pointer-events-none">
          <p className="rotate-6 mb-1 text-foreground">Playbooks</p>
          <h3 className="rotate-6 text-2xl font-semibold text-center px-6 py-2 bg-primary-foreground/20 text-foreground rounded-full">
            Coming soon
          </h3>
        </div>
      </div>
    </section>
  );
}
