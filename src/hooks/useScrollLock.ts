// src/hooks/useScrollLock.ts
"use client";

import { useEffect, useRef } from "react";

export function useScrollLock(locked: boolean) {
  const yRef = useRef(0);

  useEffect(() => {
    if (!locked) return;

    yRef.current = window.scrollY || 0;

    // Lock body (works for native scroll)
    const body = document.body;
    const html = document.documentElement;

    const prevBody = body.getAttribute("style") || "";
    const prevHtml = html.getAttribute("style") || "";

    body.style.position = "fixed";
    body.style.top = `-${yRef.current}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";

    html.style.scrollBehavior = "auto";

    return () => {
      body.setAttribute("style", prevBody);
      html.setAttribute("style", prevHtml);

      // restore scroll position (we'll override to top if you want)
      window.scrollTo(0, yRef.current);
    };
  }, [locked]);
}
