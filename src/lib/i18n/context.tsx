import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { dictionaries, type Lang, type Dict } from './index'

const LANG_KEY = 'shartnomayor_lang_v1'

interface LangCtx {
  lang: Lang
  setLang: (l: Lang) => void
  t: Dict
}

const LanguageContext = createContext<LangCtx | null>(null)

function isLang(v: unknown): v is Lang {
  return v === 'ru' || v === 'tg' || v === 'en'
}

function getInitialLang(): Lang {
  if (typeof window === 'undefined') return 'ru'
  try {
    const stored = localStorage.getItem(LANG_KEY)
    if (isLang(stored)) return stored
  } catch {
    /* ignore */
  }
  return 'ru'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getInitialLang)

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem(LANG_KEY, lang)
    } catch {
      /* ignore */
    }
  }, [lang])

  // Keep in sync across tabs
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === LANG_KEY && isLang(e.newValue)) {
        setLangState(e.newValue)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const setLang = (l: Lang) => setLangState(l)

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: dictionaries[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}

/** Shorthand: just the current translation dictionary. */
export function useT() {
  return useLanguage().t
}
