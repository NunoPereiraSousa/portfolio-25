import { useEffect, useRef, useState } from "react";
import {
  DesktopBackgroundLines,
  MobileBackgroundLines,
} from "@/components/layout/BackgroundLines";
import { Preloader } from "@/components/Preloader";
import { AboutSection } from "@/features/home/AboutSection";
import { FooterSection } from "@/features/home/FooterSection";
import { HeroSection } from "@/features/home/HeroSection";
import { HighlightsSection } from "@/features/home/HighlightsSection";
import { ResumeSection } from "@/features/home/ResumeSection";
import { useAssetPreload } from "@/hooks/useAppPreload";
import { useLenis } from "@/hooks/useLenis";
import { usePageReveal } from "@/hooks/usePageReveal";
import { usePinResume } from "@/hooks/usePinResume";
import { useScrollLock } from "@/hooks/useScrollLock";
import { useSplitLinesOnScroll } from "@/hooks/useSplitLinesOnScroll";
import { preloadManifest } from "@/lib/preload/manifest";

export default function App() {
  const lenisReady = useLenis();
  const [ready, setReady] = useState(false);
  const [splitReady, setSplitReady] = useState(false);
  const pageRef = useRef<HTMLDivElement | null>(null);

  const { progress, loaded } = useAssetPreload({
    images: preloadManifest.images,
    lenisReady,
  });

  useSplitLinesOnScroll(splitReady, pageRef);
  usePinResume(ready);
  usePageReveal(ready, pageRef);
  useScrollLock(!ready);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.scrollTo(0, 0);
  }, [ready]);

  useEffect(() => {
    if (!ready) return;

    const timer = window.setTimeout(() => {
      setSplitReady(true);
    }, 950);

    return () => window.clearTimeout(timer);
  }, [ready]);

  return (
    <div
      className={`app-shell ${ready ? "app-shell--ready" : ""} ${
        splitReady ? "app-shell--text-ready" : ""
      }`}
    >
      {!ready && (
        <Preloader
          progress={progress}
          loaded={loaded}
          startDelayMs={450}
          endHoldMs={500}
          onDone={() => setReady(true)}
        />
      )}

      {ready && <DesktopBackgroundLines />}

      <div ref={pageRef}>
        {ready && <MobileBackgroundLines />}

        <main className="page">
          <HeroSection />
          <HighlightsSection />
          <AboutSection />
          <ResumeSection />
          <FooterSection />
        </main>
      </div>
    </div>
  );
}
