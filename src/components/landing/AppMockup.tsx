import { FileText, Sparkles, CheckCircle2, Clock, Users, Bell } from 'lucide-react'
import { useT } from '@/lib/i18n/context'
import { useLanguage } from '@/lib/i18n/context'
import { langLabels } from '@/lib/i18n'

export function AppMockup() {
  const t = useT()
  const { lang } = useLanguage()

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <div className="absolute -inset-x-6 -top-6 -bottom-10 -z-10 rounded-[2.5rem] bg-gradient-to-br from-gold-200/50 via-ink-100/40 to-transparent blur-2xl" />
      <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-2xl shadow-ink-900/10">
        <div className="flex items-center gap-1.5 border-b border-ink-100 bg-ink-50 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
          <span className="ml-3 rounded-md bg-white px-3 py-1 text-[11px] text-ink-400 border border-ink-100">app.shartnomayor.tj/dashboard</span>
        </div>
        <div className="grid grid-cols-[15px_1fr]">
          <div />
          <div className="grid grid-cols-[190px_1fr]">
            <div className="hidden border-r border-ink-100 bg-ink-50/60 p-4 sm:block">
              <div className="mb-4 flex items-center gap-2 px-1">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-ink-900 text-gold-500"><FileText size={12} /></span>
                <span className="text-xs font-bold text-ink-900">{t.common.brand}</span>
              </div>
              <div className="space-y-1">
                {[
                  { label: t.app.layout.dashboard, active: true },
                  { label: t.app.layout.clients },
                  { label: t.app.layout.cases },
                  { label: t.app.layout.newDraft, accent: true },
                  { label: t.app.layout.templates },
                ].map((i) => (
                  <div key={i.label} className={`rounded-lg px-2.5 py-1.5 text-[11px] font-medium ${i.accent ? 'bg-ink-900 text-white' : i.active ? 'bg-gold-100 text-ink-900' : 'text-ink-500'}`}>
                    {i.label}
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-bold text-ink-900">{t.app.dashboard.welcome}, Фарход</p>
                  <p className="text-[11px] text-ink-400">7 / 20 · {t.app.dashboard.aiLimit}</p>
                </div>
                <span className="flex items-center gap-1 rounded-full bg-gold-100 px-2.5 py-1 text-[10px] font-bold text-gold-700"><Sparkles size={10} /> {langLabels[lang]}</span>
              </div>
              <div className="mb-3 grid grid-cols-3 gap-2.5">
                {[
                  { icon: FileText, label: t.app.dashboard.statDrafts, value: '4' },
                  { icon: Users, label: t.app.dashboard.statClients, value: '5' },
                  { icon: Bell, label: t.app.dashboard.statAlerts, value: '2' },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-ink-100 bg-white p-2.5">
                    <s.icon size={13} className="mb-1.5 text-gold-600" />
                    <p className="text-base font-extrabold text-ink-900 leading-none">{s.value}</p>
                    <p className="mt-1 text-[10px] text-ink-400">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-ink-100 bg-white p-3">
                <p className="mb-2 text-[11px] font-bold text-ink-700">{t.app.dashboard.recentDrafts}</p>
                {[
                  { title: 'NDA — Помир Технолоджис', status: t.labels.draftStatus.ready, icon: CheckCircle2, tone: 'text-emerald-500' },
                  { title: 'Аренда офиса — пр. Рудаки', status: t.labels.draftStatus.in_review, icon: Clock, tone: 'text-amber-500' },
                ].map((d) => (
                  <div key={d.title} className="flex items-center justify-between border-t border-ink-50 py-2 first:border-t-0">
                    <span className="flex items-center gap-1.5 text-[11px] text-ink-700">
                      <FileText size={12} className="text-ink-300" />
                      {d.title}
                    </span>
                    <span className={`flex items-center gap-1 text-[10px] font-semibold ${d.tone}`}>
                      <d.icon size={11} /> {d.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
