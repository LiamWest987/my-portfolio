import styles from './ControlsBar.module.css';

interface ControlsBarProps {
  children: React.ReactNode
}

export const ControlsBar: React.FC<ControlsBarProps> = ({ children }) => {
  return <div className={styles.controlsBar}>{children}</div>
}
