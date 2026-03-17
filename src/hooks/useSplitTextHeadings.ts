"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText, ScrollTrigger);

export function useSplitLinesOnScroll(
  enabled: boolean,
  scopeRef?: React.RefObject<HTMLElement | null>,
) {
  useLayoutEffect(() => {
    if (!enabled) return;

    const scopeEl = scopeRef?.current ?? document.body;

    const ctx = gsap.context(() => {
      const els = gsap.utils.toArray<HTMLElement>(
        scopeEl.querySelectorAll("[data-split='lines']"),
      );

      const splits: SplitText[] = [];
      const triggers: ScrollTrigger[] = [];
      const tls: gsap.core.Timeline[] = [];

      els.forEach((el) => {
        // Avoid flicker: hide the whole element until split is applied
        gsap.set(el, { visibility: "hidden" });

        const split = SplitText.create(el, {
          type: "lines",
          linesClass: "split-line",
          mask: "lines",
          maskClass: "split-mask",
          autoSplit: false, // reduce re-splitting surprises
          ignore: "sup",
        });

        splits.push(split);

        const lines = split.lines as HTMLElement[];
        const masks = (split.masks || []) as HTMLElement[];

        // Ensure masks actually clip
        masks.forEach((m) => {
          m.style.overflow = "hidden";
          m.style.display = "block";
        });

        lines.forEach((l) => {
          l.style.display = "block";
          l.style.willChange = "transform";
        });

        // Set initial state BEFORE revealing the element
        gsap.set(lines, { yPercent: 120, autoAlpha: 0 });
        gsap.set(el, { visibility: "visible" });

        const tl = gsap.timeline({ paused: true });
        tl.to(lines, {
          yPercent: 0,
          autoAlpha: 1,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.12,
          clearProps: "transform,opacity",
        });

        tls.push(tl);

        triggers.push(
          ScrollTrigger.create({
            trigger: el,
            start: "top 80%",
            once: true,
            onEnter: () => tl.play(0),
            invalidateOnRefresh: true,
          }),
        );
      });

      // One refresh after everything is set up
      ScrollTrigger.refresh();

      return () => {
        triggers.forEach((t) => t.kill());
        tls.forEach((t) => t.kill());
        splits.forEach((s) => s.revert());
      };
    }, scopeEl);

    return () => ctx.revert();
  }, [enabled, scopeRef]);
}
