import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, Loader2, FileStack } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Field, Input, Select, Textarea } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { useAppData } from '@/lib/store'
import { simulateAiGeneration, aiStages } from '@/lib/ai'
import { parseContent } from '@/lib/format'
import * as Icons from 'lucide-react'

const steps = ['Дело и шаблон', 'Описание сделки', 'Сборка ИИ', 'Проверка']

export default function DraftNew() {
  const { cases, clients, templates, addDraft, addVersion, incAiUsage, aiUsed, aiLimit } = useAppData()
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [caseId, setCaseId] = useState(cases[0]?.id || '')
  const [templateId, setTemplateId] = useState(templates[0].id)
  const [dealDescription, setDealDescription] = useState('')
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({})
  const [generating, setGenerating] = useState(false)
  const [stageIdx, setStageIdx] = useState(0)
  const [generated, setGenerated] = useState('')

  const template = templates.find((t) => t.id === templateId)!
  const activeCase = cases.find((c) => c.id === caseId)
  const client = clients.find((c) => c.id === activeCase?.clientId)
  const limitReached = aiUsed >= aiLimit

  const canStep0 = !!caseId && !!templateId
  const canStep1 = dealDescription.trim().length > 8

  const runGeneration = async () => {
    setStep(2)
    setGenerating(true)
    setStageIdx(0)
    const interval = setInterval(() => setStageIdx((i) => Math.min(i + 1, aiStages.length - 1)), 700)
    const content = await simulateAiGeneration(templateId, fieldValues)
    clearInterval(interval)
    setGenerated(content)
    incAiUsage()
    setGenerating(false)
    setStep(3)
  }

  const createDraft = () => {
    const draft = addDraft({
      caseId,
      templateId,
      title: `${template.title} — ${client?.name || 'Новый черновик'}`,
      status: 'draft',
      currentVersionId: '',
      responsibilityConfirmed: false,
    })
    addVersion({ draftId: draft.id, content: generated, note: 'Черновик собран ИИ по описанию сделки', author: 'ИИ-ассистент' })
    navigate(`/app/drafts/${draft.id}`)
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink-950">Новый черновик</h1>
        <p className="mt-1 text-sm text-ink-500">Опишите сделку — ИИ соберёт черновик из библиотеки проверенных пунктов.</p>
      </div>

      <Steps step={step} />

      {step === 0 && (
        <Card className="mt-6 p-6">
          <div className="space-y-5">
            <Field label="Дело" required hint={cases.length === 0 ? 'Сначала создайте клиента и дело' : undefined}>
              <Select value={caseId} onChange={(e) => setCaseId(e.target.value)}>
                {cases.map((c) => {
                  const cl = clients.find((x) => x.id === c.clientId)
                  return <option key={c.id} value={c.id}>{c.title} — {cl?.name}</option>
                })}
              </Select>
            </Field>

            <div>
              <span className="mb-2 block text-sm font-semibold text-ink-800">Тип договора</span>
              <div className="grid grid-cols-2 gap-3">
                {templates.map((t) => {
                  const active = t.id === templateId
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTemplateId(t.id)}
                      className={`rounded-xl border p-4 text-left transition ${active ? 'border-ink-900 bg-ink-50 ring-1 ring-ink-900' : 'border-ink-200 hover:border-ink-400'}`}
                    >
                      <FileStack size={16} className={active ? 'text-gold-600' : 'text-ink-400'} />
                      <p className="mt-2 text-sm font-bold text-ink-900">{t.title}</p>
                      <p className="mt-0.5 text-xs text-ink-400">{t.category}</p>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button disabled={!canStep0} onClick={() => setStep(1)} iconRight={<ArrowRight size={16} />}>Далее</Button>
          </div>
        </Card>
      )}

      {step === 1 && (
        <Card className="mt-6 p-6">
          <div className="space-y-5">
            <Field label="Опишите сделку своими словами" required hint="Например: кто стороны, что за сделка, ключевые условия">
              <Textarea
                rows={4}
                value={dealDescription}
                onChange={(e) => setDealDescription(e.target.value)}
                placeholder={`Например: ${client?.name || 'Клиент'} заключает ${template.title.toLowerCase()} с контрагентом. Нужно предусмотреть...`}
              />
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {template.fields.map((f) => (
                <Field key={f.key} label={f.label}>
                  <Input
                    value={fieldValues[f.key] || ''}
                    onChange={(e) => setFieldValues((v) => ({ ...v, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                  />
                </Field>
              ))}
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <Button variant="ghost" onClick={() => setStep(0)} icon={<ArrowLeft size={16} />}>Назад</Button>
            {limitReached ? (
              <Badge tone="red">Лимит ИИ-запросов исчерпан на этот месяц</Badge>
            ) : (
              <Button disabled={!canStep1} onClick={runGeneration} icon={<Sparkles size={16} />}>Собрать черновик ИИ</Button>
            )}
          </div>
        </Card>
      )}

      {step === 2 && (
        <Card className="mt-6 flex flex-col items-center justify-center gap-5 p-14 text-center">
          <div className="relative">
            <Loader2 size={44} className="animate-spin text-gold-500" />
            <Sparkles size={18} className="absolute -right-1 -top-1 text-ink-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-ink-900">{aiStages[stageIdx]}</p>
            <p className="mt-1 text-xs text-ink-400">Порт IAiDraftingService → GeminiAiDraftingService</p>
          </div>
          <div className="flex gap-2">
            {aiStages.map((_, i) => (
              <span key={i} className={`h-1.5 w-8 rounded-full transition ${i <= stageIdx ? 'bg-gold-500' : 'bg-ink-100'}`} />
            ))}
          </div>
        </Card>
      )}

      {step === 3 && (
        <div className="mt-6">
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2 text-emerald-600">
              <CheckCircle2 size={18} />
              <p className="text-sm font-bold">Черновик собран из {parseContent(generated).length} пунктов библиотеки</p>
            </div>
            <div className="max-h-96 space-y-4 overflow-y-auto rounded-xl border border-ink-100 bg-ink-50/50 p-5">
              {parseContent(generated).map((b, i) => (
                <div key={i}>
                  <p className="text-sm font-bold text-ink-900">{i + 1}. {b.heading}</p>
                  <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-ink-600">{b.body}</p>
                </div>
              ))}
            </div>
          </Card>
          <div className="mt-6 flex items-center justify-between">
            <Button variant="ghost" onClick={() => setStep(1)} icon={<ArrowLeft size={16} />}>Изменить вводные</Button>
            <Button onClick={createDraft} iconRight={<ArrowRight size={16} />}>Открыть в редакторе</Button>
          </div>
        </div>
      )}
    </div>
  )
}

function Steps({ step }: { step: number }) {
  return (
    <div className="flex items-center">
      {steps.map((label, i) => (
        <div key={label} className="flex flex-1 items-center last:flex-none">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${
                i < step ? 'bg-ink-900 text-white' : i === step ? 'bg-gold-500 text-ink-950' : 'bg-ink-100 text-ink-400'
              }`}
            >
              {i < step ? <Icons.Check size={14} /> : i + 1}
            </div>
            <span className={`hidden text-[11px] font-medium sm:block ${i === step ? 'text-ink-900' : 'text-ink-400'}`}>{label}</span>
          </div>
          {i < steps.length - 1 && <div className={`mx-2 h-px flex-1 ${i < step ? 'bg-ink-900' : 'bg-ink-100'}`} />}
        </div>
      ))}
    </div>
  )
}
