import React from 'react';
import styles from './Badge.module.css';

type BadgeVariant = 'secondary' | 'outline' | 'primary' | 'accent';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'secondary' }) => {
  return (
    <span className={`${styles['badge']} ${styles[variant]}`}>
      {children}
    </span>
  );
};
