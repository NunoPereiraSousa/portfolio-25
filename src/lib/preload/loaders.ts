import type { RefObject } from "react";
import { preloadManifest } from "./manifest";

export function withTimeout(task: Promise<void>, timeoutMs: number) {
  return new Promise<void>((resolve) => {
    const timeout = window.setTimeout(resolve, timeoutMs);

    task
      .catch(() => undefined)
      .finally(() => {
        window.clearTimeout(timeout);
        resolve();
      });
  });
}

export function loadImage(src: string) {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      if (typeof img.decode === "function") {
        img.decode().then(resolve).catch(resolve);
        return;
      }

      resolve();
    };
    img.onerror = () => resolve();
    img.src = src;
  });
}

export function loadFonts() {
  if (!document.fonts) return Promise.resolve();

  const fontLoads = preloadManifest.fonts.map(({ family, weight }) =>
    document.fonts.load(`${weight} 1em "${family}"`, "Nuno"),
  );

  return Promise.all(fontLoads)
    .then(() => document.fonts.ready)
    .then(() => undefined);
}

export function waitForDomReady() {
  if (document.readyState !== "loading") return Promise.resolve();

  return new Promise<void>((resolve) => {
    document.addEventListener("DOMContentLoaded", () => resolve(), {
      once: true,
    });
  });
}

export function waitForSettledFrame() {
  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => resolve());
    });
  });
}

export function waitForReadyRef(
  readyRef: RefObject<boolean>,
  isActive: () => boolean,
) {
  if (readyRef.current) return Promise.resolve();

  return new Promise<void>((resolve) => {
    const check = () => {
      if (!isActive()) return;

      if (readyRef.current) {
        resolve();
        return;
      }

      window.requestAnimationFrame(check);
    };

    check();
  });
}
