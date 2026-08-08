import { ScrollText } from 'lucide-react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'

export function Logo({ to = '/', dark = false, className }: { to?: string; dark?: boolean; className?: string }) {
  return (
    <Link to={to} className={clsx('flex items-center gap-2.5 group', className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink-900 text-gold-500 shadow-soft transition-transform group-hover:scale-105">
        <ScrollText size={18} strokeWidth={2.25} />
      </span>
      <span className={clsx('text-[17px] font-extrabold tracking-tight', dark ? 'text-white' : 'text-ink-900')}>
        Шартнома<span className="text-gold-600">Ёр</span>
      </span>
    </Link>
  )
}
