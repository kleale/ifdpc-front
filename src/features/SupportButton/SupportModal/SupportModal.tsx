import { IconCopy } from '@consta/icons/IconCopy';
import { IconMail } from '@consta/icons/IconMail';
import { IconPhone } from '@consta/icons/IconPhone';
import { IconWorldFilled } from '@consta/icons/IconWorldFilled';
import { Button } from '@consta/uikit/Button';
import { cnMixSpace } from '@consta/uikit/MixSpace';
import { Modal } from '@consta/uikit/Modal';
import { Text } from '@consta/uikit/Text';
import cn from 'classnames';
import { appConfig } from 'shared/appConfiguration';
import styles from './SupportModal.module.css';

interface Props {
  isOpen?: boolean;
  onEsc?: (event: KeyboardEvent) => void;
  onClickOutside?: (event: MouseEvent) => void;
}

export const SupportModal = ({ isOpen, ...props }: Props) => {

  return (
    <Modal
      hasOverlay
      isOpen={isOpen}
      position="center"
      className={styles.modal}
      {...props}
    >
      <div className={cn(styles.header, cnMixSpace({ pH: 'l', pV: 'l' }))}>
        <Text size="l" view="primary" weight="medium">
          Поддержка ifdpc
        </Text>
        <Text size="s" view="secondary" weight="regular">
          {`Версия ${appConfig.APP.VERSION}`}
        </Text>
      </div>
      <div className={cn(styles.content, cnMixSpace({ pH: 'l', pB: 'l' }))}>
        <Text size="m" view="primary" weight="regular">
          Приоритетный вариант связи с поддержкой:
        </Text>
        <Button
          as="a"
          width="full"
          view="primary"
          target="_blank"
          iconLeft={IconWorldFilled}
          href={appConfig.SUPPORT.ESO_URL}
          label="Единое окно сервисной поддержки ifdpc"
        />
        <Text size="m" view="primary" weight="regular">
          Резервный вариант:
        </Text>
        <Button
          as="a"
          view="ghost"
          width="full"
          iconLeft={IconMail}
          label={appConfig.SUPPORT.MAIL}
          className={styles.button}
          href={`mailto:${appConfig.SUPPORT.MAIL}?subject=${appConfig.SUPPORT.SUBJECT}&body=${appConfig.SUPPORT.BODY}.%0D%0A%0D%0AВерсия приложения: ${appConfig.APP.VERSION}.`}
          iconRight={() => (
            <Button
              onlyIcon
              size="m"
              iconSize="s"
              view="clear"
              iconLeft={IconCopy}
              className={styles.copy}
              onClick={(e) => {
                e.preventDefault();
              }}
            />
          )}
        />
        <Button
          as="a"
          view="ghost"
          width="full"
          iconLeft={IconPhone}
          className={styles.button}
          label={appConfig.SUPPORT.PHONE_NUMBER}
          href={`tel:${appConfig.SUPPORT.PHONE_NUMBER}`}
          iconRight={() => (
            <Button
              onlyIcon
              size="m"
              iconSize="s"
              view="clear"
              iconLeft={IconCopy}
              className={styles.copy}
              onClick={(e) => {
                e.preventDefault();
              }}
            />
          )}
        />
      </div>
    </Modal>
  );
};
