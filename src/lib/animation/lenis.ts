import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";
import { prefersReducedMotion } from "./motion";

export function shouldUseNativeScroll() {
  const isMobile =
    window.matchMedia?.("(max-width: 767px)")?.matches ||
    window.matchMedia?.("(hover: none), (pointer: coarse)")?.matches;

  return Boolean(prefersReducedMotion() || isMobile);
}

export function createLenisScroll() {
  const lenis = new Lenis({
    lerp: 0.08,
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1,
  });

  lenis.on("scroll", ScrollTrigger.update);

  const tick = (time: number) => {
    lenis.raf(time * 1000);
  };

  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tick);
    lenis.destroy();
  };
}
