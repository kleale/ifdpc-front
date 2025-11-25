import { IconQuestion } from '@consta/icons/IconQuestion';
import { Button } from '@consta/uikit/Button';
import { Text } from '@consta/uikit/Text';
import { withTooltip } from '@consta/uikit/withTooltip';
import { useState } from 'react';
import { appConfig } from 'shared/appConfiguration';
import { SupportModal } from './SupportModal';

const ButtonWithTooltip = withTooltip({
  tooltipContent: (
    <>
      <Text view="primary" size="s">
        Поддержка ifdpc
      </Text>
      <Text view="primary" size="xs">
        {`Версия ${appConfig.APP.VERSION}`}
      </Text>
    </>
  ),
})(Button);

export const SupportButton = ({ ...props }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <ButtonWithTooltip
        onlyIcon
        view="clear"
        iconSize="m"
        iconLeft={IconQuestion}
        onClick={openModal}
        {...props}
      />
      <SupportModal
        isOpen={isModalOpen}
        onEsc={closeModal}
        onClickOutside={closeModal}
      />
    </>
  );
};
