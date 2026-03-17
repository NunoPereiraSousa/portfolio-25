// src/components/GuitarStringsCanvas.tsx
import { useEffect, useRef } from "react";

type Props = {
  className?: string;

  /** distance between vertical strings (px) */
  grid?: number;

  /** sample spacing along each string (px). higher = cheaper/smoother */
  step?: number;

  /** how close the cursor must be to pluck a string (px) */
  threshold?: number;

  /** maximum bend (px) near the touch point */
  maxAmp?: number;

  /** cap device pixel ratio for perf */
  dprCap?: number;

  /** how wide the bend spreads around the touch point (0.10–0.30) */
  touchWidth?: number;

  /** idle fps when nothing is ringing */
  idleFps?: number;

  /** line base alpha */
  baseAlpha?: number;

  /** extra alpha when plucked */
  glowAlpha?: number;
};

export function GuitarStringsCanvas({
  className = "guitar-canvas",
  grid = 44,
  step = 26,
  threshold = 12,
  maxAmp = 18,
  dprCap = 1.5,
  touchWidth = 0.16,
  idleFps = 15,
  baseAlpha = 0.08,
  glowAlpha = 0.12,
}: Props) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    )?.matches;
    if (prefersReduced) return;

    const canvas = ref.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // ======= TUNE THESE =======
    const DECAY = 2.1; // lower = longer ring
    const ATTACK = 7.0; // lower = softer ease-in
    const OMEGA = 16.0; // oscillation speed
    const COOLDOWN_MS = 120;
    const MAX_IMP = 2;

    // Soft edge damping: set EDGE_MIN to 1.0 for no damping at edges
    const EDGE_MIN = 0.55; // 0.4..1.0
    const EDGE_FADE = 0.08; // how much of the top/bottom fades (0.05..0.12)
    // ==========================

    let w = 0,
      h = 0,
      dpr = 1;

    let raf = 0;
    let idleTimer: number | null = null;
    let running = true;

    const start = performance.now();

    type Imp = { t0: number; A: number; dir: number; y0: number };
    const impulses = new Map<number, Imp[]>();
    const lastHit = new Map<string, number>();

    const mouse = {
      x: -9999,
      y: -9999,
      prevX: -9999,
      vx: 0,
      lx: 0,
      lt: 0,
    };

    const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

    const smoothstep = (e0: number, e1: number, x: number) => {
      const t = clamp01((x - e0) / (e1 - e0));
      return t * t * (3 - 2 * t);
    };

    const envelope = (age: number) =>
      (1 - Math.exp(-ATTACK * age)) * Math.exp(-DECAY * age);

    const canHit = (key: string) => {
      const now = performance.now();
      const last = lastHit.get(key) || 0;
      if (now - last < COOLDOWN_MS) return false;
      lastHit.set(key, now);
      return true;
    };

    const addImpulse = (xLine: number, imp: Imp) => {
      const arr = impulses.get(xLine) || [];
      arr.unshift(imp);
      if (arr.length > MAX_IMP) arr.length = MAX_IMP;
      impulses.set(xLine, arr);
    };

    const cleanup = (t: number) => {
      for (const [x, arr] of impulses.entries()) {
        const next = arr.filter((i) => t - i.t0 < 1.6);
        if (next.length) impulses.set(x, next);
        else impulses.delete(x);
      }
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, dprCap);
      w = window.innerWidth;
      h = window.innerHeight;

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    };

    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      const dt = Math.max(0.001, (now - mouse.lt) / 1000);
      const nx = e.clientX;

      mouse.vx = (nx - mouse.lx) / dt;

      mouse.prevX = mouse.x;
      mouse.x = nx;
      mouse.y = e.clientY;

      mouse.lx = nx;
      mouse.lt = now;
    };

    const onVisibility = () => {
      running = !document.hidden;
      if (running) scheduleNext(true);
    };

    // Smooth curve drawing (no zig-zag)
    const strokeSmooth = (points: { x: number; y: number }[]) => {
      if (points.length < 2) return;

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);

      for (let i = 1; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }

      const last = points[points.length - 1];
      ctx.lineTo(last.x, last.y);
      ctx.stroke();
    };

    const drawVerticalLine = (xLine: number, t: number) => {
      const arr = impulses.get(xLine);

      // glow based on strongest active impulse
      let hit = 0;
      if (arr) {
        for (const imp of arr) {
          hit = Math.max(hit, envelope(Math.max(0, t - imp.t0)));
        }
      }

      const alpha = baseAlpha + glowAlpha * hit;
      ctx.strokeStyle = `rgba(255,255,255,${alpha})`;

      const pts: { x: number; y: number }[] = [];

      for (let y = 0; y <= h; y += step) {
        const yn = y / h;

        // Soft edge damping (optional)
        const edge =
          EDGE_MIN +
          (1 - EDGE_MIN) *
            (smoothstep(0.0, EDGE_FADE, yn) *
              smoothstep(0.0, EDGE_FADE, 1.0 - yn));

        let ox = 0;

        if (arr) {
          for (const imp of arr) {
            const age = Math.max(0, t - imp.t0);
            const env = envelope(age);

            // ✅ Key: bend centered at touch y0 (works at top/bottom too)
            const local = Math.exp(-Math.pow((yn - imp.y0) / touchWidth, 2));

            // time oscillation (+ tiny harmonic)
            const w1 = Math.sin(OMEGA * age);
            const w2 = 0.22 * Math.sin(OMEGA * 2.02 * age + 0.6);

            const shape = local * edge;

            ox += imp.dir * imp.A * shape * (w1 + w2) * env;
          }
        }

        pts.push({ x: xLine + ox, y });
      }

      strokeSmooth(pts);
    };

    const maybePluck = (t: number) => {
      // require some movement so it feels like you "hit" the string
      const speed = Math.abs(mouse.vx);
      if (speed < 70) return;

      const xLine = Math.round(mouse.x / grid) * grid;
      const dx = Math.abs(mouse.x - xLine);

      // pluck only when crossing the line
      const crossed =
        (mouse.prevX < xLine && mouse.x >= xLine) ||
        (mouse.prevX > xLine && mouse.x <= xLine);

      if (!crossed) return;

      // amplitude depends on speed + proximity
      const proximity = 1 - Math.min(1, dx / threshold);
      const baseAmp = Math.min(maxAmp, Math.max(2.0, (speed / 2000) * maxAmp));
      const amp = baseAmp * (0.35 + 0.65 * proximity);

      if (dx <= threshold) {
        const key = `v:${xLine}`;
        if (canHit(key)) {
          const y0 = clamp01(mouse.y / h);
          addImpulse(xLine, {
            t0: t,
            A: amp,
            dir: mouse.vx >= 0 ? 1 : -1,
            y0,
          });
        }
      }
    };

    const renderFrame = () => {
      if (!running) return;

      const t = (performance.now() - start) / 1000;

      ctx.clearRect(0, 0, w, h);

      maybePluck(t);

      for (let x = 0; x <= w; x += grid) {
        drawVerticalLine(x, t);
      }

      cleanup(t);

      scheduleNext(impulses.size > 0);
    };

    const scheduleNext = (fast: boolean) => {
      if (idleTimer) {
        window.clearTimeout(idleTimer);
        idleTimer = null;
      }

      if (fast) {
        raf = requestAnimationFrame(renderFrame);
      } else {
        idleTimer = window.setTimeout(() => {
          raf = requestAnimationFrame(renderFrame);
        }, 1000 / idleFps);
      }
    };

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    resize();
    scheduleNext(true);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      if (idleTimer) window.clearTimeout(idleTimer);

      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [
    grid,
    step,
    threshold,
    maxAmp,
    dprCap,
    touchWidth,
    idleFps,
    baseAlpha,
    glowAlpha,
  ]);

  return <canvas ref={ref} className={className} />;
}
