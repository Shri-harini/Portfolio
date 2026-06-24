export const NAV_HEIGHT = 56;

export const portfolioSections = [
  { id: "about", num: "01", nav: "About" },
  { id: "skills", num: "02", nav: "Skills" },
  { id: "education", num: "03", nav: "Education" },
  { id: "stats", num: "04", nav: "Impact" },
  { id: "experience", num: "05", nav: "Experience" },
  { id: "projects", num: "06", nav: "Projects" },
  { id: "contact", num: "07", nav: "Contact" },
] as const;

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  const top = el.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT - 8;
  window.scrollTo({ top, behavior: "smooth" });
}
