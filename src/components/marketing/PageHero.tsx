import type { ReactNode } from 'react'
import { useReveal } from '@/hooks/useReveal'

export function PageHero({
  eyebrow,
  title,
  description,
  icon,
  children,
}: {
  eyebrow: string
  title: ReactNode
  description: string
  icon?: ReactNode
  children?: ReactNode
}) {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section ref={ref} className="relative overflow-hidden pb-16 pt-14 lg:pb-20 lg:pt-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px] bg-[radial-gradient(60%_50%_at_50%_0%,rgba(212,169,76,0.14),transparent)] dark:bg-[radial-gradient(60%_50%_at_50%_0%,rgba(212,169,76,0.09),transparent)]" />
      <div className="mx-auto max-w-4xl px-5 text-center lg:px-8">
        <div
          className="reveal inline-flex items-center gap-2 rounded-full border border-gold-300 bg-gold-100 px-3.5 py-1.5 text-xs font-semibold text-gold-700 dark:border-gold-500/30 dark:bg-gold-500/10 dark:text-gold-400"
        >
          {icon}
          {eyebrow}
        </div>
        <h1
          className="reveal mt-6 text-3xl font-extrabold leading-tight tracking-tight text-ink-950 sm:text-4xl lg:text-5xl dark:text-white"
          style={{ transitionDelay: '80ms' }}
        >
          {title}
        </h1>
        <p
          className="reveal mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink-500 dark:text-ink-300"
          style={{ transitionDelay: '140ms' }}
        >
          {description}
        </p>
        {children && (
          <div className="reveal mt-8 flex flex-wrap items-center justify-center gap-3" style={{ transitionDelay: '200ms' }}>
            {children}
          </div>
        )}
      </div>
    </section>
  )
}
