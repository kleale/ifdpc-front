import { IconMoon } from '@consta/icons/IconMoon';
import { IconSun } from '@consta/icons/IconSun';
import { presetGpnDark, presetGpnDefault } from '@consta/uikit/Theme';
import type { ThemeItem } from './types';

export const getItemIcon = (item: ThemeItem) =>
  item === 'Default' ? IconSun : IconMoon;
export const getTheme = (item: ThemeItem) =>
  item === 'Default' ? presetGpnDefault : presetGpnDark;
