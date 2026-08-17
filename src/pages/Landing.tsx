import { useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowUpRight, Sparkles, ShieldCheck, FileStack, Users, History, BellRing, Lock,
  Wand2, ListChecks, FileDown, CheckCircle2, ScrollText, Scale, ChevronDown,
  Building2, Home, HandCoins, Briefcase as BriefcaseIcon,
} from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { AppMockup } from '@/components/landing/AppMockup'
import { useReveal } from '@/hooks/useReveal'
import { useState } from 'react'
import { useT } from '@/lib/i18n/context'

export default function Landing() {
  return (
    <div className="reveal-root">
      <Hero />
      <StatsBar />
      <ProblemSolution />
      <Features />
      <HowItWorks />
      <TemplateLibrary />
      <AiExplainer />
      <Security />
      <Pricing />
      <Faq />
      <FinalCta />
    </div>
  )
}

function Hero() {
  const t = useT()
  return (
    <section className="relative overflow-hidden pb-20 pt-16 lg:pb-28 lg:pt-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] bg-[radial-gradient(60%_50%_at_50%_0%,rgba(212,169,76,0.14),transparent)]" />
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-5 lg:grid-cols-2 lg:gap-10 lg:px-8">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold-300 bg-gold-100 px-3.5 py-1.5 text-xs font-semibold text-gold-700 dark:border-gold-500/30 dark:bg-gold-500/10 dark:text-gold-400">
            <Sparkles size={13} /> {t.landing.hero.eyebrow}
          </div>
          <h1 className="text-[2.5rem] font-extrabold leading-[1.08] tracking-tight text-ink-950 sm:text-5xl lg:text-[3.4rem] dark:text-white">
            {t.landing.hero.title1}
            <span className="relative whitespace-nowrap">{t.landing.hero.titleAccent}</span>.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-500 dark:text-ink-300">
            {t.landing.hero.desc}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/app/login?mode=register" size="lg" iconRight={<ArrowUpRight size={18} />}>
              {t.common.startFree}
            </ButtonLink>
            <ButtonLink to="/app/dashboard" variant="outline" size="lg">
              {t.common.openDemo}
            </ButtonLink>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-400 dark:text-ink-400">
            <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-emerald-500" /> {t.landing.hero.point1}</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-emerald-500" /> {t.landing.hero.point2}</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-emerald-500" /> {t.landing.hero.point3}</span>
          </div>
        </div>
        <AppMockup />
      </div>
    </section>
  )
}

