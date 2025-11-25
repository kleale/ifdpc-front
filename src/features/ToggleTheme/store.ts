import { makeAutoObservable } from 'mobx';
import type { ThemeItem } from './types';

const themeItems: ThemeItem[] = ['Default', 'Dark'];

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme') as ThemeItem | undefined;
  if (savedTheme) {
    return savedTheme;
  }

  let theme = themeItems[0];
  const hours = new Date(Date.now()).getHours();
  if (hours >= 18 || hours <= 9) {
    theme = themeItems[1];
  }

  localStorage.setItem('theme', theme);
  return theme;
};

class ThemeStore {
  private _theme: ThemeItem = getInitialTheme();

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get theme() {
    return this._theme;
  }

  setTheme(theme: ThemeItem) {
    this._theme = theme;
  }
}

const themeStore = new ThemeStore();
const setTheme = (theme: ThemeItem) => {
  themeStore.setTheme(theme);
  localStorage.setItem('theme', theme);
};

export { themeStore, setTheme, themeItems };
