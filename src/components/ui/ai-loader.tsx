"use client";

import { cn } from "@/lib/utils";

/** AI-style loader: animated word (one letter at a time) + rotating circle. */
export function AILoader({
  text = "Searching",
  size = "default",
  className,
}: {
  text?: string;
  /** default: normal. large: bigger letters and circle. */
  size?: "default" | "large";
  className?: string;
}) {
  const letters = text.split("");
  const isLarge = size === "large";

  return (
    <div
      className={cn(
        "ai-loader-wrapper flex flex-col items-center justify-center gap-6 py-8",
        isLarge && "gap-8 py-10",
        className
      )}
    >
      <div
        className={cn(
          "ai-loader__letters flex items-center justify-center gap-0.5",
          isLarge && "gap-1"
        )}
      >
        {letters.map((char, i) => (
          <span
            key={`${i}-${char}`}
            className={cn(
              "ai-loader__letter inline-block font-semibold text-foreground",
              isLarge ? "text-3xl sm:text-4xl" : "text-lg sm:text-xl"
            )}
            style={{
              animation: "ai-loader-letter 1.2s ease-in-out infinite",
              animationDelay: `${i * 0.08}s`,
            }}
          >
            {char}
          </span>
        ))}
      </div>
      <div className={cn("ai-loader__circle", isLarge && "ai-loader__circle--large")} aria-hidden />
    </div>
  );
}
