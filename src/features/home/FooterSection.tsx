import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { FooterMark } from "@/components/marks/FooterMark";
import { SectionHeader } from "@/components/SectionHeader";
import { featureFlags } from "@/config/featureFlags";
import { footerContent } from "@/data";
import { prefersReducedMotion } from "@/lib/animation/motion";

const FooterMarkDeform = lazy(() =>
  import("@/components/FooterMarkWebGL").then((module) => ({
    default: module.FooterMarkDeform,
  })),
);

function preloadFooterMarkWebGL() {
  void import("@/components/FooterMarkWebGL");
}

export function FooterSection() {
  const [enableWebGLMark, setEnableWebGLMark] = useState(false);
  const [footerMarkInRange, setFooterMarkInRange] = useState(false);
  const footerMarkRef = useRef<HTMLDivElement | null>(null);
  const footerMark = <FooterMark />;

  useEffect(() => {
    const readyFrame = window.requestAnimationFrame(() => {
      const finePointer = window.matchMedia?.(
        "(min-width: 1024px) and (hover: hover) and (pointer: fine)",
      )?.matches;

      setEnableWebGLMark(
        Boolean(
          featureFlags.footerWebGLMark &&
            finePointer &&
            !prefersReducedMotion(),
        ),
      );
    });

    return () => window.cancelAnimationFrame(readyFrame);
  }, []);

  useEffect(() => {
    if (!enableWebGLMark) return;

    const scheduleIdle =
      window.requestIdleCallback ??
      ((callback: IdleRequestCallback) =>
        window.setTimeout(() => callback({ didTimeout: false, timeRemaining: () => 0 }), 1));

    const cancelIdle =
      window.cancelIdleCallback ??
      ((id: number) => window.clearTimeout(id));

    const idleId = scheduleIdle(preloadFooterMarkWebGL, { timeout: 2500 });

    return () => cancelIdle(idleId);
  }, [enableWebGLMark]);

  useEffect(() => {
    const el = footerMarkRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;

        setFooterMarkInRange(true);
        observer.disconnect();
      },
      { rootMargin: "1400px 0px" },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <footer className="footer">
      <SectionHeader text={"Contacts"} />

      <h2 className="footer-title" data-split="lines">
        {footerContent.title}
      </h2>

      <p className="footer-label" data-split="lines">
        {footerContent.label}
      </p>

      <div className="footer-list">
        {footerContent.links.map((link) => (
          <div className="footer-list-item" key={link.href}>
            <span></span>
            <a href={link.href} target="_blank" rel="noreferrer">
              {link.label}
            </a>
            <span></span>
          </div>
        ))}
      </div>

      <div className="footer-svg">
        <div ref={footerMarkRef}>
          {enableWebGLMark && footerMarkInRange ? (
            <Suspense
              fallback={<div className="footer-svg-mark">{footerMark}</div>}
            >
              <FooterMarkDeform
                className="footer-svg-mark"
                fallback={footerMark}
              />
            </Suspense>
          ) : (
            <div className="footer-svg-mark">{footerMark}</div>
          )}
        </div>

        <p className="footer-paragraph">{footerContent.markLabel}</p>

        <p className="footer-paragraph">{footerContent.credit}</p>
      </div>
    </footer>
  );
}
