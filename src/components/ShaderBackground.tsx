// src/components/GuitarStringsCanvas.tsx
import { useEffect, useRef } from "react";

type Props = {
  className?: string;

  /** distance between vertical strings (px) */
  grid?: number;

  /** distance between horizontal strings (px) */
  rowGrid?: number;

  /** sample spacing along each string (px). higher = cheaper/smoother */
  step?: number;

  /** cap device pixel ratio for perf */
  dprCap?: number;

  /** idle fps when nothing is ringing */
  idleFps?: number;

  /** line base alpha */
  baseAlpha?: number;

};

export function GuitarStringsCanvas({
  className = "guitar-canvas",
  grid = 44,
  rowGrid = 120,
  step = 26,
  dprCap = 1.5,
  idleFps = 15,
  baseAlpha = 0.08,
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

    let w = 0,
      h = 0,
      dpr = 1;

    let raf = 0;
    let idleTimer: number | null = null;
    let running = true;

    const focus = {
      x: 0,
      y: 0,
      tx: 0,
      ty: 0,
      hasPointer: false,
    };

    const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

    const smoothstep = (e0: number, e1: number, x: number) => {
      const t = clamp01((x - e0) / (e1 - e0));
      return t * t * (3 - 2 * t);
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, dprCap);
      w = window.innerWidth;
      h = window.innerHeight;
      focus.x = w / 2;
      focus.y = h / 2;
      focus.tx = w / 2;
      focus.ty = h / 2;

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
      focus.tx = e.clientX;
      focus.ty = e.clientY;
      focus.hasPointer = true;
      if (running) scheduleNext(true);
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

    const getMeshMetrics = () => ({
      cx: w / 2,
      cy: h / 2,
      radius: Math.min(w, h) * 0.34,
      columnCount: Math.floor(w / grid) + 1,
      rowCount: Math.floor(h / rowGrid) + 1,
    });

    const idleDistortion = { depth: 0, ripple: 0, age: 99 };

    const getDistortionCenter = (impact: typeof idleDistortion) => {
      const pointerBlend = focus.hasPointer ? 0.72 : 0;
      const impactBlend = Math.max(0, 1 - smoothstep(0.65, 1.35, impact.age));
      const pointerWeight = pointerBlend * (1 - impactBlend * 0.65);
      const centerWeight = 1 - pointerWeight;

      return {
        x: focus.x * pointerWeight + (w / 2) * centerWeight,
        y: focus.y * pointerWeight + (h / 2) * centerWeight,
        pointerWeight,
      };
    };

    const projectMeshPoint = (
      u01: number,
      v: number,
      impact: typeof idleDistortion,
    ) => {
      const mesh = getMeshMetrics();
      const center = getDistortionCenter(impact);
      const x = u01 * w;
      const y = v * h;
      const dx = x - center.x;
      const dy = y - center.y;
      const dist = Math.hypot(dx, dy);
      const influence = Math.exp(-Math.pow(dist / mesh.radius, 2.15));
      const pocket = Math.pow(influence, 1.18);
      const rim = Math.exp(
        -Math.pow((dist - mesh.radius * 0.72) / (mesh.radius * 0.2), 2),
      );
      const waveCenter = Math.min(1.15, impact.age * 1.4);
      const normalizedDist = dist / mesh.radius;
      const rippleBand = Math.exp(
        -Math.pow((normalizedDist - waveCenter) / 0.16, 2),
      );
      const ripplePush = rippleBand * impact.ripple * mesh.radius * 0.035;
      const pointerDepth = center.pointerWeight * 0.34;
      const totalDepth = Math.max(
        impact.depth,
        pointerDepth,
      );
      const depthScale = 1 - pocket * 0.46 * totalDepth + rim * 0.06 * totalDepth;
      const verticalScale =
        1 - pocket * 0.36 * totalDepth + rim * 0.05 * totalDepth;
      const sag = pocket * mesh.radius * 0.38 * totalDepth;
      const bottomTension =
        Math.max(0, dy / mesh.radius) * pocket * mesh.radius * 0.18 * totalDepth;

      return {
        x: center.x + dx * depthScale + (dx / Math.max(dist, 0.001)) * ripplePush,
        y:
          center.y +
          dy * verticalScale +
          sag +
          bottomTension +
          (dy / Math.max(dist, 0.001)) * ripplePush,
      };
    };

    const drawVerticalLine = (
      lineIndex: number,
      lineCount: number,
      impact: typeof idleDistortion,
    ) => {
      ctx.strokeStyle = `rgba(255,255,255,${baseAlpha})`;

      const pts: { x: number; y: number }[] = [];
      const u01 = lineCount <= 1 ? 0.5 : lineIndex / (lineCount - 1);

      for (let v = 0; v <= 1; v += step / Math.max(1, h)) {
        const point = projectMeshPoint(u01, v, impact);
        pts.push(point);
      }

      strokeSmooth(pts);
    };

    const drawHorizontalLine = (
      rowIndex: number,
      rowCount: number,
      impact: typeof idleDistortion,
    ) => {
      ctx.strokeStyle = `rgba(255,255,255,${baseAlpha * 0.62})`;

      const pts: { x: number; y: number }[] = [];
      const v = rowCount <= 1 ? 0.5 : rowIndex / (rowCount - 1);

      for (let u = 0; u <= 1; u += step / Math.max(1, w)) {
        pts.push(projectMeshPoint(u, v, impact));
      }

      strokeSmooth(pts);
    };

    const renderFrame = () => {
      if (!running) return;

      ctx.clearRect(0, 0, w, h);

      const mesh = getMeshMetrics();
      const totalLines = mesh.columnCount;
      const totalRows = mesh.rowCount;
      const impact = idleDistortion;
      focus.x += (focus.tx - focus.x) * 0.08;
      focus.y += (focus.ty - focus.y) * 0.08;

      const focusActive =
        Math.abs(focus.tx - focus.x) + Math.abs(focus.ty - focus.y) > 0.5;

      for (let index = 0; index < totalLines; index += 1) {
        drawVerticalLine(index, totalLines, impact);
      }

      for (let index = 0; index < totalRows; index += 1) {
        drawHorizontalLine(index, totalRows, impact);
      }

      scheduleNext(focusActive);
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
    rowGrid,
    step,
    dprCap,
    idleFps,
    baseAlpha,
  ]);

  return <canvas ref={ref} className={className} />;
}
