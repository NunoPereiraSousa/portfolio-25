import { preloadImages } from "@/app/appAssets";

export type FontPreloadRequest = {
  family: string;
  weight: string;
};

export const preloadManifest = {
  fonts: [
    { family: "PP Neue Montreal", weight: "400" },
    { family: "PP Neue Montreal", weight: "500" },
    { family: "PP Neue Montreal", weight: "700" },
    { family: "Rand Mono", weight: "400" },
    { family: "Rand Mono", weight: "800" },
  ] satisfies FontPreloadRequest[],
  images: preloadImages,
} as const;
