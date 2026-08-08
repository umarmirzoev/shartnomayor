import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, FileText, Sparkles, User2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ButtonLink } from '@/components/ui/Button'
import { useAppData } from '@/lib/store'
import { caseStatusBadge, caseStatusLabel, statusBadge, statusLabel } from '@/lib/labels'

export default function CaseDetail() {
  const { id } = useParams()
  const { cases, clients, drafts, templates } = useAppData()
  const item = cases.find((c) => c.id === id)
  const client = clients.find((c) => c.id === item?.clientId)
  const caseDrafts = drafts.filter((d) => d.caseId === id)

  if (!item) {
    return <p className="text-sm text-ink-500">Дело не найдено. <Link to="/app/cases" className="underline">Назад к списку</Link></p>
  }

  return (
    <div className="max-w-4xl">
      <Link to="/app/cases" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-900">
        <ArrowLeft size={15} /> Дела
      </Link>

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-ink-950">{item.title}</h1>
            <Badge tone={caseStatusBadge(item.status)}>{caseStatusLabel(item.status)}</Badge>
          </div>
          {client && (
            <Link to={`/app/clients/${client.id}`} className="mt-2 inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-900">
              <User2 size={14} /> {client.name}
            </Link>
          )}
        </div>
        <ButtonLink to="/app/drafts/new" icon={<Sparkles size={16} />}>Новый черновик по делу</ButtonLink>
      </div>

      <h2 className="mb-3 text-sm font-bold text-ink-900">Документы дела ({caseDrafts.length})</h2>
      <div className="space-y-3">
        {caseDrafts.map((d) => {
          const tpl = templates.find((t) => t.id === d.templateId)
          return (
            <Link key={d.id} to={`/app/drafts/${d.id}`}>
              <Card className="flex items-center justify-between gap-3 p-4 transition hover:-translate-y-0.5 hover:shadow-soft">
                <span className="flex items-center gap-3 text-sm font-semibold text-ink-900">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-100 text-ink-500"><FileText size={16} /></span>
                  <span>
                    {d.title}
                    <span className="block text-xs font-normal text-ink-400">{tpl?.title} · обновлено {d.updatedAt}</span>
                  </span>
                </span>
                <Badge tone={statusBadge(d.status)}>{statusLabel(d.status)}</Badge>
              </Card>
            </Link>
          )
        })}
        {caseDrafts.length === 0 && <p className="text-sm text-ink-400">По этому делу пока нет документов.</p>}
      </div>
    </div>
  )
}
