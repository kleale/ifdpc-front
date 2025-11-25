import cn from 'classnames';
import { Link, useLocation } from 'react-router-dom';
import { PATHS } from 'shared/typesAndConsts/router';
import styles from './Logo.module.css';
import { appConfig } from 'shared/appConfiguration';

const Logo = () => {
  const location = useLocation();
  return (
    <Link
      to={PATHS.MAIN_PAGE}
      className={cn(styles.link, {
        [styles.link_disabled]: location.pathname === PATHS.MAIN_PAGE,
      })}
    >
      <span className={styles.logoMain}>IFDP: COGNINTIVE</span>
      <span className={styles.logoVersion}>alpha {appConfig.APP.VERSION}</span>
    </Link>
  );
};

export { Logo };
