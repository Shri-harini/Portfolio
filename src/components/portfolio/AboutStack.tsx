"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "@/data/profile";
import SectionCard from "./SectionCard";
import styles from "./AboutStack.module.css";

gsap.registerPlugin(ScrollTrigger);

const skillCategoryClass: Record<string, string> = {
  languages: styles.skillGroupLanguages,
  frameworks: styles.skillGroupFrameworks,
  tools: styles.skillGroupTools,
  cloud: styles.skillGroupCloud,
  practices: styles.skillGroupPractices,
};

function highlightText(text: string, highlights: readonly string[]) {
  const pattern = new RegExp(
    `(${highlights.map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "g"
  );
  const parts = text.split(pattern);

  return parts.map((part, i) =>
    highlights.includes(part) ? (
      <span key={`${part}-${i}`} className={styles.highlight}>
        {part}
      </span>
    ) : (
      part
    )
  );
}

export default function AboutStack() {
  const stackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stack = stackRef.current;
    if (!stack) return;

    const cards = stack.querySelectorAll("[data-section]");

    cards.forEach((card) => {
      gsap.fromTo(
        card.querySelector("[data-card-inner]"),
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger && stack.contains(t.trigger as Node)) t.kill();
      });
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <div ref={stackRef} className={styles.stack}>
        <SectionCard
          id="about"
          sectionNum="01"
          breadcrumb="About · Profile"
          title="Who I Am"
        >
          <p className={styles.paragraph}>
            {highlightText(profile.whoIAm.text, profile.whoIAm.highlights)}
          </p>
          <div className={styles.tagRow}>
            {profile.whoIAm.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          id="skills"
          sectionNum="02"
          breadcrumb="About · Arsenal"
          title="Technical Skills"
        >
          <div className={styles.skillsGrid}>
            {Object.entries(profile.skills).map(([category, items]) => (
              <div
                key={category}
                className={`${styles.skillGroup} ${skillCategoryClass[category] ?? ""}`}
              >
                <h3 className={styles.skillCategory}>
                  {category.replace(/([A-Z])/g, " $1").trim()}
                </h3>
                <div className={styles.skillTags}>
                  {items.map((item) => (
                    <span key={item} className={styles.skillTag}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          id="education"
          sectionNum="03"
          breadcrumb="About · Journey"
          title="Education"
        >
          <ul className={styles.eduList}>
            {profile.education.map((edu) => (
              <li key={edu.degree} className={styles.eduItem}>
                <span className={styles.eduDate}>{edu.date}</span>
                <div className={styles.eduContent}>
                  <h3 className={styles.eduDegree}>{edu.degree}</h3>
                  <p className={styles.eduSchool}>{edu.school}</p>
                  <p className={styles.eduScore}>{edu.score}</p>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          id="stats"
          sectionNum="04"
          breadcrumb="About · Impact"
          title="By The Numbers"
        >
          <div className={styles.statsGrid}>
            {profile.stats.map((stat) => (
              <div key={stat.label} className={styles.statItem}>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          id="experience"
          sectionNum="05"
          breadcrumb="About · Career"
          title="Experience"
        >
          <ul className={styles.expList}>
            {profile.experience.map((exp) => (
              <li key={exp.role + exp.date} className={styles.expItem}>
                <span className={styles.expDate}>{exp.date}</span>
                <div className={styles.expContent}>
                  <h3 className={styles.expRole}>{exp.role}</h3>
                  <p className={styles.expCompany}>{exp.company}</p>
                  <ul className={styles.expPoints}>
                    {exp.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          id="projects"
          sectionNum="06"
          breadcrumb="About · Work"
          title="Projects"
        >
          <div className={styles.projectGrid}>
            {profile.projects.map((project) => (
              <article key={project.title} className={styles.projectCard}>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <p className={styles.projectStack}>{project.stack}</p>
                <p className={styles.projectDesc}>{project.description}</p>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          id="contact"
          sectionNum="07"
          breadcrumb="About · Connect"
          title="Get In Touch"
        >
          <p className={styles.paragraph}>
            Based in {profile.location}. Open to full-time roles, collaborations,
            and interesting engineering challenges.
          </p>
          <div className={styles.contactLinks}>
            <a href={`mailto:${profile.email}`} className={styles.contactLink}>
              {profile.email}
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactLink}
            >
              LinkedIn
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactLink}
            >
              GitHub
            </a>
            <a href={profile.resumeUrl} download className={styles.contactLink}>
              Download Resume
            </a>
            <span className={styles.contactLink}>{profile.phone}</span>
          </div>
          <div className={styles.certRow}>
            {profile.certifications.slice(0, 4).map((cert) => (
              <span key={cert} className={styles.certTag}>
                {cert}
              </span>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
