import React from 'react';
import styles from './ValueCard.module.css';

interface ValueCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const ValueCard: React.FC<ValueCardProps> = ({ icon, title, description }) => {
  return (
    <div className={styles['valueCard']}>
      <div className={styles['valueIcon']}>{icon}</div>
      <h3 className={styles['valueTitle']}>{title}</h3>
      <p className={styles['valueDescription']}>{description}</p>
    </div>
  );
};
