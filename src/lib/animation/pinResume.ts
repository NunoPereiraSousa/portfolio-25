import { gsap, ScrollTrigger } from "./gsap";

export function createResumePin() {
  const sticky = document.querySelector(".resume-sticky") as HTMLElement | null;
  const section = document.querySelector(".resume") as HTMLElement | null;
  if (!sticky || !section) return undefined;

  const media = gsap.matchMedia();

  media.add(
    {
      desktop: "(min-width: 1024px) and (hover: hover) and (pointer: fine)",
      touch: "(max-width: 1023px), (hover: none), (pointer: coarse)",
    },
    (context) => {
      const { desktop } = context.conditions as { desktop?: boolean };

      if (!desktop) return;

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top-=50",
        end: "bottom bottom",
        pin: sticky,
        pinSpacing: true,
        invalidateOnRefresh: true,
      });

      return () => trigger.kill();
    },
  );

  return media;
}
