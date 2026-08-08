import { ru } from './ru'
import { tg } from './tg'
import { en } from './en'

export type Lang = 'ru' | 'tg' | 'en'

export type Dict = typeof ru

export const dictionaries: Record<Lang, Dict> = { ru, tg, en }

export const langLabels: Record<Lang, string> = {
  ru: 'Русский',
  tg: 'Тоҷикӣ',
  en: 'English',
}

export const langShort: Record<Lang, string> = {
  ru: 'РУ',
  tg: 'ТҶ',
  en: 'EN',
}

/** City line used on printed / exported documents. */
export const cityLine: Record<Lang, string> = {
  ru: 'г. Душанбе',
  tg: 'ш. Душанбе',
  en: 'Dushanbe',
}

/** aria-label / title strings for small chrome controls that sit outside the main dictionary. */
export const chromeLabels: Record<Lang, { menu: string; lightTheme: string; darkTheme: string; switchToLight: string; switchToDark: string }> = {
  ru: { menu: 'Меню', lightTheme: 'Светлая тема', darkTheme: 'Тёмная тема', switchToLight: 'Включить светлую тему', switchToDark: 'Включить тёмную тему' },
  tg: { menu: 'Меню', lightTheme: 'Мавзӯи равшан', darkTheme: 'Мавзӯи торик', switchToLight: 'Мавзӯи равшанро фаъол кунед', switchToDark: 'Мавзӯи торикро фаъол кунед' },
  en: { menu: 'Menu', lightTheme: 'Light theme', darkTheme: 'Dark theme', switchToLight: 'Switch to light theme', switchToDark: 'Switch to dark theme' },
}
