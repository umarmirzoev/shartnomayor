import {
  Workflow, MessageSquareText, Wand2, PenLine, FileCheck2, ArrowUpRight,
  CheckCircle2, ChevronDown, FileDown, Clock, ShieldAlert,
} from 'lucide-react'
import { useState } from 'react'
import { ButtonLink } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { PageHero } from '@/components/marketing/PageHero'
import { useReveal } from '@/hooks/useReveal'
import { useT } from '@/lib/i18n/context'

const stepIcons = [MessageSquareText, Wand2, PenLine, FileCheck2]

export default function HowItWorks() {
  const t = useT()
  const timelineRef = useReveal<HTMLDivElement>()
  const noticeRef = useReveal<HTMLDivElement>()
  const faqRef = useReveal<HTMLDivElement>()
  const ctaRef = useReveal<HTMLDivElement>()
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  return (
    <div className="reveal-root">
      <PageHero
        eyebrow={t.howItWorksPage.eyebrow}
        icon={<Workflow size={13} />}
        title={t.howItWorksPage.title}
        description={t.howItWorksPage.desc}
      >
        <ButtonLink to="/app/login?mode=register" iconRight={<ArrowUpRight size={16} />}>{t.howItWorksPage.tryFree}</ButtonLink>
        <ButtonLink to="/templates" variant="outline">{t.footer.templateLibrary}</ButtonLink>
      </PageHero>

      <section ref={timelineRef} className="py-16 lg:py-24">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <div className="relative">
            <div className="absolute left-[27px] top-2 bottom-2 hidden w-px bg-gradient-to-b from-gold-400 via-ink-200 to-transparent dark:from-gold-500/60 dark:via-white/10 sm:block" />
            <div className="space-y-10">
              {t.howItWorksPage.steps.map((s, i) => {
                const Icon = stepIcons[i]
                return (
                  <div key={s.title} className="reveal relative flex flex-col gap-5 sm:flex-row sm:items-start" style={{ transitionDelay: `${i * 100}ms` }}>
                    <div className="relative z-10 flex shrink-0 items-center gap-4 sm:block">
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-950 text-gold-500 shadow-soft transition-transform duration-300 hover:scale-105 hover:rotate-3 dark:bg-white/10">
                        <Icon size={24} />
                      </span>
                    </div>
                    <Card className="group flex-1 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/50 hover:shadow-soft dark:hover:border-gold-500/40">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-serif-display text-2xl font-semibold text-ink-200 dark:text-white/15">{String(i + 1).padStart(2, '0')}</span>
                        <h3 className="text-lg font-bold text-ink-900 dark:text-white">{s.title}</h3>
                        <Badge tone="neutral" className="ml-auto flex items-center gap-1">
                          <Clock size={11} /> {s.time}
                        </Badge>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-ink-500 dark:text-ink-300">{s.desc}</p>
                      <p className="mt-3 rounded-xl bg-ink-50 p-4 text-[13px] leading-relaxed text-ink-600 transition-colors duration-300 group-hover:bg-gold-100/50 dark:bg-white/[0.03] dark:text-ink-300 dark:group-hover:bg-gold-500/10">
                        {s.detail}
                      </p>
                    </Card>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section ref={noticeRef} className="bg-ink-950 py-16 text-white lg:py-20">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <div className="reveal flex flex-col items-start gap-6 rounded-2xl border border-white/10 bg-white/[0.03] p-8 sm:flex-row sm:items-center">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold-500/15 text-gold-400">
              <ShieldAlert size={22} />
            </span>
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-gold-400">{t.howItWorksPage.principleLabel}</p>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-200">
                {t.howItWorksPage.principle}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section ref={faqRef} className="py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <div className="reveal text-center">
            <Badge tone="blue" className="mx-auto">{t.howItWorksPage.faqBadge}</Badge>
            <h2 className="mt-4 text-2xl font-bold text-ink-950 sm:text-3xl dark:text-white">{t.howItWorksPage.faqTitle}</h2>
          </div>
          <div className="mt-10 divide-y divide-ink-100 rounded-2xl border border-ink-100 dark:divide-white/10 dark:border-white/10">
            {t.howItWorksPage.faq.map((item, i) => (
              <div key={item.q} className="reveal" style={{ transitionDelay: `${i * 50}ms` }}>
                <button
                  onClick={() => setOpenIdx(openIdx === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-sm font-semibold text-ink-900 dark:text-white">{item.q}</span>
                  <ChevronDown size={18} className={`shrink-0 text-ink-400 transition-transform duration-300 ${openIdx === i ? 'rotate-180' : ''}`} />
                </button>
                <div
                  className="grid overflow-hidden transition-all duration-300 ease-out"
                  style={{ gridTemplateRows: openIdx === i ? '1fr' : '0fr' }}
                >
                  <div className="min-h-0">
                    <div className="px-6 pb-5 text-sm leading-relaxed text-ink-500 dark:text-ink-300">{item.a}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={ctaRef} className="px-5 pb-24 lg:px-8">
        <Card className="reveal mx-auto max-w-5xl overflow-hidden bg-ink-950 p-10 text-center text-white sm:p-14 dark:bg-white/[0.03]">
          <FileDown className="mx-auto mb-5 text-gold-400" size={30} />
          <h2 className="text-2xl font-bold sm:text-3xl">{t.howItWorksPage.ctaTitle}</h2>
          <p className="mx-auto mt-4 max-w-lg text-ink-300">{t.howItWorksPage.ctaDesc}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink to="/app/login?mode=register" variant="secondary" size="lg" iconRight={<ArrowUpRight size={18} />}>{t.common.startFree}</ButtonLink>
            <ButtonLink to="/app/dashboard" variant="ghost" size="lg" className="text-white hover:bg-white/10">{t.howItWorksPage.openDemo}</ButtonLink>
          </div>
          <p className="mx-auto mt-6 flex max-w-lg items-center justify-center gap-2 text-xs text-ink-400">
            <CheckCircle2 size={13} className="text-emerald-400" /> {t.howItWorksPage.freeUsage}
          </p>
        </Card>
      </section>
    </div>
  )
}
