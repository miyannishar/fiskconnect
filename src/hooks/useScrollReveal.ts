"use client";

import { useEffect, useRef } from "react";

const defaultOptions = { rootMargin: "0px 0px -8% 0px", threshold: 0.1 };

/**
 * Returns a ref to attach to an element and whether it has entered the viewport.
 * Use with CSS .animate-on-scroll / .revealed for scroll-triggered animations.
 */
export function useScrollReveal(observerOptions?: IntersectionObserverInit) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) el.classList.add("revealed");
      },
      { ...defaultOptions, ...observerOptions }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [observerOptions]);

  return ref;
}
