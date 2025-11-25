import { observer } from 'mobx-react-lite';
import styles from './Content.module.css';

export const Content = observer(() => {
  return (
    <div className={styles.container}>
        <div className={styles.content}>Контент</div>
    </div>
  );
});
