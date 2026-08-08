import { Sun, Moon } from 'lucide-react'
import clsx from 'clsx'
import { useTheme } from '@/lib/theme'
import { useLanguage } from '@/lib/i18n/context'
import { chromeLabels } from '@/lib/i18n'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme()
  const { lang } = useLanguage()
  const isDark = theme === 'dark'
  const labels = chromeLabels[lang]

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? labels.switchToLight : labels.switchToDark}
      title={isDark ? labels.lightTheme : labels.darkTheme}
      className={clsx(
        'group relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-ink-200 bg-white text-ink-600 transition-all duration-300 hover:border-ink-400 hover:text-ink-900 active:scale-90',
        'dark:border-white/10 dark:bg-white/[0.04] dark:text-ink-300 dark:hover:border-white/25 dark:hover:text-white',
        className
      )}
    >
      <Sun
        size={17}
        className={clsx(
          'absolute transition-all duration-500 ease-out',
          isDark ? '-translate-y-6 rotate-90 opacity-0' : 'translate-y-0 rotate-0 opacity-100'
        )}
      />
      <Moon
        size={17}
        className={clsx(
          'absolute transition-all duration-500 ease-out',
          isDark ? 'translate-y-0 rotate-0 opacity-100' : 'translate-y-6 -rotate-90 opacity-0'
        )}
      />
    </button>
  )
}
