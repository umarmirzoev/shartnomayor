import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Briefcase, ArrowUpRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input, Select } from '@/components/ui/Input'
import { useAppData } from '@/lib/store'
import { caseStatusBadge, caseStatusLabel } from '@/lib/labels'
import { useT } from '@/lib/i18n/context'
import { localizeCaseTitle } from '@/lib/seedText'

export default function Cases() {
  const t = useT()
  const { cases, clients, drafts } = useAppData()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')

  const filtered = useMemo(
    () =>
      cases.filter((c) => {
        const matchesQuery = localizeCaseTitle(c, t).toLowerCase().includes(query.toLowerCase())
        const matchesStatus = status === 'all' || c.status === status
        return matchesQuery && matchesStatus
      }),
    [cases, query, status, t]
  )

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink-950 dark:text-white">{t.app.cases.title}</h1>
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{cases.length} {t.app.cases.countTotal}, {cases.filter((c) => c.status === 'active').length} {t.app.cases.countActive}</p>
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative max-w-sm flex-1">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300 dark:text-ink-500" />
          <Input className="pl-10" placeholder={t.app.cases.searchPlaceholder} value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <Select className="max-w-[180px]" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">{t.app.cases.statusAll}</option>
          <option value="active">{t.app.cases.statusActive}</option>
          <option value="closed">{t.app.cases.statusClosed}</option>
          <option value="archived">{t.app.cases.statusArchived}</option>
        </Select>
      </div>

      <div className="space-y-3">
        {filtered.map((c) => {
          const client = clients.find((cl) => cl.id === c.clientId)
          const docsCount = drafts.filter((d) => d.caseId === c.id).length
          return (
            <Link key={c.id} to={`/app/cases/${c.id}`}>
              <Card className="group flex flex-col justify-between gap-3 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft sm:flex-row sm:items-center">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink-100 text-ink-500 dark:bg-white/10 dark:text-ink-300">
                    <Briefcase size={17} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-ink-900 dark:text-white">{localizeCaseTitle(c, t)}</p>
                    <p className="mt-0.5 text-xs text-ink-400 dark:text-ink-500">{client?.name} · {docsCount} {t.app.cases.docsCount} · {t.app.cases.openedAt} {c.createdAt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge tone={caseStatusBadge(c.status)}>{caseStatusLabel(c.status, t)}</Badge>
                  <ArrowUpRight size={15} className="text-ink-300 transition-transform duration-200 group-hover:translate-x-0.5 dark:text-ink-500" />
                </div>
              </Card>
            </Link>
          )
        })}
        {filtered.length === 0 && <p className="text-sm text-ink-400 dark:text-ink-500">{t.common.notFoundShort}</p>}
      </div>
    </div>
  )
}
