import { useMemo, useState } from 'react'
import {
  FileStack, HandCoins, Home, ScrollText, Briefcase, ListChecks, ArrowUpRight,
  ChevronDown, CheckCircle2, XCircle, LayoutTemplate,
} from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { PageHero } from '@/components/marketing/PageHero'
import { useReveal } from '@/hooks/useReveal'
import { useT } from '@/lib/i18n/context'
import { localizedTemplates, localizedClauses } from '@/lib/seedText'
import clsx from 'clsx'

const iconMap: Record<string, typeof HandCoins> = {
  'tpl-supply': HandCoins,
  'tpl-lease': Home,
  'tpl-nda': ScrollText,
  'tpl-labor': Briefcase,
}

export default function Templates() {
  const t = useT()
  const templates = useMemo(() => localizedTemplates(t), [t])
  const clauseList = useMemo(() => localizedClauses(t), [t])
  const categories = useMemo(() => [t.templatesPage.allCategories, ...Array.from(new Set(templates.map((tpl) => tpl.category)))], [templates, t])
  const [active, setActive] = useState(t.templatesPage.allCategories)
  const [openId, setOpenId] = useState<string | null>(templates[0]?.id ?? null)

  const filtered = active === t.templatesPage.allCategories ? templates : templates.filter((tpl) => tpl.category === active)

  const gridRef = useReveal<HTMLDivElement>()
  const excludedRef = useReveal<HTMLDivElement>()
  const ctaRef = useReveal<HTMLDivElement>()

  return (
    <div className="reveal-root">
      <PageHero
        eyebrow={t.templatesPage.eyebrow}
        icon={<LayoutTemplate size={13} />}
        title={t.templatesPage.title}
        description={t.templatesPage.desc}
      >
        <ButtonLink to="/app/login?mode=register" iconRight={<ArrowUpRight size={16} />}>{t.common.startFree}</ButtonLink>
        <ButtonLink to="/how-it-works" variant="outline">{t.featuresPage.howItWorksLink}</ButtonLink>
      </PageHero>

      <section ref={gridRef} className="pb-20 lg:pb-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="reveal flex flex-wrap items-center gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={clsx(
                  'rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-200 active:scale-95',
                  active === c
                    ? 'border-ink-900 bg-ink-900 text-white shadow-soft dark:border-white dark:bg-white dark:text-ink-950'
                    : 'border-ink-200 text-ink-600 hover:border-ink-400 hover:bg-ink-50 dark:border-white/15 dark:text-ink-300 dark:hover:border-white/30 dark:hover:bg-white/5'
                )}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
            {filtered.map((tpl, i) => {
              const Icon = iconMap[tpl.id] ?? FileStack
              const clauses = tpl.clauseIds.map((cid) => clauseList.find((c) => c.id === cid)!).filter(Boolean)
              const isOpen = openId === tpl.id
              return (
                <Card
                  key={tpl.id}
                  className="reveal overflow-hidden transition-all duration-300 hover:border-gold-400/50 hover:shadow-soft dark:hover:border-gold-500/40"
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <button onClick={() => setOpenId(isOpen ? null : tpl.id)} className="flex w-full items-start gap-4 p-6 text-left">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ink-900 text-gold-500 transition-transform duration-300 group-hover:scale-105">
                      <Icon size={20} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-ink-900 dark:text-white">{tpl.title}</h3>
                        <Badge tone="gold">{tpl.category}</Badge>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-ink-500 dark:text-ink-300">{tpl.description}</p>
                      <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-ink-500 dark:text-ink-400">
                        <ListChecks size={13} /> {clauses.length} {t.templatesPage.clausesCount} · {tpl.fields.length} {t.templatesPage.fieldsCount}
                      </p>
                    </div>
                    <ChevronDown size={18} className={clsx('mt-1 shrink-0 text-ink-400 transition-transform duration-300', isOpen && 'rotate-180')} />
                  </button>

                  <div className="grid overflow-hidden transition-all duration-300 ease-out" style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}>
                    <div className="min-h-0">
                      <div className="space-y-4 border-t border-ink-100 px-6 py-5 dark:border-white/10">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">{t.templatesPage.clausesTitle}</p>
                          <ul className="mt-2 space-y-1.5">
                            {clauses.map((c) => (
                              <li key={c.id} className="flex items-center gap-2 text-sm text-ink-600 dark:text-ink-300">
                                <span className={clsx('h-1.5 w-1.5 shrink-0 rounded-full', c.optional ? 'bg-ink-300 dark:bg-white/20' : 'bg-gold-500')} />
                                {c.title}
                                {c.optional && <span className="text-xs text-ink-400">· {t.templatesPage.optional}</span>}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">{t.templatesPage.fieldsTitle}</p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {tpl.fields.map((f) => (
                              <span key={f.key} className="rounded-full bg-ink-50 px-2.5 py-1 text-xs text-ink-600 dark:bg-white/5 dark:text-ink-300">
                                {f.label}
                              </span>
                            ))}
                          </div>
                        </div>
                        <ButtonLink to="/app/login?mode=register" size="sm" variant="outline" iconRight={<ArrowUpRight size={14} />}>
                          {t.templatesPage.buildDraft}
                        </ButtonLink>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section ref={excludedRef} className="bg-ink-50 py-16 dark:bg-white/[0.02] lg:py-20">
        <div className="mx-auto max-w-4xl px-5 lg:px-8">
          <div className="reveal text-center">
            <Badge tone="red" className="mx-auto">{t.templatesPage.excludedBadge}</Badge>
            <h2 className="mt-4 text-2xl font-bold text-ink-950 sm:text-3xl dark:text-white">{t.templatesPage.excludedTitle}</h2>
            <p className="mx-auto mt-4 max-w-xl text-ink-500 dark:text-ink-300">
              {t.templatesPage.excludedDesc}
            </p>
          </div>
          <div className="reveal mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {t.templatesPage.excludedItems.map((e) => (
              <div key={e} className="flex items-start gap-2.5 rounded-xl border border-ink-100 bg-white p-4 text-sm text-ink-600 dark:border-white/10 dark:bg-ink-900 dark:text-ink-300">
                <XCircle size={16} className="mt-0.5 shrink-0 text-red-500" /> {e}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={ctaRef} className="px-5 py-20 lg:px-8 lg:py-28">
        <Card className="reveal mx-auto max-w-5xl overflow-hidden p-10 text-center sm:p-14">
          <CheckCircle2 className="mx-auto mb-5 text-emerald-500" size={30} />
          <h2 className="text-2xl font-bold text-ink-950 sm:text-3xl dark:text-white">{t.templatesPage.ctaTitle}</h2>
          <p className="mx-auto mt-4 max-w-lg text-ink-500 dark:text-ink-300">{t.templatesPage.ctaDesc}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink to="/app/login?mode=register" iconRight={<ArrowUpRight size={16} />}>{t.common.startFree}</ButtonLink>
            <ButtonLink to="/pricing" variant="outline">{t.nav.pricing}</ButtonLink>
          </div>
        </Card>
      </section>
    </div>
  )
}
