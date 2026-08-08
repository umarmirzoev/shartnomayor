import { RotateCcw, ShieldCheck, Sparkles, ClipboardList } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/Input'
import { useAppData, useAuth } from '@/lib/store'

export default function Settings() {
  const { user } = useAuth()
  const { lawyer, aiUsed, aiLimit, audit, resetDemoData } = useAppData()
  const usagePct = Math.round((aiUsed / aiLimit) * 100)

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-950">Настройки</h1>
        <p className="mt-1 text-sm text-ink-500">Профиль, тариф и журнал аудита действий в системе.</p>
      </div>

      <Card className="p-6">
        <h2 className="mb-4 text-sm font-bold text-ink-900">Профиль</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Полное имя"><Input defaultValue={user?.name} /></Field>
          <Field label="Email"><Input defaultValue={user?.email} /></Field>
          <Field label="Юридическое бюро"><Input defaultValue={lawyer.firm} /></Field>
          <Field label="Роль"><Input defaultValue="Юрист (единый интерфейс, без ролей на MVP)" disabled /></Field>
        </div>
        <Button size="sm" className="mt-5">Сохранить изменения</Button>
      </Card>

      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-bold text-ink-900"><Sparkles size={15} className="text-gold-600" /> Тариф и лимит ИИ</h2>
          <Badge tone="gold">Бесплатный</Badge>
        </div>
        <p className="text-2xl font-extrabold text-ink-950">{aiUsed} <span className="text-base font-medium text-ink-400">/ {aiLimit} запросов в месяц</span></p>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-ink-100">
          <div className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-600" style={{ width: `${usagePct}%` }} />
        </div>
        <div className="mt-4 rounded-xl border border-ink-100 bg-ink-50/60 p-3.5 text-xs leading-relaxed text-ink-500">
          Бесплатный уровень ИИ-провайдера может использовать данные запросов для улучшения моделей. Для реальных документов клиентов — платный тариф.
        </div>
        <Button variant="outline" size="sm" className="mt-4">Перейти на Про</Button>
      </Card>

      <Card className="p-6">
        <h2 className="mb-2 flex items-center gap-2 text-sm font-bold text-ink-900"><ShieldCheck size={15} /> Защита данных</h2>
        <p className="text-xs leading-relaxed text-ink-500">
          Ролевой доступ: вы видите только свои дела. Шифрование данных в покое и при передаче. Полное удаление документа по запросу — реальное уничтожение содержимого, а не архивирование.
        </p>
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-ink-900"><ClipboardList size={15} /> Журнал аудита</h2>
        <div className="space-y-3">
          {audit.slice(0, 8).map((a) => (
            <div key={a.id} className="flex items-start justify-between gap-3 border-b border-ink-50 pb-3 text-xs last:border-0">
              <div>
                <p className="font-semibold text-ink-800">{a.action}</p>
                <p className="text-ink-400">{a.target}</p>
              </div>
              <div className="shrink-0 text-right text-ink-400">
                <p>{a.actor}</p>
                <p>{a.date}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-2 text-sm font-bold text-ink-900">Демо-данные</h2>
        <p className="mb-4 text-xs text-ink-500">Сбросить все изменения в этом браузере и вернуть исходные демо-данные.</p>
        <Button variant="outline" size="sm" icon={<RotateCcw size={14} />} onClick={resetDemoData}>Сбросить демо-данные</Button>
      </Card>
    </div>
  )
}
