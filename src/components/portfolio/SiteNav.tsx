"use client";

import { portfolioSections } from "./sections";
import styles from "./SiteNav.module.css";

interface SiteNavProps {
  activeSection: string;
  onNavigate: (id: string) => void;
  onScrollTop: () => void;
}

export default function SiteNav({
  activeSection,
  onNavigate,
  onScrollTop,
}: SiteNavProps) {
  return (
    <nav className={styles.siteNav} aria-label="Section navigation">
      <div className={styles.navItems}>
        {portfolioSections.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`${styles.navItem} ${activeSection === s.num ? styles.navActive : ""}`}
            onClick={() => onNavigate(s.id)}
          >
            <span className={styles.navNum}>{s.num}</span>
            <span className={styles.navLabel}>{s.nav}</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        className={styles.scrollTopBtn}
        onClick={onScrollTop}
        aria-label="Scroll to top"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M12 19V5M12 5l-6 6M12 5l6 6" />
        </svg>
      </button>
    </nav>
  );
}
