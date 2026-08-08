import { Link } from 'react-router-dom'
import { FileText, Users, Briefcase, Bell, Sparkles, ArrowUpRight, Clock3 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ButtonLink } from '@/components/ui/Button'
import { useAppData, useAuth } from '@/lib/store'
import { statusBadge, statusLabel } from '@/lib/labels'

export default function Dashboard() {
  const { drafts, clients, cases, alerts, aiUsed, aiLimit, templates } = useAppData()
  const { user } = useAuth()
  const unreadAlerts = alerts.filter((a) => !a.read)
  const recentDrafts = [...drafts].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1)).slice(0, 5)
  const usagePct = Math.round((aiUsed / aiLimit) * 100)

  return (
    <div className="max-w-6xl">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold text-ink-950">С возвращением, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="mt-1 text-sm text-ink-500">Вот что происходит в ваших делах сегодня.</p>
        </div>
        <ButtonLink to="/app/drafts/new" icon={<Sparkles size={16} />}>Новый черновик</ButtonLink>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={FileText} label="Черновики" value={drafts.length} to="/app/cases" />
        <StatCard icon={Users} label="Клиенты" value={clients.length} to="/app/clients" />
        <StatCard icon={Briefcase} label="Активные дела" value={cases.filter((c) => c.status === 'active').length} to="/app/cases" />
        <StatCard icon={Bell} label="Уведомления" value={unreadAlerts.length} to="/app/alerts" accent={unreadAlerts.length > 0} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-ink-900">Последние черновики</h2>
            <Link to="/app/cases" className="text-xs font-semibold text-ink-500 hover:text-ink-900">Все дела →</Link>
          </div>
          <div className="divide-y divide-ink-100">
            {recentDrafts.map((d) => {
              const tpl = templates.find((t) => t.id === d.templateId)
              return (
                <Link key={d.id} to={`/app/drafts/${d.id}`} className="flex items-center justify-between gap-3 py-3.5 transition hover:bg-ink-50 -mx-2 px-2 rounded-lg">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink-100 text-ink-500">
                      <FileText size={16} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink-900">{d.title}</p>
                      <p className="text-xs text-ink-400">{tpl?.title} · обновлено {d.updatedAt}</p>
                    </div>
                  </div>
                  <Badge tone={statusBadge(d.status)}>{statusLabel(d.status)}</Badge>
                </Link>
              )
            })}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-bold text-ink-900">Лимит ИИ-запросов</h2>
              <Badge tone="gold">Бесплатный</Badge>
            </div>
            <p className="text-2xl font-extrabold text-ink-950">{aiUsed} <span className="text-base font-medium text-ink-400">/ {aiLimit}</span></p>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-ink-100">
              <div className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-600" style={{ width: `${usagePct}%` }} />
            </div>
            <p className="mt-3 text-xs text-ink-400">Обновляется в начале каждого месяца. Платный тариф снимает лимит.</p>
          </Card>

          <Card className="p-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-bold text-ink-900">Изменения в законе</h2>
              <Link to="/app/alerts" className="text-xs font-semibold text-ink-500 hover:text-ink-900">Все →</Link>
            </div>
            <div className="space-y-3">
              {unreadAlerts.slice(0, 2).map((a) => (
                <div key={a.id} className="flex gap-2.5 text-xs">
                  <Clock3 size={14} className="mt-0.5 shrink-0 text-amber-500" />
                  <p className="leading-snug text-ink-600">{a.title}</p>
                </div>
              ))}
              {unreadAlerts.length === 0 && <p className="text-xs text-ink-400">Новых уведомлений нет.</p>}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, to, accent }: { icon: typeof FileText; label: string; value: number; to: string; accent?: boolean }) {
  return (
    <Link to={to}>
      <Card className="group p-5 transition hover:-translate-y-0.5 hover:shadow-soft">
        <div className="flex items-center justify-between">
          <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent ? 'bg-red-50 text-red-500' : 'bg-ink-100 text-ink-500'}`}>
            <Icon size={18} />
          </span>
          <ArrowUpRight size={15} className="text-ink-300 opacity-0 transition group-hover:opacity-100" />
        </div>
        <p className="mt-4 text-2xl font-extrabold text-ink-950">{value}</p>
        <p className="text-xs text-ink-400">{label}</p>
      </Card>
    </Link>
  )
}
