import { useState } from 'react'
import {
  Wallet, CheckCircle2, Minus, ArrowUpRight, ChevronDown, Sparkles,
} from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { PageHero } from '@/components/marketing/PageHero'
import { useReveal } from '@/hooks/useReveal'
import { useT } from '@/lib/i18n/context'
import clsx from 'clsx'

export default function Pricing() {
  const t = useT()
  const plansRef = useReveal<HTMLDivElement>()
  const tableRef = useReveal<HTMLDivElement>()
  const faqRef = useReveal<HTMLDivElement>()
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  const plans = [
    { ...t.landing.pricing.free, variant: 'outline' as const, highlighted: false, showUnit: true },
    { ...t.landing.pricing.pro, variant: 'primary' as const, highlighted: true, showUnit: false },
  ]

  return (
    <div className="reveal-root">
      <PageHero
        eyebrow={t.pricingPage.eyebrow}
        icon={<Wallet size={13} />}
        title={t.pricingPage.title}
        description={t.pricingPage.desc}
      />

      <section ref={plansRef} className="pb-20 lg:pb-28">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {plans.map((p, i) => (
              <Card
                key={p.name}
                className={clsx(
                  'reveal group relative overflow-hidden p-8 transition-all duration-300 hover:-translate-y-1.5',
                  p.highlighted ? 'border-2 border-ink-900 shadow-soft dark:border-white' : 'hover:border-gold-400/50 dark:hover:border-gold-500/40'
                )}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {p.highlighted && (
                  <span className="absolute -right-10 top-6 w-40 rotate-45 bg-gold-500 py-1 text-center text-[11px] font-bold uppercase tracking-wide text-ink-950">
                    {t.landing.pricing.recommended}
                  </span>
                )}
                <h3 className="text-lg font-bold text-ink-900 dark:text-white">{p.name}</h3>
                <p className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold text-ink-950 dark:text-white">{p.price}</span>
                  {p.showUnit && <span className="text-sm text-ink-400">/ {t.pricingPage.perMonth}</span>}
                </p>
                <p className="mt-2 text-sm text-ink-400">{p.desc}</p>
                <ul className="mt-6 space-y-2.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-ink-600 dark:text-ink-300">
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-500" /> {f}
                    </li>
                  ))}
                </ul>
                <ButtonLink to="/app/login?mode=register" variant={p.variant} className="mt-8 w-full transition-transform duration-200 group-hover:scale-[1.02]">
                  {p.cta}
                </ButtonLink>
              </Card>
            ))}
          </div>
          <p className="reveal mt-6 flex items-center justify-center gap-2 text-center text-xs text-ink-400">
            <Sparkles size={13} className="text-gold-500" /> {t.pricingPage.freeAiNote}
          </p>
        </div>
      </section>

      <section ref={tableRef} className="bg-white py-20 dark:bg-ink-900 lg:py-28">
        <div className="mx-auto max-w-4xl px-5 lg:px-8">
          <div className="reveal text-center">
            <Badge tone="neutral" className="mx-auto">{t.pricingPage.compareBadge}</Badge>
            <h2 className="mt-4 text-2xl font-bold text-ink-950 sm:text-3xl dark:text-white">{t.pricingPage.compareTitle}</h2>
          </div>
          <div className="reveal mt-10 overflow-hidden rounded-2xl border border-ink-100 dark:border-white/10">
            <div className="grid grid-cols-[1fr_auto_auto] items-center gap-x-4 bg-ink-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-ink-500 dark:bg-white/[0.04] dark:text-ink-400 sm:gap-x-8 sm:px-6">
              <span>{t.pricingPage.feature}</span>
              <span className="text-center">{t.common.freeBadge}</span>
              <span className="text-center text-gold-600 dark:text-gold-400">{t.landing.pricing.pro.name}</span>
            </div>
            <div className="divide-y divide-ink-100 dark:divide-white/10">
              {t.pricingPage.compareRows.map((row) => (
                <div key={row.label} className="grid grid-cols-[1fr_auto_auto] items-center gap-x-4 px-5 py-4 text-sm transition-colors duration-200 hover:bg-ink-50/60 dark:hover:bg-white/[0.03] sm:gap-x-8 sm:px-6">
                  <span className="text-ink-700 dark:text-ink-200">{row.label}</span>
                  <span className="w-24 text-center text-ink-500 dark:text-ink-300">
                    {typeof row.free === 'boolean' ? (
                      row.free ? <CheckCircle2 size={16} className="mx-auto text-emerald-500" /> : <Minus size={16} className="mx-auto text-ink-300 dark:text-white/20" />
                    ) : row.free}
                  </span>
                  <span className="w-24 text-center font-medium text-ink-800 dark:text-white">
                    {typeof row.pro === 'boolean' ? (
                      row.pro ? <CheckCircle2 size={16} className="mx-auto text-emerald-500" /> : <Minus size={16} className="mx-auto text-ink-300 dark:text-white/20" />
                    ) : row.pro}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section ref={faqRef} className="py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <div className="reveal text-center">
            <Badge tone="gold" className="mx-auto">{t.pricingPage.billingFaqBadge}</Badge>
            <h2 className="mt-4 text-2xl font-bold text-ink-950 sm:text-3xl dark:text-white">{t.pricingPage.billingFaqTitle}</h2>
          </div>
          <div className="mt-10 divide-y divide-ink-100 rounded-2xl border border-ink-100 dark:divide-white/10 dark:border-white/10">
            {t.pricingPage.billingFaq.map((item, i) => (
              <div key={item.q} className="reveal" style={{ transitionDelay: `${i * 50}ms` }}>
                <button onClick={() => setOpenIdx(openIdx === i ? null : i)} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left">
                  <span className="text-sm font-semibold text-ink-900 dark:text-white">{item.q}</span>
                  <ChevronDown size={18} className={clsx('shrink-0 text-ink-400 transition-transform duration-300', openIdx === i && 'rotate-180')} />
                </button>
                <div className="grid overflow-hidden transition-all duration-300 ease-out" style={{ gridTemplateRows: openIdx === i ? '1fr' : '0fr' }}>
                  <div className="min-h-0">
                    <div className="px-6 pb-5 text-sm leading-relaxed text-ink-500 dark:text-ink-300">{item.a}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="reveal mt-10 text-center">
            <ButtonLink to="/app/login?mode=register" iconRight={<ArrowUpRight size={16} />}>{t.common.startFree}</ButtonLink>
          </div>
        </div>
      </section>
    </div>
  )
}
