import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText, ScrollTrigger);

export function useSplitLinesOnScroll(
  enabled: boolean,
  scopeRef: React.RefObject<HTMLElement | null>,
) {
  useLayoutEffect(() => {
    if (!enabled) return;

    ScrollTrigger.config({ ignoreMobileResize: true });

    let killed = false;

    const ctx = gsap.context(() => {
      (async () => {
        // Even if you preload fonts, it doesn't hurt to ensure
        await (document as any).fonts?.ready;

        // wait for unlock/reflow + paint (important on iOS)
        await new Promise<void>((r) => requestAnimationFrame(() => r()));
        await new Promise<void>((r) => requestAnimationFrame(() => r()));
        if (killed) return;

        const els = gsap.utils.toArray<HTMLElement>("[data-split='lines']");
        const splits: SplitText[] = [];
        const triggers: ScrollTrigger[] = [];

        els.forEach((el) => {
          // only split elements that actually contain text
          if (!el.textContent?.trim()) return;

          const split = SplitText.create(el, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            ignore: "sup",
            linesClass: "split-line",
          });

          splits.push(split);

          gsap.set(split.lines, { yPercent: 120, opacity: 0, force3D: true });

          const tl = gsap.timeline({ paused: true }).to(split.lines, {
            yPercent: 0,
            opacity: 1,
            duration: 1.0,
            ease: "power3.out",
            stagger: 0.08,
            overwrite: "auto",
            clearProps: "transform,opacity",
          });

          triggers.push(
            ScrollTrigger.create({
              trigger: el,
              start: "top 80%",
              once: true,
              onEnter: () => tl.play(0),
            }),
          );
        });

        ScrollTrigger.refresh();

        ctx.add(() => {
          triggers.forEach((t) => t.kill());
          splits.forEach((s) => s.revert());
        });
      })();
    }, scopeRef);

    return () => {
      killed = true;
      ctx.revert();
    };
  }, [enabled, scopeRef]);
}
