import styles from './ProjectGrid.module.css';

interface ProjectGridProps {
  children: React.ReactNode;
}

export function ProjectGrid({ children }: ProjectGridProps) {
  return <div className={styles.projectGrid}>{children}</div>;
}
