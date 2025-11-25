import { Loader as ConstaLoader } from '@consta/uikit/Loader';
import cn from 'classnames';
import type { FC, HTMLAttributes, PropsWithChildren } from 'react';
import styles from './Loader.module.css';

interface LoaderProps extends HTMLAttributes<HTMLDivElement> {}

const Loader: FC<LoaderProps> = ({ className, ...props }) => (
  <div className={cn(styles.loaderContainer, className)} {...props}>
    <ConstaLoader />
  </div>
);

interface WithLoaderProps extends PropsWithChildren, LoaderProps {
  loading: boolean;
}

const WithLoader: FC<WithLoaderProps> = ({ loading, children, ...props }) => {
  if (loading) return <Loader {...props} />;
  return <>{children}</>;
};

export { Loader, WithLoader };
