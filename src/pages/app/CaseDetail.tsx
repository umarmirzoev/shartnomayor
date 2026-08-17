import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, FileText, Sparkles, User2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ButtonLink } from '@/components/ui/Button'
import { useAppData } from '@/lib/store'
import { caseStatusBadge, caseStatusLabel, statusBadge, statusLabel } from '@/lib/labels'
import { useT } from '@/lib/i18n/context'
import { localizeCaseTitle, localizeDraftTitle } from '@/lib/seedText'

export default function CaseDetail() {
  const t = useT()
  const { id } = useParams()
  const { cases, clients, drafts, templates } = useAppData()
  const item = cases.find((c) => c.id === id)
  const client = clients.find((c) => c.id === item?.clientId)
  const caseDrafts = drafts.filter((d) => d.caseId === id)

  if (!item) {
    return <p className="text-sm text-ink-500 dark:text-ink-400">{t.app.caseDetail.notFound} <Link to="/app/cases" className="underline">{t.app.clientDetail.backToList}</Link></p>
  }

  return (
    <div className="max-w-4xl">
      <Link to="/app/cases" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition-colors duration-200 hover:text-ink-900 dark:text-ink-400 dark:hover:text-white">
        <ArrowLeft size={15} /> {t.app.caseDetail.backLink}
      </Link>

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-ink-950 dark:text-white">{localizeCaseTitle(item, t)}</h1>
            <Badge tone={caseStatusBadge(item.status)}>{caseStatusLabel(item.status, t)}</Badge>
          </div>
          {client && (
            <Link to={`/app/clients/${client.id}`} className="mt-2 inline-flex items-center gap-1.5 text-sm text-ink-500 transition-colors duration-200 hover:text-ink-900 dark:text-ink-400 dark:hover:text-white">
              <User2 size={14} /> {client.name}
            </Link>
          )}
        </div>
        <ButtonLink to="/app/drafts/new" icon={<Sparkles size={16} />}>{t.app.caseDetail.newDraft}</ButtonLink>
      </div>

      <h2 className="mb-3 text-sm font-bold text-ink-900 dark:text-white">{t.app.caseDetail.docsTitle} ({caseDrafts.length})</h2>
      <div className="space-y-3">
        {caseDrafts.map((d) => {
          const tpl = templates.find((tp) => tp.id === d.templateId)
          return (
            <Link key={d.id} to={`/app/drafts/${d.id}`}>
              <Card className="flex items-center justify-between gap-3 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft">
                <span className="flex items-center gap-3 text-sm font-semibold text-ink-900 dark:text-white">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-100 text-ink-500 dark:bg-white/10 dark:text-ink-300"><FileText size={16} /></span>
                  <span>
                    {localizeDraftTitle(d, t)}
                    <span className="block text-xs font-normal text-ink-400 dark:text-ink-500">{tpl?.title} · {t.app.caseDetail.updated} {d.updatedAt}</span>
                  </span>
                </span>
                <Badge tone={statusBadge(d.status)}>{statusLabel(d.status, t)}</Badge>
              </Card>
            </Link>
          )
        })}
        {caseDrafts.length === 0 && <p className="text-sm text-ink-400 dark:text-ink-500">{t.app.caseDetail.noDocs}</p>}
      </div>
    </div>
  )
}
