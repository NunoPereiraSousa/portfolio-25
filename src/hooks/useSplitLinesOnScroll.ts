"use client";

import { useLayoutEffect, type RefObject } from "react";
import { createSplitLinesOnScroll } from "@/lib/animation/splitLines";

export function useSplitLinesOnScroll(
  enabled: boolean,
  scopeRef?: RefObject<HTMLElement | null>,
) {
  useLayoutEffect(() => {
    if (!enabled) return;

    const scopeEl = scopeRef?.current ?? document.body;
    const ctx = createSplitLinesOnScroll(scopeEl);

    return () => ctx.revert();
  }, [enabled, scopeRef]);
}
