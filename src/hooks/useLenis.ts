import { useEffect, useState } from "react";
import { featureFlags } from "@/config/featureFlags";
import { createLenisScroll, shouldUseNativeScroll } from "@/lib/animation/lenis";

export function useLenis() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!featureFlags.lenisScroll || shouldUseNativeScroll()) {
      const readyFrame = window.requestAnimationFrame(() => {
        setReady(true);
      });

      return () => window.cancelAnimationFrame(readyFrame);
    }

    const cleanupLenis = createLenisScroll();
    const readyFrame = window.requestAnimationFrame(() => {
      setReady(true);
    });

    return () => {
      window.cancelAnimationFrame(readyFrame);
      cleanupLenis();
    };
  }, []);

  return ready;
}
