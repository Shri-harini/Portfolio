"use client";

import { useCallback, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SiteNav from "./SiteNav";
import { NAV_HEIGHT, scrollToSection } from "./sections";

gsap.registerPlugin(ScrollTrigger);

export default function PortfolioShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeSection, setActiveSection] = useState("");

  const scrollTo = useCallback((id: string) => {
    scrollToSection(id);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const hero = document.querySelector('[aria-label="Introduction"]');
    if (!hero) return;

    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.45) {
          setActiveSection("");
        }
      },
      { threshold: [0.45, 0.6] }
    );
    heroObserver.observe(hero);

    const cards = document.querySelectorAll("[data-section]");
    const triggers: ScrollTrigger[] = [];

    cards.forEach((card) => {
      const num = card.getAttribute("data-section");
      if (!num) return;

      const trigger = ScrollTrigger.create({
        trigger: card,
        start: `top ${NAV_HEIGHT + 80}px`,
        end: "bottom center",
        onEnter: () => setActiveSection(num),
        onEnterBack: () => setActiveSection(num),
      });
      triggers.push(trigger);
    });

    return () => {
      heroObserver.disconnect();
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <>
      <SiteNav
        activeSection={activeSection}
        onNavigate={scrollTo}
        onScrollTop={scrollToTop}
      />
      {children}
    </>
  );
}
