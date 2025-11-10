import styles from './ProjectGrid.module.css';

interface ProjectGridProps {
  children: React.ReactNode;
}

export default function ProjectGrid({ children }: ProjectGridProps) {
  return <div className={styles.projectGrid}>{children}</div>;
}
