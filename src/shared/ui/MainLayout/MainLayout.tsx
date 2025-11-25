import cn from 'classnames';
import type { ReactNode } from 'react';

import styles from './MainLayout.module.css';

type MainLayoutProps = {
  header?: ReactNode;
  content?: ReactNode;
  layoutClassName?: string;
  contentClassName?: string;
};

const MainLayout = ({
  header,
  content,
  layoutClassName,
  contentClassName,
}: MainLayoutProps) => (
  <div className={cn(styles.mainLayout, layoutClassName)} id="MainLayout">
    {header}
    <div className={cn(styles.content, contentClassName)}>{content}</div>
  </div>
);

export { MainLayout };
