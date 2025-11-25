import type { ReactNode } from 'react';
import styles from './MainHeader.module.css';

interface Props {
  left: ReactNode;
  right: ReactNode;
}

export const MainHeader = ({ left, right }: Props) => (
  <div className={styles.header}>
    <div className={styles.left}>{left}</div>
    <div className={styles.right}>{right}</div>
  </div>
);
