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

    const mm = gsap.matchMedia();

    mm.add(
      {
        // ✅ pin only when it makes sense
        desktop: "(min-width: 1024px) and (hover: hover) and (pointer: fine)",
        // ✅ mobile/tablet: no pin
        touch: "(max-width: 1023px), (hover: none), (pointer: coarse)",
      },
      (context) => {
        const { desktop } = context.conditions as { desktop?: boolean };

        if (!desktop) return; // ✅ do nothing on phone

        const st = ScrollTrigger.create({
          trigger: section,
          start: "top top-=50",
          end: "bottom bottom",
          pin: sticky,
          pinSpacing: true,
          invalidateOnRefresh: true,
        });

        return () => st.kill();
      },
    );

    return () => mm.revert();
  }, [enabled]);
}
