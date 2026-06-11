import { useEffect, type RefObject } from "react";
import { gsap } from "@/lib/animation/gsap";
import { prefersReducedMotion } from "@/lib/animation/motion";
import { animationTokens } from "@/lib/animation/tokens";

export function usePageReveal(
  ready: boolean,
  pageRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const el = pageRef.current;
    if (!el) return;

    gsap.set(el, { autoAlpha: 0 });
  }, [pageRef]);

  useEffect(() => {
    if (!ready) return;

    const el = pageRef.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      gsap.set(el, { autoAlpha: 1, clearProps: "opacity,visibility" });
      return;
    }

    gsap.to(el, {
      autoAlpha: 1,
      duration: animationTokens.pageReveal.duration,
      ease: animationTokens.pageReveal.ease,
      clearProps: "opacity,visibility",
    });
  }, [pageRef, ready]);
}
