import type { RefObject } from "react";
import { PRELOAD_TIMEOUT_MS } from "./config";
import {
  loadFonts,
  loadImage,
  waitForDomReady,
  waitForReadyRef,
  waitForSettledFrame,
  withTimeout,
} from "./loaders";

export type PreloadTask = {
  weight: number;
  run: () => Promise<void>;
};

export function createAppPreloadTasks(
  images: readonly string[],
  lenisReadyRef: RefObject<boolean>,
  isActive: () => boolean,
) {
  const imageTasks: PreloadTask[] = images.map((src) => ({
    weight: 1,
    run: () => loadImage(src),
  }));

  return [
    { weight: 0.5, run: waitForDomReady },
    { weight: 2, run: loadFonts },
    ...imageTasks,
    { weight: 1, run: () => waitForReadyRef(lenisReadyRef, isActive) },
    { weight: 0.5, run: waitForSettledFrame },
  ] satisfies PreloadTask[];
}

export function getAppPreloadWeight(images: readonly string[]) {
  return 4 + images.length;
}

export function runPreloadTask(task: PreloadTask) {
  return withTimeout(task.run(), PRELOAD_TIMEOUT_MS);
}

export function getPreloadWeight(tasks: PreloadTask[]) {
  return tasks.reduce((sum, task) => sum + task.weight, 0);
}
