import { useEffect, useRef, useState } from 'react'
import { Languages, Check } from 'lucide-react'
import clsx from 'clsx'
import { useLanguage } from '@/lib/i18n/context'
import { langLabels, langShort, type Lang } from '@/lib/i18n'

const ORDER: Lang[] = ['ru', 'tg', 'en']

export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang } = useLanguage()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={rootRef} className={clsx('relative shrink-0', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Сменить язык / Забонро иваз кунед / Switch language"
        aria-expanded={open}
        title={langLabels[lang]}
        className={clsx(
          'group flex h-9 items-center gap-1.5 rounded-xl border border-ink-200 bg-white px-2.5 text-ink-600 transition-all duration-300 hover:border-ink-400 hover:text-ink-900 active:scale-95',
          'dark:border-white/10 dark:bg-white/[0.04] dark:text-ink-300 dark:hover:border-white/25 dark:hover:text-white',
          open && 'border-ink-400 text-ink-900 dark:border-white/25 dark:text-white'
        )}
      >
        <Languages size={16} className="transition-transform duration-300 group-hover:scale-110" />
        <span className="text-xs font-semibold tracking-wide">{langShort[lang]}</span>
      </button>

      <div
        className={clsx(
          'absolute right-0 top-full z-50 mt-2 w-40 origin-top-right overflow-hidden rounded-xl border border-ink-200 bg-white p-1 shadow-soft transition-all duration-200',
          'dark:border-white/10 dark:bg-ink-900',
          open ? 'translate-y-0 scale-100 opacity-100' : 'pointer-events-none -translate-y-1 scale-95 opacity-0'
        )}
      >
        {ORDER.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => {
              setLang(l)
              setOpen(false)
            }}
            className={clsx(
              'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors',
              l === lang
                ? 'bg-ink-100 font-semibold text-ink-900 dark:bg-white/10 dark:text-white'
                : 'text-ink-600 hover:bg-ink-50 dark:text-ink-300 dark:hover:bg-white/[0.06]'
            )}
          >
            {langLabels[l]}
            {l === lang && <Check size={14} className="text-gold-600 dark:text-gold-400" />}
          </button>
        ))}
      </div>
    </div>
  )
}
