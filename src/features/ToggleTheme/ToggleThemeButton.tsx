import { Text } from "@consta/uikit/Text";
import { ThemeToggler } from "@consta/uikit/ThemeToggler";
import { withTooltip } from "@consta/uikit/withTooltip";
import { observer } from "mobx-react-lite";
import { getItemIcon } from "./helpers";
import { setTheme, themeItems, themeStore } from "./store";
import type { ThemeItem } from "./types";

const ToggleThemeButton = observer(({ ...props }) => {
  const ThemeTogglerWithTooltip = withTooltip({
    tooltipContent: (
      <Text view="primary" size="s">
        Сменить тему
      </Text>
    ),
  })(ThemeToggler);

  return (
    <ThemeTogglerWithTooltip
      size="m"
      items={themeItems}
      value={themeStore.theme}
      getItemIcon={getItemIcon}
      getItemKey={(item: ThemeItem) => item}
      getItemLabel={(item: ThemeItem) => item}
      onChange={setTheme}
      {...props}
    />
  );
});

export { ToggleThemeButton };
