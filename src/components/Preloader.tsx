"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

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
    setPctText(0);

    const t = window.setTimeout(() => setStarted(true), startDelayMs);
    return () => window.clearTimeout(t);
  }, [started, startDelayMs]);

  // 2) smooth counter updates (after started)
  useEffect(() => {
    if (!started) return;
    if (exitingRef.current) return;

    const target = loaded ? 100 : Math.round(clamp01(progress) * 100);

    gsap.to(numRef.current, {
      pct: target,
      duration: 0.45,
      ease: "power3.out",
      overwrite: true,
      onUpdate: () => setPctText(Math.round(numRef.current.pct)),
    });

    return () => {
      gsap.killTweensOf(numRef.current);
    };
  }, [progress, loaded, started]);

  // 3) exit sequence: loaded -> force 100 -> wait -> fade
  useEffect(() => {
    if (!started) return;
    if (!loaded) return;
    if (exitingRef.current) return;

    exitingRef.current = true;

    gsap.to(numRef.current, {
      pct: 100,
      duration: 0.35,
      ease: "power3.out",
      overwrite: true,
      onUpdate: () => setPctText(Math.round(numRef.current.pct)),
      onComplete: () => {
        endTimerRef.current = window.setTimeout(() => {
          const el = wrapRef.current;
          if (!el) {
            onDone?.();
            return;
          }

          gsap.to(el, {
            autoAlpha: 0,
            duration: 0.6,
            ease: "power2.out",
            onComplete: () => onDone?.(),
          });
        }, endHoldMs);
      },
    });

    return () => {
      gsap.killTweensOf(numRef.current);
      if (endTimerRef.current !== null) {
        window.clearTimeout(endTimerRef.current);
        endTimerRef.current = null;
      }
    };
  }, [loaded, started, endHoldMs, onDone]);

  return (
    <div ref={wrapRef} className="preloader">
      <div className="preloader-wrapper">
        <span className="preloader-number">{pctText}</span>
        <span className="preloader-percentage">%</span>
      </div>
    </div>
  );
}
