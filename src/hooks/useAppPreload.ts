"use client";

import { useEffect, useMemo, useState } from "react";

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

function loadImage(src: string) {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve(); // never deadlock
    img.src = src;
  });
}

export function useAssetPreload(images: string[]) {
  const imagesKey = useMemo(() => images.join("|"), [images]);

  const [fontsReady, setFontsReady] = useState(false);
  const [loadedImgs, setLoadedImgs] = useState(0);

  useEffect(() => {
    let alive = true;
    setFontsReady(false);
    setLoadedImgs(0);

    // fonts
    (async () => {
      try {
        await (document as any).fonts?.ready;
      } catch {
        // ignore
      } finally {
        if (alive) setFontsReady(true);
      }
    })();

    // images (sequential = stable progress)
    (async () => {
      for (let i = 0; i < images.length; i++) {
        await loadImage(images[i]);
        if (!alive) return;
        setLoadedImgs(i + 1);
      }
    })();

    return () => {
      alive = false;
    };
  }, [imagesKey]);

  const imgProg = images.length ? loadedImgs / images.length : 1;

  // simple weights: 50% fonts + 50% images
  const progress = clamp01((fontsReady ? 0.5 : 0) + imgProg * 0.5);
  const loaded = fontsReady && imgProg >= 1;

  return { progress, loaded };
}
