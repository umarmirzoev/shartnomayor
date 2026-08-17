import { RotateCcw, ShieldCheck, Sparkles, ClipboardList } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/Input'
import { useAppData, useAuth } from '@/lib/store'
import { useT } from '@/lib/i18n/context'
import { localizedLawyerFirm, localizeAuditEntry } from '@/lib/seedText'

export default function Settings() {
  const t = useT()
  const { user } = useAuth()
  const { aiUsed, aiLimit, audit, resetDemoData } = useAppData()
  const usagePct = Math.round((aiUsed / aiLimit) * 100)

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-950 dark:text-white">{t.app.settings.title}</h1>
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{t.app.settings.subtitle}</p>
      </div>

      <Card className="p-6">
        <h2 className="mb-4 text-sm font-bold text-ink-900 dark:text-white">{t.app.settings.profile}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={t.app.settings.fullName}><Input defaultValue={user?.name} /></Field>
          <Field label={t.app.settings.email}><Input defaultValue={user?.email} /></Field>
          <Field label={t.app.settings.firm}><Input defaultValue={localizedLawyerFirm(t)} /></Field>
          <Field label={t.app.settings.role}><Input defaultValue={t.app.settings.roleValue} disabled /></Field>
        </div>
        <Button size="sm" className="mt-5">{t.app.settings.saveChanges}</Button>
      </Card>

      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-bold text-ink-900 dark:text-white"><Sparkles size={15} className="text-gold-600" /> {t.app.settings.planAndLimit}</h2>
          <Badge tone="gold">{t.common.freeBadge}</Badge>
        </div>
        <p className="text-2xl font-extrabold text-ink-950 dark:text-white">{aiUsed} <span className="text-base font-medium text-ink-400 dark:text-ink-500">/ {aiLimit} {t.app.settings.requestsPerMonth}</span></p>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-ink-100 dark:bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-600" style={{ width: `${usagePct}%` }} />
        </div>
        <div className="mt-4 rounded-xl border border-ink-100 bg-ink-50/60 p-3.5 text-xs leading-relaxed text-ink-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-ink-400">
          {t.app.settings.freeProviderNote}
        </div>
        <Button variant="outline" size="sm" className="mt-4">{t.app.settings.upgradeToPro}</Button>
      </Card>

      <Card className="p-6">
        <h2 className="mb-2 flex items-center gap-2 text-sm font-bold text-ink-900 dark:text-white"><ShieldCheck size={15} /> {t.app.settings.dataProtection}</h2>
        <p className="text-xs leading-relaxed text-ink-500 dark:text-ink-400">
          {t.app.settings.dataProtectionText}
        </p>
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-ink-900 dark:text-white"><ClipboardList size={15} /> {t.app.settings.auditLog}</h2>
        <div className="space-y-3">
          {audit.slice(0, 8).map((a) => {
            const { action, target } = localizeAuditEntry(a, t)
            return (
              <div key={a.id} className="flex items-start justify-between gap-3 border-b border-ink-50 pb-3 text-xs last:border-0 dark:border-white/10">
                <div>
                  <p className="font-semibold text-ink-800 dark:text-ink-200">{action}</p>
                  <p className="text-ink-400 dark:text-ink-500">{target}</p>
                </div>
                <div className="shrink-0 text-right text-ink-400 dark:text-ink-500">
                  <p>{a.actor}</p>
                  <p>{a.date}</p>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-2 text-sm font-bold text-ink-900 dark:text-white">{t.app.settings.demoData}</h2>
        <p className="mb-4 text-xs text-ink-500 dark:text-ink-400">{t.app.settings.demoDataText}</p>
        <Button variant="outline" size="sm" icon={<RotateCcw size={14} />} onClick={resetDemoData}>{t.app.settings.resetDemoData}</Button>
      </Card>
    </div>
  )
}