function StatsBar() {
  const t = useT()
  const ref = useReveal<HTMLDivElement>()
  return (
    <section ref={ref} className="border-y border-ink-100 bg-white py-10 dark:border-white/10 dark:bg-ink-900">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-5 lg:grid-cols-4 lg:px-8">
        {t.landing.stats.map((s, i) => (
          <div key={s.label} className="reveal text-center" style={{ transitionDelay: `${i * 80}ms` }}>
            <p className="font-serif-display text-3xl font-semibold text-ink-900 dark:text-white">{s.value}</p>
            <p className="mt-1.5 text-xs leading-snug text-ink-400 dark:text-ink-400">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function ProblemSolution() {
  const t = useT()
  const ref = useReveal<HTMLDivElement>()
  return (
    <section ref={ref} className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="reveal">
            <Badge tone="red">{t.landing.problem.badge}</Badge>
            <h2 className="mt-4 text-2xl font-bold text-ink-950 sm:text-3xl dark:text-white">
              {t.landing.problem.title}
            </h2>
            <p className="mt-4 leading-relaxed text-ink-500 dark:text-ink-300">
              {t.landing.problem.desc}
            </p>
          </div>
          <div className="reveal" style={{ transitionDelay: '120ms' }}>
            <Badge tone="green">{t.landing.solution.badge}</Badge>
            <h2 className="mt-4 text-2xl font-bold text-ink-950 sm:text-3xl dark:text-white">
              {t.landing.solution.title}
            </h2>
            <p className="mt-4 leading-relaxed text-ink-500 dark:text-ink-300">
              {t.landing.solution.desc}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

const featureIcons = [Wand2, FileStack, Users, History, BellRing, Lock]

function Features() {
  const t = useT()
  const ref = useReveal<HTMLDivElement>()
  return (
    <section id="features" ref={ref} className="bg-ink-950 py-20 text-white lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="reveal max-w-2xl">
          <Badge tone="gold">{t.landing.features.badge}</Badge>
          <h2 className="mt-4 text-2xl font-bold sm:text-3xl">{t.landing.features.title}</h2>
          <p className="mt-4 leading-relaxed text-ink-300">
            {t.landing.features.desc}
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.landing.features.items.map((f, i) => {
            const Icon = featureIcons[i]
            return (
              <div
                key={f.title}
                className="reveal rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-gold-500/40 hover:bg-white/[0.06]"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500/15 text-gold-400">
                  <Icon size={20} />
                </span>
                <h3 className="text-base font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-300">{f.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const t = useT()
  const ref = useReveal<HTMLDivElement>()
  return (
    <section id="how" ref={ref} className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="reveal max-w-2xl">
          <Badge tone="blue">{t.landing.how.badge}</Badge>
          <h2 className="mt-4 text-2xl font-bold text-ink-950 sm:text-3xl dark:text-white">{t.landing.how.title}</h2>
          <p className="mt-4 text-ink-500 dark:text-ink-300">{t.landing.how.desc}</p>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {t.landing.how.steps.map((s, i) => (
            <div key={s.title} className="reveal relative" style={{ transitionDelay: `${i * 90}ms` }}>
              {i < t.landing.how.steps.length - 1 && <div className="absolute right-0 top-6 hidden h-px w-full bg-gradient-to-r from-ink-200 to-transparent lg:block dark:from-white/15" />}
              <span className="font-serif-display text-4xl font-semibold text-ink-200 dark:text-white/10">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-3 text-base font-bold text-ink-900 dark:text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500 dark:text-ink-300">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const templateIcons = [HandCoins, Home, ScrollText, BriefcaseIcon]

function TemplateLibrary() {
  const t = useT()
  const ref = useReveal<HTMLDivElement>()
  return (
    <section id="templates" ref={ref} className="bg-white py-20 lg:py-28 dark:bg-ink-900">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="reveal flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <Badge tone="gold">{t.landing.templateLibrary.badge}</Badge>
            <h2 className="mt-4 text-2xl font-bold text-ink-950 sm:text-3xl dark:text-white">{t.landing.templateLibrary.title}</h2>
            <p className="mt-4 text-ink-500 dark:text-ink-300">{t.landing.templateLibrary.desc}</p>
          </div>
          <ButtonLink to="/app/templates" variant="outline" iconRight={<ArrowUpRight size={16} />}>{t.landing.templateLibrary.openLibrary}</ButtonLink>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.landing.templateLibrary.items.map((tpl, i) => {
            const Icon = templateIcons[i]
            return (
              <Card key={tpl.title} className="reveal p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-soft" style={{ transitionDelay: `${i * 70}ms` }}>
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-ink-900 text-gold-500 dark:bg-white dark:text-gold-600">
                  <Icon size={19} />
                </span>
                <h3 className="text-[15px] font-bold text-ink-900 dark:text-white">{tpl.title}</h3>
                <p className="mt-1 text-xs text-ink-400 dark:text-ink-500">{tpl.tag}</p>
                <p className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-ink-500 dark:text-ink-300">
                  <ListChecks size={13} /> {tpl.clauses} {t.landing.templateLibrary.clausesCount}
                </p>
              </Card>
            )
          })}
        </div>
        <p className="reveal mt-6 text-xs text-ink-400 dark:text-ink-500">
          {t.landing.templateLibrary.excludedNote}
        </p>
      </div>
    </section>
  )
}

function AiExplainer() {
  const t = useT()
  const ref = useReveal<HTMLDivElement>()
  return (
    <section id="ai" ref={ref} className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <div className="reveal">
            <Badge tone="blue">{t.landing.ai.badge}</Badge>
            <h2 className="mt-4 text-2xl font-bold text-ink-950 sm:text-3xl dark:text-white">{t.landing.ai.title}</h2>
            <p className="mt-4 leading-relaxed text-ink-500 dark:text-ink-300">
              {t.landing.ai.desc}
            </p>
            <ul className="mt-6 space-y-3">
              {t.landing.ai.points.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-sm text-ink-600 dark:text-ink-300">
                  <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-500" /> {p}
                </li>
              ))}
            </ul>
          </div>
          <Card className="reveal border-gold-300 bg-gold-100/60 p-7 dark:border-gold-500/30 dark:bg-gold-500/10" style={{ transitionDelay: '100ms' }}>
            <div className="flex items-center gap-2.5 text-gold-700 dark:text-gold-400">
              <Scale size={20} />
              <p className="text-sm font-bold uppercase tracking-wide">{t.landing.ai.principleBadge}</p>
            </div>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-800 dark:text-ink-200">
              {t.landing.ai.principleText}
            </p>
            <div className="mt-6 rounded-xl border border-gold-300 bg-white/70 p-4 text-xs leading-relaxed text-ink-600 dark:border-gold-500/20 dark:bg-white/5 dark:text-ink-300">
              {t.landing.ai.freeNote}
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}

const securityIcons = [FileStack, History, ShieldCheck, BellRing]

function Security() {
  const t = useT()
  const ref = useReveal<HTMLDivElement>()
  return (
    <section id="security" ref={ref} className="bg-ink-50 py-20 lg:py-28 dark:bg-white/[0.02]">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="reveal max-w-2xl">
          <Badge tone="green">{t.landing.security.badge}</Badge>
          <h2 className="mt-4 text-2xl font-bold text-ink-950 sm:text-3xl dark:text-white">{t.landing.security.title}</h2>
          <p className="mt-4 text-ink-500 dark:text-ink-300">{t.landing.security.desc}</p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.landing.security.items.map((p, i) => {
            const Icon = securityIcons[i]
            return (
              <Card key={p.title} className="reveal p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft" style={{ transitionDelay: `${i * 70}ms` }}>
                <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-ink-900 text-gold-500 dark:bg-white dark:text-gold-600">
                  <Icon size={18} />
                </span>
                <h3 className="text-sm font-bold text-ink-900 dark:text-white">{p.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-500 dark:text-ink-300">{p.desc}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  const t = useT()
  const ref = useReveal<HTMLDivElement>()
  const plans = [
    { ...t.landing.pricing.free, variant: 'outline' as const, highlighted: false },
    { ...t.landing.pricing.pro, variant: 'primary' as const, highlighted: true },
  ]
  return (
    <section id="pricing" ref={ref} className="py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        <div className="reveal text-center">
          <Badge tone="gold" className="mx-auto">{t.landing.pricing.badge}</Badge>
          <h2 className="mt-4 text-2xl font-bold text-ink-950 sm:text-3xl dark:text-white">{t.landing.pricing.title}</h2>
          <p className="mx-auto mt-4 max-w-lg text-ink-500 dark:text-ink-300">{t.landing.pricing.desc}</p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {plans.map((p, i) => (
            <Card
              key={p.name}
              className={`reveal p-8 ${p.highlighted ? 'border-2 border-ink-900 shadow-soft dark:border-white' : ''}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {p.highlighted && <Badge tone="gold" className="mb-4">{t.landing.pricing.recommended}</Badge>}
              <h3 className="text-lg font-bold text-ink-900 dark:text-white">{p.name}</h3>
              <p className="mt-1 text-3xl font-extrabold text-ink-950 dark:text-white">{p.price}</p>
              <p className="mt-2 text-sm text-ink-400 dark:text-ink-500">{p.desc}</p>
              <ul className="mt-6 space-y-2.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-ink-600 dark:text-ink-300">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-500" /> {f}
                  </li>
                ))}
              </ul>
              <ButtonLink to="/app/login?mode=register" variant={p.variant} className="mt-8 w-full">
                {p.cta}
              </ButtonLink>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function Faq() {
  const t = useT()
  const ref = useReveal<HTMLDivElement>()
  const [openIdx, setOpenIdx] = useState<number | null>(0)
  return (
    <section id="faq" ref={ref} className="bg-white py-20 lg:py-28 dark:bg-ink-900">
      <div className="mx-auto max-w-3xl px-5 lg:px-8">
        <div className="reveal text-center">
          <Badge tone="neutral" className="mx-auto">{t.landing.faq.badge}</Badge>
          <h2 className="mt-4 text-2xl font-bold text-ink-950 sm:text-3xl dark:text-white">{t.landing.faq.title}</h2>
        </div>
        <div className="mt-10 divide-y divide-ink-100 rounded-2xl border border-ink-100 dark:divide-white/10 dark:border-white/10">
          {t.landing.faq.items.map((item, i) => (
            <div key={item.q} className="reveal" style={{ transitionDelay: `${i * 40}ms` }}>
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="text-sm font-semibold text-ink-900 dark:text-white">{item.q}</span>
                <ChevronDown size={18} className={`shrink-0 text-ink-400 transition-transform duration-200 dark:text-ink-500 ${openIdx === i ? 'rotate-180' : ''}`} />
              </button>
              {openIdx === i && (
                <div className="px-6 pb-5 text-sm leading-relaxed text-ink-500 dark:text-ink-300">{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCta() {
  const t = useT()
  const ref = useReveal<HTMLDivElement>()
  return (
    <section ref={ref} className="px-5 pb-24 lg:px-8">
      <div className="reveal mx-auto max-w-6xl overflow-hidden rounded-3xl bg-ink-950 px-8 py-16 text-center text-white sm:px-16">
        <Building2 className="mx-auto mb-5 text-gold-400" size={30} />
        <h2 className="text-2xl font-bold sm:text-3xl">{t.landing.finalCta.title}</h2>
        <p className="mx-auto mt-4 max-w-lg text-ink-300">
          {t.landing.finalCta.desc}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink to="/app/login?mode=register" variant="secondary" size="lg" iconRight={<ArrowUpRight size={18} />}>
            {t.common.startFree}
          </ButtonLink>
          <ButtonLink to="/app/dashboard" variant="ghost" size="lg" className="text-white hover:bg-white/10">
            {t.common.openDemo}
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
