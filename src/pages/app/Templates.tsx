import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FileStack, ChevronDown, ListChecks, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ButtonLink } from '@/components/ui/Button'
import { useAppData } from '@/lib/store'

export default function Templates() {
  const { templates, clauses } = useAppData()
  const [openId, setOpenId] = useState<string | null>(templates[0]?.id || null)

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold text-ink-950">Библиотека шаблонов</h1>
          <p className="mt-1 text-sm text-ink-500">Из этих блоков ИИ собирает черновик под конкретную сделку.</p>
        </div>
        <ButtonLink to="/app/drafts/new" icon={<Sparkles size={16} />}>Создать черновик</ButtonLink>
      </div>

      <div className="space-y-4">
        {templates.map((t) => {
          const open = openId === t.id
          const tplClauses = t.clauseIds.map((cid) => clauses.find((c) => c.id === cid)!).filter(Boolean)
          return (
            <Card key={t.id} className="overflow-hidden">
              <button onClick={() => setOpenId(open ? null : t.id)} className="flex w-full items-center justify-between gap-4 p-5 text-left">
                <div className="flex items-center gap-3.5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink-900 text-gold-500">
                    <FileStack size={18} />
                  </span>
                  <div>
                    <p className="text-[15px] font-bold text-ink-900">{t.title}</p>
                    <p className="mt-0.5 text-xs text-ink-400">{t.description}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <Badge tone="neutral"><ListChecks size={11} className="mr-1 inline" />{tplClauses.length}</Badge>
                  <ChevronDown size={18} className={`text-ink-400 transition-transform ${open ? 'rotate-180' : ''}`} />
                </div>
              </button>
              {open && (
                <div className="border-t border-ink-100 bg-ink-50/40 p-5">
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {t.fields.map((f) => (
                      <Badge key={f.key} tone="gold">{f.label}</Badge>
                    ))}
                  </div>
                  <div className="space-y-3">
                    {tplClauses.map((c) => (
                      <div key={c.id} className="rounded-xl border border-ink-100 bg-white p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-bold text-ink-900">{c.title}</p>
                          {c.optional && <Badge tone="amber">Опционально</Badge>}
                        </div>
                        <p className="mt-1.5 text-xs leading-relaxed text-ink-500">{c.body}</p>
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
