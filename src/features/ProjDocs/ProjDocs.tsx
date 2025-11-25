import { IconBook } from '@consta/icons/IconBook';
import { Button } from '@consta/uikit/Button';
import { Text } from '@consta/uikit/Text';
import { withTooltip } from '@consta/uikit/withTooltip';
import { useNavigate } from 'react-router-dom';
import { appConfig } from 'shared/appConfiguration';

const ProjDocs = ({ ...props }) => {
  const ButtonWithTooltip = withTooltip({
    tooltipContent: (
      <Text view="primary" size="s">
        Документация к продукту
      </Text>
    ),
  })(Button);
  const navigate = useNavigate();

  return (
    <ButtonWithTooltip
      onlyIcon
      view="clear"
      iconSize="m"
      iconLeft={IconBook}
      onClick={() => navigate(appConfig.EXT_URLS.PRODUCT_DOCS)}
      {...props}
    />
  );
};

export { ProjDocs };
