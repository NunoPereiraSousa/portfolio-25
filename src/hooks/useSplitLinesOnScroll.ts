import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText, ScrollTrigger);

export function useSplitLinesOnScroll(enabled: boolean) {
  useLayoutEffect(() => {
    if (!enabled) return;

    const ctx = gsap.context(() => {
      const els = gsap.utils.toArray<HTMLElement>("[data-split='lines']");
      const splits: SplitText[] = [];

      els.forEach((el) => {
        // create split
        const split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          ignore: "sup", // keeps your <sup> intact
        });

        splits.push(split);

        // init hidden
        gsap.set(split.lines, { yPercent: 120, autoAlpha: 0 });

        // build animation (paused)
        const tl = gsap.timeline({ paused: true });
        tl.to(split.lines, {
          yPercent: 0,
          autoAlpha: 1,
          duration: 1.5,
          ease: "power4.out",
          stagger: 0.12,
          clearProps: "transform,opacity",
        });

        // ScrollTrigger: play when entering viewport
        ScrollTrigger.create({
          trigger: el,
          start: "top 80%",
          once: true, // animate only once
          onEnter: () => tl.play(0),
        });
      });

      // refresh after everything is created (good with custom fonts)
      ScrollTrigger.refresh();

      return () => {
        // kill triggers created in this context
        ScrollTrigger.getAll().forEach((t) => t.kill());
        splits.forEach((s) => s.revert());
      };
    });

    return () => ctx.revert();
  }, [enabled]);
}
