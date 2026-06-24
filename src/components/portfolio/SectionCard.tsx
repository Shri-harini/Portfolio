import styles from "./SectionCard.module.css";

interface SectionCardProps {
  id: string;
  sectionNum: string;
  breadcrumb: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function SectionCard({
  id,
  sectionNum,
  breadcrumb,
  title,
  children,
  className = "",
}: SectionCardProps) {
  return (
    <article
      id={id}
      className={`${styles.card} ${className}`}
      data-section={sectionNum}
    >
      <div className={styles.cardInner} data-card-inner>
        <header className={styles.cardHeader}>
          <p className={styles.breadcrumb}>{breadcrumb}</p>
          <span className={styles.sectionNum} aria-hidden="true">
            {sectionNum}
          </span>
        </header>

        <h2 className={styles.title}>{title}</h2>
        <div className={styles.body}>{children}</div>
      </div>
    </article>
  );
}
