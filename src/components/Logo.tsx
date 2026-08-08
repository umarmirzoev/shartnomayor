import { ScrollText } from 'lucide-react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { useLanguage } from '@/lib/i18n/context'
import type { Lang } from '@/lib/i18n'

const brandParts: Record<Lang, [string, string]> = {
  ru: ['Шартнома', 'Ёр'],
  tg: ['Шартнома', 'Ёр'],
  en: ['Shartnoma', 'Yor'],
}

export function Logo({ to = '/', dark = false, className }: { to?: string; dark?: boolean; className?: string }) {
  const { lang } = useLanguage()
  const [main, accent] = brandParts[lang]
  return (
    <Link to={to} className={clsx('flex items-center gap-2.5 group', className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink-900 text-gold-500 shadow-soft transition-transform group-hover:scale-105">
        <ScrollText size={18} strokeWidth={2.25} />
      </span>
      <span className={clsx('text-[17px] font-extrabold tracking-tight', dark ? 'text-white' : 'text-ink-900 dark:text-white')}>
        {main}<span className="text-gold-600">{accent}</span>
      </span>
    </Link>
  )
}
