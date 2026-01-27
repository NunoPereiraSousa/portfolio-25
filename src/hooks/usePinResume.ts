// src/hooks/usePinResume.ts
"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function usePinResume(enabled: boolean) {
  useLayoutEffect(() => {
    if (!enabled) return;

    const sticky = document.querySelector(
      ".resume-sticky",
    ) as HTMLElement | null;
    const section = document.querySelector(".resume") as HTMLElement | null;

    if (!sticky || !section) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top-=50", // same as your top: 10rem-ish
        end: "bottom bottom", // stop pin when section ends
        pin: sticky,
        pinSpacing: true,
        invalidateOnRefresh: true,
      });

      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, [enabled]);
}
