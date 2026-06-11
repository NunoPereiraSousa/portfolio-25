"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/animation/gsap";
import { prefersReducedMotion } from "@/lib/animation/motion";
import { animationTokens } from "@/lib/animation/tokens";

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

type Props = {
  progress: number; // 0..1
  loaded: boolean; // true when fonts+images finished
  onDone?: () => void;
  startDelayMs?: number; // default 1000
  endHoldMs?: number; // default 1000
};

export function Preloader({
  progress,
  loaded,
  onDone,
  startDelayMs = 1000,
  endHoldMs = 1000,
}: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const [started, setStarted] = useState(startDelayMs === 0);
  const [pctText, setPctText] = useState(0);

  const exitingRef = useRef(false);
  const endTimerRef = useRef<number | null>(null);

  // GSAP-driven number
  const numRef = useRef({ pct: 0 });

  // 1) start delay (hold at 0)
  useEffect(() => {
    if (started) return;

    numRef.current.pct = 0;

    const t = window.setTimeout(() => setStarted(true), startDelayMs);
    return () => window.clearTimeout(t);
  }, [started, startDelayMs]);

  // 2) smooth counter updates (after started)
  useEffect(() => {
    if (!started) return;
    if (exitingRef.current) return;

    const numberTarget = numRef.current;
    const target = loaded ? 100 : Math.round(clamp01(progress) * 100);

    gsap.to(numberTarget, {
      pct: target,
      duration: animationTokens.preloader.countDuration,
      ease: animationTokens.preloader.countEase,
      overwrite: true,
      onUpdate: () => setPctText(Math.round(numberTarget.pct)),
    });

    return () => {
      gsap.killTweensOf(numberTarget);
    };
  }, [progress, loaded, started]);

  // 3) exit sequence: loaded -> force 100 -> wait -> fade
  useEffect(() => {
    if (!started) return;
    if (!loaded) return;
    if (exitingRef.current) return;

    exitingRef.current = true;
    const numberTarget = numRef.current;

    gsap.to(numberTarget, {
      pct: 100,
      duration: animationTokens.preloader.completeCountDuration,
      ease: animationTokens.preloader.countEase,
      overwrite: true,
      onUpdate: () => setPctText(Math.round(numberTarget.pct)),
      onComplete: () => {
        endTimerRef.current = window.setTimeout(() => {
          const el = wrapRef.current;
          if (!el) {
            onDone?.();
            return;
          }

          if (prefersReducedMotion()) {
            gsap.set(el, { autoAlpha: 0 });
            onDone?.();
            return;
          }

          const tl = gsap.timeline({ onComplete: () => onDone?.() });
          tl.to(el, {
            autoAlpha: 0,
            duration: animationTokens.preloader.exitDuration,
            ease: animationTokens.preloader.exitEase,
          });
        }, endHoldMs);
      },
    });

    return () => {
      gsap.killTweensOf(numberTarget);
      if (endTimerRef.current !== null) {
        window.clearTimeout(endTimerRef.current);
        endTimerRef.current = null;
      }
    };
  }, [loaded, started, endHoldMs, onDone]);

  return (
    <div
      ref={wrapRef}
      className="preloader"
      role="status"
      aria-label={`Loading ${pctText}%`}
      aria-live="polite"
    >
      <div className="preloader-wrapper" aria-hidden="true">
        <span className="preloader-number">{pctText}</span>
        <span className="preloader-percentage">%</span>
      </div>
    </div>
  );
}
