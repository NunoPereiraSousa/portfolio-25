import Lenis from "lenis";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useLenis() {
  useEffect(() => {
    const prefersReduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    )?.matches;
    const isMobile =
      window.matchMedia?.("(max-width: 767px)")?.matches ||
      window.matchMedia?.("(hover: none), (pointer: coarse)")?.matches;
    if (prefersReduced || isMobile) return;

    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1,
    });

    // ✅ tell ScrollTrigger to update on Lenis scroll
    lenis.on("scroll", ScrollTrigger.update);

    // ✅ drive Lenis from GSAP's ticker (instead of requestAnimationFrame loop)
    const tick = (time: number) => {
      lenis.raf(time * 1000); // gsap ticker time is seconds, lenis expects ms
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Optional but often helps on mobile
    ScrollTrigger.config({ ignoreMobileResize: true });

    // (If you ever use ScrollSmoother, you'd also use scrollerProxy here, but with Lenis this is usually enough.)

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
}
