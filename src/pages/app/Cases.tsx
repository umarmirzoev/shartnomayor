import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Briefcase, ArrowUpRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input, Select } from '@/components/ui/Input'
import { useAppData } from '@/lib/store'
import { caseStatusBadge, caseStatusLabel } from '@/lib/labels'

export default function Cases() {
  const { cases, clients, drafts } = useAppData()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')

  const filtered = useMemo(
    () =>
      cases.filter((c) => {
        const matchesQuery = c.title.toLowerCase().includes(query.toLowerCase())
        const matchesStatus = status === 'all' || c.status === status
        return matchesQuery && matchesStatus
      }),
    [cases, query, status]
  )

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink-950">Дела</h1>
        <p className="mt-1 text-sm text-ink-500">{cases.length} дел, {cases.filter((c) => c.status === 'active').length} активных</p>
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative max-w-sm flex-1">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" />
          <Input className="pl-10" placeholder="Поиск по названию дела…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <Select className="max-w-[180px]" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">Все статусы</option>
          <option value="active">Активные</option>
          <option value="closed">Закрытые</option>
          <option value="archived">В архиве</option>
        </Select>
      </div>

      <div className="space-y-3">
        {filtered.map((c) => {
          const client = clients.find((cl) => cl.id === c.clientId)
          const docsCount = drafts.filter((d) => d.caseId === c.id).length
          return (
            <Link key={c.id} to={`/app/cases/${c.id}`}>
              <Card className="flex flex-col justify-between gap-3 p-5 transition hover:-translate-y-0.5 hover:shadow-soft sm:flex-row sm:items-center">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink-100 text-ink-500">
                    <Briefcase size={17} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-ink-900">{c.title}</p>
                    <p className="mt-0.5 text-xs text-ink-400">{client?.name} · {docsCount} документ(ов) · открыто {c.createdAt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge tone={caseStatusBadge(c.status)}>{caseStatusLabel(c.status)}</Badge>
                  <ArrowUpRight size={15} className="text-ink-300" />
                </div>
              </Card>
            </Link>
          )
        })}
        {filtered.length === 0 && <p className="text-sm text-ink-400">Ничего не найдено</p>}
      </div>
    </div>
  )
}
