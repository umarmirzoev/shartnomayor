import { useMemo, useState } from 'react'
import { HelpCircle, Search, ChevronDown, MailQuestion, ArrowUpRight } from 'lucide-react'
import clsx from 'clsx'
import { ButtonAnchor } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { PageHero } from '@/components/marketing/PageHero'
import { useReveal } from '@/hooks/useReveal'
import { useT } from '@/lib/i18n/context'

export default function Faq() {
  const t = useT()
  const faqData = t.faqPage.groups
  const [query, setQuery] = useState('')
  const [openKey, setOpenKey] = useState<string | null>(null)
  const listRef = useReveal<HTMLDivElement>()
  const ctaRef = useReveal<HTMLDivElement>()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return faqData
    return faqData
      .map((group) => ({
        ...group,
        items: group.items.filter((i) => i.q.toLowerCase().includes(q) || i.a.toLowerCase().includes(q)),
      }))
      .filter((group) => group.items.length > 0)
  }, [query, faqData])

  const totalCount = faqData.reduce((n, g) => n + g.items.length, 0)

  return (
    <div className="reveal-root">
      <PageHero
        eyebrow={t.faqPage.eyebrow}
        icon={<HelpCircle size={13} />}
        title={t.faqPage.title}
        description={`${totalCount} ${t.faqPage.subtitle}`}
      >
        <div className="relative w-full max-w-md">
          <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.faqPage.searchPlaceholder}
            className="w-full rounded-xl border border-ink-200 bg-white py-3 pl-11 pr-4 text-sm text-ink-900 outline-none transition-all duration-200 placeholder:text-ink-400 focus:border-gold-400 focus:ring-2 focus:ring-gold-200 dark:border-white/15 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-ink-500 dark:focus:border-gold-500/50 dark:focus:ring-gold-500/20"
          />
        </div>
      </PageHero>

      <section ref={listRef} className="pb-20 lg:pb-28">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          {filtered.length === 0 && (
            <p className="reveal py-16 text-center text-sm text-ink-400">{t.faqPage.notFound} «{query}». {t.faqPage.tryOther}</p>
          )}
          <div className="space-y-10">
            {filtered.map((group, gi) => (
              <div key={group.category} className="reveal" style={{ transitionDelay: `${gi * 60}ms` }}>
                <Badge tone="neutral" className="mb-4">{group.category}</Badge>
                <div className="divide-y divide-ink-100 rounded-2xl border border-ink-100 dark:divide-white/10 dark:border-white/10">
                  {group.items.map((item) => {
                    const key = `${group.category}-${item.q}`
                    const isOpen = openKey === key
                    return (
                      <div key={key}>
                        <button
                          onClick={() => setOpenKey(isOpen ? null : key)}
                          className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors duration-200 hover:bg-ink-50/60 dark:hover:bg-white/[0.03]"
                        >
                          <span className="text-sm font-semibold text-ink-900 dark:text-white">{item.q}</span>
                          <ChevronDown size={18} className={clsx('shrink-0 text-ink-400 transition-transform duration-300', isOpen && 'rotate-180')} />
                        </button>
                        <div className="grid overflow-hidden transition-all duration-300 ease-out" style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}>
                          <div className="min-h-0">
                            <div className="px-6 pb-5 text-sm leading-relaxed text-ink-500 dark:text-ink-300">{item.a}</div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={ctaRef} className="px-5 pb-24 lg:px-8">
        <Card className="reveal mx-auto flex max-w-4xl flex-col items-center gap-5 overflow-hidden p-10 text-center sm:flex-row sm:text-left">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-ink-900 text-gold-500 dark:bg-white/10">
            <MailQuestion size={26} />
          </span>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-ink-950 dark:text-white">{t.faqPage.contactTitle}</h2>
            <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">{t.faqPage.contactDesc}</p>
          </div>
          <ButtonAnchor href="mailto:hello@shartnomayor.tj" variant="outline" iconRight={<ArrowUpRight size={16} />} className="shrink-0">
            {t.faqPage.contactCta}
          </ButtonAnchor>
        </Card>
      </section>
    </div>
  )
}
