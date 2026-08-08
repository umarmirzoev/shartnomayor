import clsx from 'clsx'
import type { ReactNode } from 'react'

const tones = {
  neutral: 'bg-ink-100 text-ink-600 dark:bg-white/10 dark:text-ink-300',
  gold: 'bg-gold-100 text-gold-700 dark:bg-gold-500/15 dark:text-gold-400',
  green: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  blue: 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
  red: 'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400',
  amber: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
}

export function Badge({ children, tone = 'neutral', className }: { children: ReactNode; tone?: keyof typeof tones; className?: string }) {
  return (
    <span className={clsx('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors duration-300', tones[tone], className)}>
      {children}
    </span>
  )
}
