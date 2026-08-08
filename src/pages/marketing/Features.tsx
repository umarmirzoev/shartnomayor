import {
  Sparkles, Wand2, FileStack, Users, History, BellRing, Lock, ArrowUpRight,
  CheckCircle2, XCircle, ShieldCheck, GitBranch, KeyRound,
  Layers, Zap, Scale,
} from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { PageHero } from '@/components/marketing/PageHero'
import { useReveal } from '@/hooks/useReveal'
import { useT } from '@/lib/i18n/context'

const groupTones = ['gold', 'blue', 'green'] as const
const groupIcons = [
  [Wand2, Layers, Zap],
  [Users, FileStack, History],
  [BellRing, Lock, ShieldCheck],
]

const spotlightTones = ['gold', 'blue', 'green'] as const
const spotlightIcons = [Wand2, GitBranch, KeyRound]

export default function Features() {
  const t = useT()
  const groupsRef = useReveal<HTMLDivElement>()
  const spotlightRef = useReveal<HTMLDivElement>()
  const compareRef = useReveal<HTMLDivElement>()
  const ctaRef = useReveal<HTMLDivElement>()

  return (
    <div className="reveal-root">
      <PageHero
        eyebrow={t.featuresPage.eyebrow}
        icon={<Sparkles size={13} />}
        title={t.featuresPage.title}
        description={t.featuresPage.desc}
      >
        <ButtonLink to="/app/login?mode=register" iconRight={<ArrowUpRight size={16} />}>{t.common.startFree}</ButtonLink>
        <ButtonLink to="/how-it-works" variant="outline">{t.featuresPage.howItWorksLink}</ButtonLink>
      </PageHero>

      {t.featuresPage.groups.map((group, gi) => (
        <section key={group.label} ref={gi === 0 ? groupsRef : undefined} className={gi % 2 === 1 ? 'bg-ink-50 py-16 dark:bg-white/[0.02] lg:py-20' : 'py-16 lg:py-20'}>
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="reveal flex items-center gap-3" style={{ transitionDelay: `${gi * 40}ms` }}>
              <Badge tone={groupTones[gi]}>{group.label}</Badge>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((f, i) => {
                const Icon = groupIcons[gi][i]
                return (
                  <Card
                    key={f.title}
                    className="reveal group relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-400/60 hover:shadow-soft dark:hover:border-gold-500/40"
                    style={{ transitionDelay: `${(gi * 3 + i) * 60}ms` }}
                  >
                    <span className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gold-100 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-70 dark:bg-gold-500/20" />
                    <span className="relative mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-ink-900 text-gold-500 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <Icon size={20} />
                    </span>
                    <h3 className="relative text-base font-semibold text-ink-900 dark:text-white">{f.title}</h3>
                    <p className="relative mt-2 text-sm leading-relaxed text-ink-500 dark:text-ink-300">{f.desc}</p>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
      ))}

      <section ref={spotlightRef} className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl space-y-20 px-5 lg:space-y-28 lg:px-8">
          {t.featuresPage.spotlights.map((s, i) => {
            const Icon = spotlightIcons[i]
            return (
              <div key={s.title} className={`grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16 ${i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                <div className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                  <Badge tone={spotlightTones[i]}>{s.badge}</Badge>
                  <h2 className="mt-4 text-2xl font-bold text-ink-950 sm:text-3xl dark:text-white">{s.title}</h2>
                  <p className="mt-4 leading-relaxed text-ink-500 dark:text-ink-300">{s.desc}</p>
                  <ul className="mt-6 space-y-3">
                    {s.points.map((p) => (
                      <li key={p} className="flex items-start gap-2.5 text-sm text-ink-600 dark:text-ink-300">
                        <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-500" /> {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <Card className="reveal group flex aspect-[4/3] items-center justify-center overflow-hidden p-8 transition-transform duration-500 hover:scale-[1.02]" style={{ transitionDelay: `${i * 80 + 100}ms` }}>
                  <span className="flex h-24 w-24 items-center justify-center rounded-3xl bg-ink-950 text-gold-500 shadow-soft transition-transform duration-500 group-hover:rotate-6 group-hover:scale-105 dark:bg-white/10">
                    <Icon size={40} strokeWidth={1.6} />
                  </span>
                </Card>
              </div>
            )
          })}
        </div>
      </section>

      <section ref={compareRef} className="bg-ink-950 py-20 text-white lg:py-28">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <div className="reveal text-center">
            <Badge tone="gold" className="mx-auto">{t.featuresPage.compareBadge}</Badge>
            <h2 className="mt-4 text-2xl font-bold sm:text-3xl">{t.featuresPage.compareTitle}</h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-5">
            {t.featuresPage.compare.map((row, i) => (
              <div key={row.without} className="reveal grid grid-cols-1 gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/20 sm:grid-cols-2" style={{ transitionDelay: `${i * 70}ms` }}>
                <div className="flex items-start gap-2.5 text-sm text-ink-300">
                  <XCircle size={17} className="mt-0.5 shrink-0 text-red-400" /> {row.without}
                </div>
                <div className="flex items-start gap-2.5 text-sm font-medium text-white">
                  <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-gold-400" /> {row.with}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={ctaRef} className="px-5 py-20 lg:px-8 lg:py-28">
        <Card className="reveal mx-auto max-w-5xl overflow-hidden p-10 text-center sm:p-14">
          <Scale className="mx-auto mb-5 text-gold-500" size={30} />
          <h2 className="text-2xl font-bold text-ink-950 sm:text-3xl dark:text-white">{t.featuresPage.ctaTitle}</h2>
          <p className="mx-auto mt-4 max-w-lg text-ink-500 dark:text-ink-300">
            {t.featuresPage.ctaDesc}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink to="/templates" iconRight={<ArrowUpRight size={16} />}>{t.featuresPage.ctaOpen}</ButtonLink>
            <ButtonLink to="/pricing" variant="outline">{t.featuresPage.pricingLink}</ButtonLink>
          </div>
        </Card>
      </section>
    </div>
  )
}
