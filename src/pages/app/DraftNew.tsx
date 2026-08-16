import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, Loader2, FileStack, Search } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Field, Input, Select, Textarea } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { useAppData } from '@/lib/store'
import { simulateAiGeneration } from '@/lib/ai'
import { parseContent } from '@/lib/format'
import { useT } from '@/lib/i18n/context'
import { localizeCaseTitle } from '@/lib/seedText'
import * as Icons from 'lucide-react'

export default function DraftNew() {
  const t = useT()
  const { cases, clients, templates, addDraft, addVersion, incAiUsage, aiUsed, aiLimit, isRealBackend } = useAppData()
  const navigate = useNavigate()
  const steps = t.app.draftNew.steps
  const aiStages = t.app.draftNew.stages

  const [step, setStep] = useState(0)
  const [caseId, setCaseId] = useState(cases[0]?.id || '')
  const [templateId, setTemplateId] = useState(templates[0]?.id || '')
  const [templateQuery, setTemplateQuery] = useState('')
  const [dealDescription, setDealDescription] = useState('')
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({})
  const [generating, setGenerating] = useState(false)
  const [stageIdx, setStageIdx] = useState(0)
  const [generated, setGenerated] = useState('')
  const [realDraftId, setRealDraftId] = useState<string | null>(null)

  // Список шаблонов приходит асинхронно из useAppData() в боевом режиме — как только он
  // загрузится, подставляем первый шаблон по умолчанию, если ничего ещё не выбрано.
  useEffect(() => {
    if (!templateId && templates[0]) setTemplateId(templates[0].id)
  }, [templateId, templates])

  const filteredTemplates = useMemo(() => {
    const q = templateQuery.trim().toLowerCase()
    if (!q) return templates
    return templates.filter((tp) => tp.title.toLowerCase().includes(q) || tp.category.toLowerCase().includes(q))
  }, [templates, templateQuery])

  const template = templates.find((tp) => tp.id === templateId)
  const activeCase = cases.find((c) => c.id === caseId)
  const client = clients.find((c) => c.id === activeCase?.clientId)
  const limitReached = aiUsed >= aiLimit

  const canStep0 = !!caseId && !!templateId
  const canStep1 = dealDescription.trim().length > 8

  const draftTitle = `${template?.title || ''} — ${client?.name || t.app.draftNew.newDraftFallback}`

  const runGeneration = async () => {
    setStep(2)
    setGenerating(true)
    setStageIdx(0)
    const interval = setInterval(() => setStageIdx((i) => Math.min(i + 1, aiStages.length - 1)), 700)
    try {
      if (isRealBackend) {
        // Боевой режим: POST /Documents сразу создаёт черновик и первую ИИ-версию —
        // текст реально генерирует Gemini на бэкенде (см. src/lib/store.tsx addDraft).
        const draft = await addDraft({
          caseId,
          templateId,
          title: draftTitle,
          status: 'draft',
          currentVersionId: '',
          responsibilityConfirmed: false,
          dealDescription,
        })
        setRealDraftId(draft.id)
        setGenerated(draft.generatedContent || '')
      } else {
        const content = await simulateAiGeneration(templateId, fieldValues, t)
        setGenerated(content)
      }
    } finally {
      clearInterval(interval)
      incAiUsage()
      setGenerating(false)
      setStep(3)
    }
  }

  const createDraft = async () => {
    if (isRealBackend && realDraftId) {
      // Черновик и версия уже созданы на сервере во время генерации — просто открываем редактор.
      navigate(`/app/drafts/${realDraftId}`)
      return
    }
    const draft = await addDraft({
      caseId,
      templateId,
      title: draftTitle,
      status: 'draft',
      currentVersionId: '',
      responsibilityConfirmed: false,
    })
    await addVersion({ draftId: draft.id, content: generated, note: t.audit.addDraftAi, author: 'ИИ-ассистент' })
    navigate(`/app/drafts/${draft.id}`)
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink-950">{t.app.draftNew.title}</h1>
        <p className="mt-1 text-sm text-ink-500">{t.app.draftNew.subtitle}</p>
      </div>

      <Steps step={step} steps={steps} />

      {step === 0 && (
        <Card className="mt-6 p-6">
          <div className="space-y-5">
            {cases.length === 0 ? (
              <div className="rounded-xl border border-dashed border-ink-200 bg-ink-50/60 p-5 text-center">
                <p className="text-sm font-semibold text-ink-800">{t.app.draftNew.caseHint}</p>
                <Button className="mt-4" onClick={() => navigate('/app/clients')}>{t.app.draftNew.goToClients}</Button>
              </div>
            ) : (
              <Field label={t.app.draftNew.caseLabel} required>
                <Select value={caseId} onChange={(e) => setCaseId(e.target.value)}>
                  {cases.map((c) => {
                    const cl = clients.find((x) => x.id === c.clientId)
                    return <option key={c.id} value={c.id}>{localizeCaseTitle(c, t)} — {cl?.name}</option>
                  })}
                </Select>
              </Field>
            )}

            <div>
              <span className="mb-2 block text-sm font-semibold text-ink-800">{t.app.draftNew.contractType}</span>
              {templates.length > 8 && (
                <div className="relative mb-3">
                  <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
                  <input
                    value={templateQuery}
                    onChange={(e) => setTemplateQuery(e.target.value)}
                    placeholder={t.common.search}
                    className="w-full rounded-lg border border-ink-200 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-ink-400"
                  />
                </div>
              )}
              <div className="grid max-h-80 grid-cols-2 gap-3 overflow-y-auto pr-1">
                {filteredTemplates.length === 0 && (
                  <p className="col-span-2 text-sm text-ink-400">{t.common.notFoundShort}</p>
                )}
                {filteredTemplates.map((tpl) => {
                  const active = tpl.id === templateId
                  return (
                    <button
                      key={tpl.id}
                      onClick={() => setTemplateId(tpl.id)}
                      className={`rounded-xl border p-4 text-left transition ${active ? 'border-ink-900 bg-ink-50 ring-1 ring-ink-900' : 'border-ink-200 hover:border-ink-400'}`}
                    >
                      <FileStack size={16} className={active ? 'text-gold-600' : 'text-ink-400'} />
                      <p className="mt-2 text-sm font-bold text-ink-900">{tpl.title}</p>
                      <p className="mt-0.5 text-xs text-ink-400">{tpl.category}</p>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button disabled={!canStep0} onClick={() => setStep(1)} iconRight={<ArrowRight size={16} />}>{t.app.draftNew.next}</Button>
          </div>
        </Card>
      )}

      {step === 1 && (
        <Card className="mt-6 p-6">
          <div className="space-y-5">
            <Field label={t.app.draftNew.dealLabel} required hint={t.app.draftNew.dealHint}>
              <Textarea
                rows={4}
                value={dealDescription}
                onChange={(e) => setDealDescription(e.target.value)}
                placeholder={`${t.app.draftNew.dealPlaceholder}: ${client?.name || t.app.draftNew.client} ${(template?.title || '').toLowerCase()}...`}
              />
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {(template?.fields || []).map((f) => (
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
            <Button variant="ghost" onClick={() => setStep(0)} icon={<ArrowLeft size={16} />}>{t.app.draftNew.back}</Button>
            {limitReached ? (
              <Badge tone="red">{t.app.draftNew.limitReached}</Badge>
            ) : (
              <Button disabled={!canStep1} onClick={runGeneration} icon={<Sparkles size={16} />}>{t.app.draftNew.buildDraft}</Button>
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
            <p className="mt-1 text-xs text-ink-400">{t.app.draftNew.aiPort}</p>
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
              <p className="text-sm font-bold">{t.app.draftNew.assembledFrom} {parseContent(generated).length} {t.app.draftNew.libraryClauses}</p>
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
            <Button variant="ghost" onClick={() => setStep(1)} icon={<ArrowLeft size={16} />}>{t.app.draftNew.editInputs}</Button>
            <Button onClick={createDraft} iconRight={<ArrowRight size={16} />}>{t.app.draftNew.openEditor}</Button>
          </div>
        </div>
      )}
    </div>
  )
}

function Steps({ step, steps }: { step: number; steps: readonly string[] }) {
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
