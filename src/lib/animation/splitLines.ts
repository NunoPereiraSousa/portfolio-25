import { gsap, ScrollTrigger, SplitText } from "./gsap";
import { prefersReducedMotion } from "./motion";
import { animationTokens } from "./tokens";

export function createSplitLinesOnScroll(scopeEl: HTMLElement) {
  return gsap.context(() => {
    const els = gsap.utils.toArray<HTMLElement>(
      scopeEl.querySelectorAll("[data-split='lines']"),
    );

    const splits: SplitText[] = [];
    const triggers: ScrollTrigger[] = [];
    const timelines: gsap.core.Timeline[] = [];
    const reduceMotion = prefersReducedMotion();

    els.forEach((el) => {
      if (reduceMotion) {
        gsap.set(el, { visibility: "visible" });
        return;
      }

      gsap.set(el, { visibility: "hidden" });

      const split = SplitText.create(el, {
        type: "lines",
        linesClass: "split-line",
        mask: "lines",
        maskClass: "split-mask",
        autoSplit: false,
        ignore: "sup",
      });

      splits.push(split);

      const lines = split.lines as HTMLElement[];
      const masks = (split.masks || []) as HTMLElement[];

      masks.forEach((mask) => {
        mask.style.overflow = "hidden";
        mask.style.display = "block";
      });

      lines.forEach((line) => {
        line.style.display = "block";
        line.style.willChange = "transform";
      });

      gsap.set(lines, { yPercent: 120, autoAlpha: 0 });
      gsap.set(el, { visibility: "visible" });

      const timeline = gsap.timeline({ paused: true });
      timeline.to(lines, {
        yPercent: 0,
        autoAlpha: 1,
        duration: animationTokens.splitLines.duration,
        ease: animationTokens.splitLines.ease,
        stagger: animationTokens.splitLines.stagger,
        clearProps: "transform,opacity",
      });

      timelines.push(timeline);

      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: "top 90%",
          once: true,
          onEnter: () => timeline.play(0),
          invalidateOnRefresh: true,
        }),
      );
    });

    if (!reduceMotion) ScrollTrigger.refresh();

    return () => {
      triggers.forEach((trigger) => trigger.kill());
      timelines.forEach((timeline) => timeline.kill());
      splits.forEach((split) => split.revert());
    };
  }, scopeEl);
}
