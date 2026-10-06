"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hero video with lazy loading via IntersectionObserver.
 *
 * Shows the poster immediately (for fast LCP), and only starts downloading
 * the video when the component enters the viewport. This avoids the 2.8MB
 * video competing with critical resources on initial load.
 */
export function HeroVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Start loading video when it's near the viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" }, // Start loading 200px before visible
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (shouldLoad && videoRef.current) {
      videoRef.current.load();
      void videoRef.current.play().catch(() => {
        // Autoplay may be blocked by browser — that's fine, poster is shown
      });
    }
  }, [shouldLoad]);

  return (
    <div ref={containerRef}>
      <video
        ref={videoRef}
        data-hero-video=""
        className="relative z-10 w-full rounded-xl border border-white/10 bg-paper object-cover shadow-[0_28px_80px_rgba(0,0,0,0.4)]"
        poster="/product/hero-demo-poster.jpg"
        style={{ aspectRatio: "1400 / 1034" }}
        width={1400}
        height={1034}
        muted
        loop
        playsInline
        preload="none"
        aria-label="Demonstracao da plataforma Lotti"
      >
        {shouldLoad && (
          <source src="/product/hero-demo.mp4" type="video/mp4" />
        )}
      </video>
    </div>
  );
}
