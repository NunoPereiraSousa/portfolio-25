import { useLayoutEffect } from "react";
import { createResumePin } from "../lib/animation/pinResume";

export function usePinResume(enabled: boolean) {
  useLayoutEffect(() => {
    if (!enabled) return;

    const media = createResumePin();

    return () => media?.revert();
  }, [enabled]);
}
