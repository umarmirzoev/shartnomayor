import clsx from 'clsx'
import type { HTMLAttributes } from 'react'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        'rounded-2xl border border-ink-100 bg-white shadow-card transition-colors duration-300 dark:border-white/10 dark:bg-ink-900 dark:shadow-none',
        className
      )}
      {...props}
    />
  )
}
