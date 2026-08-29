"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Scroll-position-driven reveal for elements marked with `data-reveal`
 * inside this wrapper. Use for content genuinely tied to scroll position
 * (staggered section reveals); use FadeIn/StaggerChildren (Motion) for
 * simple one-shot "fade up when it enters the viewport" needs instead.
 * See PLAN.md, "Animation Architecture" for the full division of labor.
 */
export function GsapScrollReveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const targets = container.current?.querySelectorAll("[data-reveal]");
      if (!targets || targets.length === 0) return;

      gsap.from(targets, {
        y: 60,
        opacity: 0,
        stagger: 0.15,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: container }
  );

  return (
    <div ref={container} className={className}>
      {children}
    </div>
  );
}
