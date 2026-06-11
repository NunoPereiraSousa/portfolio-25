"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  createAppPreloadTasks,
  getAppPreloadWeight,
  runPreloadTask,
} from "@/lib/preload/tasks";

type PreloadOptions = {
  images: readonly string[];
  lenisReady: boolean;
};

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export function useAssetPreload({ images, lenisReady }: PreloadOptions) {
  const imagesKey = useMemo(() => images.join("|"), [images]);
  const lenisReadyRef = useRef(lenisReady);

  const [completedWeight, setCompletedWeight] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    lenisReadyRef.current = lenisReady;
  }, [lenisReady]);

  useEffect(() => {
    let alive = true;

    const tasks = createAppPreloadTasks(images, lenisReadyRef, () => alive);

    window.queueMicrotask(() => {
      if (!alive) return;

      setCompletedWeight(0);
      setLoaded(false);
    });

    (async () => {
      let nextCompletedWeight = 0;

      await Promise.all(
        tasks.map(async (task) => {
          await runPreloadTask(task);

          if (!alive) return;

          nextCompletedWeight += task.weight;
          setCompletedWeight(nextCompletedWeight);
        }),
      );

      if (alive) setLoaded(true);
    })();

    return () => {
      alive = false;
    };
  }, [images, imagesKey]);

  const totalWeight = getAppPreloadWeight(images);
  const progress = loaded ? 1 : clamp01(completedWeight / totalWeight);

  return { progress, loaded };
}
