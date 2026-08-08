import { Link } from 'react-router-dom'
import { Bell, BellRing, Check } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useAppData } from '@/lib/store'
import { severityBadge, severityLabel } from '@/lib/labels'

export default function Alerts() {
  const { alerts, templates, markAlertRead } = useAppData()
  const sorted = [...alerts].sort((a, b) => (a.date < b.date ? 1 : -1))

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink-900 text-gold-500"><BellRing size={19} /></span>
        <div>
          <h1 className="text-2xl font-bold text-ink-950">Изменения в законодательстве</h1>
          <p className="mt-1 text-sm text-ink-500">Уведомления формируются фоновым мониторингом и привязываются к затронутым делам.</p>
        </div>
      </div>

      <div className="space-y-3">
        {sorted.map((a) => {
          const affected = a.affectedTemplateIds.map((id) => templates.find((t) => t.id === id)?.title).filter(Boolean)
          return (
            <Card key={a.id} className={`p-5 ${!a.read ? 'border-gold-300 bg-gold-100/30' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Bell size={16} className={`mt-1 shrink-0 ${a.read ? 'text-ink-300' : 'text-gold-600'}`} />
                  <div>
                    <p className="text-sm font-bold text-ink-900">{a.title}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{a.summary}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      <Badge tone={severityBadge(a.severity)}>{severityLabel(a.severity)}</Badge>
                      {affected.map((t) => <Badge key={t} tone="neutral">{t}</Badge>)}
                      <span className="text-xs text-ink-400">{a.date}</span>
                    </div>
                  </div>
                </div>
                {!a.read && (
                  <Button size="sm" variant="ghost" icon={<Check size={14} />} onClick={() => markAlertRead(a.id)}>
                    Прочитано
                  </Button>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
