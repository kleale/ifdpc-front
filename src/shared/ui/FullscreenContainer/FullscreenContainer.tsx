import type { ReactNode } from 'react';
import styles from './FullscreenContainer.module.css';

interface Props {
  children: ReactNode;
}

const FullscreenContainer = ({ children }: Props) => (
  <div className={styles.container}>{children}</div>
);

export { FullscreenContainer };
