import { useMemo, useState } from 'react'
import { FileStack, ChevronDown, ListChecks, Sparkles, HandCoins, Home, ScrollText, Briefcase, FileText, Search } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ButtonLink } from '@/components/ui/Button'
import { fillClausePreview } from '@/lib/format'
import type { Template } from '@/lib/types'
import { useT } from '@/lib/i18n/context'
import type { Dict } from '@/lib/i18n'
import { useAppData } from '@/lib/store'

const iconMap: Record<string, typeof HandCoins> = {
  'tpl-supply': HandCoins,
  'tpl-lease': Home,
  'tpl-nda': ScrollText,
  'tpl-labor': Briefcase,
}

function FileThumb({ t, active, onSelect }: { t: Template; active: boolean; onSelect: () => void }) {
  const Icon = iconMap[t.id] ?? FileText
  return (
    <button onClick={onSelect} className="group w-[152px] shrink-0 text-left" title={t.title}>
      <div
        className={`relative aspect-[3/4] w-full overflow-hidden rounded-lg border bg-white shadow-card transition-all duration-200 group-hover:-translate-y-1 group-hover:border-gold-300 group-hover:shadow-soft ${
          active ? 'border-ink-300' : 'border-ink-100'
        }`}
      >
        {/* page-corner fold flourish */}
        <div
          className="absolute right-0 top-0 h-4 w-4 bg-ink-50"
          style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
        />

        {/* colored header band, like a doc title bar */}
        <div className="flex h-8 items-center gap-1.5 bg-gradient-to-r from-ink-900 to-ink-800 px-2.5">
          <span className="flex h-[18px] w-[18px] items-center justify-center rounded bg-gold-500/20 text-gold-400">
            <Icon size={10} />
          </span>
          <div className="h-1 w-10 rounded-full bg-white/20" />
        </div>

        {/* faux page content: distinct sections (heading + body lines), not one flat stack */}
        <div className="space-y-3 p-3">
          <Section widths={['w-2/5', 'w-4/5', 'w-3/5']} />
          <Section widths={['w-1/3', 'w-full', 'w-2/3']} />
          <Section widths={['w-2/5', 'w-3/5']} />
        </div>
      </div>
      <p className="mt-2 truncate text-xs font-semibold text-ink-800">{t.title}</p>
      <p className="truncate text-[11px] text-ink-400">{t.category}</p>
    </button>
  )
}

function Section({ widths }: { widths: string[] }) {
  const [headingW, ...bodyW] = widths
  return (
    <div className="space-y-1.5">
      <div className={`h-1.5 ${headingW} rounded-full bg-ink-300`} />
      {bodyW.map((w, i) => (
        <div key={i} className={`h-1 ${w} rounded-full bg-ink-100`} />
      ))}
    </div>
  )
}

export default function Templates() {
  const t = useT() as Dict
  const { templates, clauses } = useAppData()
  const [openId, setOpenId] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return templates
    return templates.filter(
      (tpl) => tpl.title.toLowerCase().includes(q) || tpl.category.toLowerCase().includes(q)
    )
  }, [templates, query])

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold text-ink-950">{t.app.templates.title}</h1>
          <p className="mt-1 text-sm text-ink-500">{t.app.templates.subtitle} · {templates.length}</p>
        </div>
        <ButtonLink to="/app/drafts/new" icon={<Sparkles size={16} />}>{t.app.templates.createDraft}</ButtonLink>
      </div>

      {templates.length > 8 && (
        <div className="relative mb-6 max-w-sm">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.common.search}
            className="w-full rounded-lg border border-ink-200 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-ink-400"
          />
        </div>
      )}

      <div className="mb-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-400">{t.app.templates.chooseType}</p>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {filtered.slice(0, 40).map((tpl) => (
            <FileThumb key={tpl.id} t={tpl} active={openId === tpl.id} onSelect={() => setOpenId(tpl.id)} />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 && <p className="text-sm text-ink-400">{t.common.notFoundShort}</p>}
        {filtered.map((tpl) => {
          const open = openId === tpl.id
          const tplClauses = open ? tpl.clauseIds.map((cid) => clauses.find((c) => c.id === cid)!).filter(Boolean) : []
          return (
            <Card key={tpl.id} className="overflow-hidden">
              <button onClick={() => setOpenId(open ? null : tpl.id)} className="flex w-full items-center justify-between gap-4 p-5 text-left">
                <div className="flex items-center gap-3.5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink-900 text-gold-500">
                    <FileStack size={18} />
                  </span>
                  <div>
                    <p className="text-[15px] font-bold text-ink-900">{tpl.title}</p>
                    <p className="mt-0.5 text-xs text-ink-400">{tpl.description}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <Badge tone="neutral"><ListChecks size={11} className="mr-1 inline" />{tpl.clauseIds.length}</Badge>
                  <ChevronDown size={18} className={`text-ink-400 transition-transform ${open ? 'rotate-180' : ''}`} />
                </div>
              </button>
              {open && (
                <div className="border-t border-ink-100 bg-ink-50/40 p-5">
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {tpl.fields.map((f) => (
                      <Badge key={f.key} tone="gold">{f.label}</Badge>
                    ))}
                  </div>
                  <div className="space-y-3">
                    {tplClauses.map((c) => (
                      <div key={c.id} className="rounded-xl border border-ink-100 bg-white p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-bold text-ink-900">{c.title}</p>
                          {c.optional && <Badge tone="amber">{t.app.templates.optional}</Badge>}
                        </div>
                        <p className="mt-1.5 text-xs leading-relaxed text-ink-500">{fillClausePreview(c.body, tpl.fields)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
