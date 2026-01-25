import Lenis from "lenis";
import { useEffect } from "react";

export function useLenis({ infinite = false }: { infinite?: boolean } = {}) {
  useEffect(() => {
    const prefersReduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    )?.matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1,

      // Optional
      infinite, // wraps scroll so after bottom you go back to top :contentReference[oaicite:1]{index=1}
      syncTouch: infinite, // recommended for touch when infinite is enabled :contentReference[oaicite:2]{index=2}
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [infinite]);
}
