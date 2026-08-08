import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft, Save, RefreshCcw, FileDown, Printer, History, ShieldAlert, CheckSquare, Square, Sparkles,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Input'
import { useAppData } from '@/lib/store'
import { statusBadge, statusLabel } from '@/lib/labels'
import { exportDraftToDocx } from '@/lib/exportDocx'
import { useT, useLanguage } from '@/lib/i18n/context'
import { cityLine } from '@/lib/i18n'
import { localizedTemplates, localizeDraftTitle, localizeCaseTitle, localizeVersionNote } from '@/lib/seedText'

export default function DraftEditor() {
  const t = useT()
  const { lang } = useLanguage()
  const { id } = useParams()
  const { drafts, versions, cases, clients, addVersion, updateDraft, logAudit } = useAppData()
  const templates = useMemo(() => localizedTemplates(t), [t])
  const draft = drafts.find((d) => d.id === id)

  const draftVersions = useMemo(
    () => versions.filter((v) => v.draftId === id).sort((a, b) => a.number - b.number),
    [versions, id]
  )
  const currentVersion = draftVersions.find((v) => v.id === draft?.currentVersionId) || draftVersions[draftVersions.length - 1]

  const [editing, setEditing] = useState(false)
  const [draftText, setDraftText] = useState(currentVersion?.content || '')
  const [viewingVersionId, setViewingVersionId] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)

  if (!draft) return <p className="text-sm text-ink-500">{t.app.draftEditor.notFound} <Link to="/app/cases" className="underline">{t.app.draftEditor.back}</Link></p>

  const relatedCase = cases.find((c) => c.id === draft.caseId)
  const client = clients.find((c) => c.id === relatedCase?.clientId)
  const template = templates.find((tp) => tp.id === draft.templateId)
  const displayedVersion = viewingVersionId ? draftVersions.find((v) => v.id === viewingVersionId)! : currentVersion
  const isLatest = !viewingVersionId || viewingVersionId === currentVersion?.id
  const draftTitle = localizeDraftTitle(draft, t)
  const caseTitle = relatedCase ? localizeCaseTitle(relatedCase, t) : ''

  const saveEdit = () => {
    addVersion({ draftId: draft.id, content: draftText, note: t.app.draftEditor.manualEditNote, author: 'Фарход Расулов' })
    setEditing(false)
    updateDraft(draft.id, { status: draft.status === 'draft' ? 'in_review' : draft.status })
  }

  const doExportDocx = async () => {
    setExporting(true)
    await exportDraftToDocx(draftTitle, displayedVersion.content, {
      caseTitle,
      clientName: client?.name || '',
      date: new Date().toLocaleDateString('ru-RU'),
      cityLine: cityLine[lang],
      signature1: t.app.draftEditor.signature1,
      signature2: t.app.draftEditor.signature2,
    })
    logAudit(t.audit.exportDocx, draftTitle)
    updateDraft(draft.id, { status: 'exported' })
    setExporting(false)
  }

  const doPrint = () => {
    logAudit(t.audit.exportPdf, draftTitle)
    updateDraft(draft.id, { status: 'exported' })
    window.print()
  }

  return (
    <div className="mx-auto max-w-6xl">
      <Link to={`/app/cases/${draft.caseId}`} className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-900 no-print">
        <ArrowLeft size={15} /> {caseTitle}
      </Link>

      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-start no-print">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold text-ink-950">{draftTitle}</h1>
            <Badge tone={statusBadge(draft.status)}>{statusLabel(draft.status, t)}</Badge>
          </div>
          <p className="mt-1 text-sm text-ink-500">{template?.title} · {client?.name} · {t.app.draftEditor.version} {displayedVersion?.number}{!isLatest && ` ${t.app.draftEditor.historyView}`}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/app/drafts/new">
            <Button variant="outline" size="sm" icon={<RefreshCcw size={14} />}>{t.app.draftEditor.regenerate}</Button>
          </Link>
          {editing ? (
            <Button size="sm" icon={<Save size={14} />} onClick={saveEdit}>{t.app.draftEditor.saveVersion}</Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => { setDraftText(currentVersion.content); setEditing(true); setViewingVersionId(null) }}>{t.app.draftEditor.edit}</Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          {editing ? (
            <Card className="p-6 no-print">
              <Textarea
                rows={22}
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                className="font-mono text-[13px] leading-relaxed"
              />
              <p className="mt-2 text-xs text-ink-400">{t.app.draftEditor.editHint}</p>
            </Card>
          ) : (
            <Card className="p-8 sm:p-10" id="print-area">
              <div className="hidden print:block mb-8 text-center">
                <p className="text-lg font-bold uppercase">{draftTitle}</p>
                <p className="text-sm text-ink-500">{cityLine[lang]}, {new Date().toLocaleDateString('ru-RU')}</p>
              </div>
              <DocumentView content={displayedVersion?.content || ''} />
              <div className="mt-14 grid grid-cols-2 gap-8 text-sm text-ink-500">
                <div>
                  <div className="mb-2 h-px w-40 bg-ink-300" />
                  {t.app.draftEditor.signature1}
                </div>
                <div>
                  <div className="mb-2 h-px w-40 bg-ink-300" />
                  {t.app.draftEditor.signature2}
                </div>
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-5 no-print">
          <Card className="p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-ink-900"><ShieldAlert size={16} className="text-gold-600" /> {t.app.draftEditor.beforeExport}</h3>
            <button
              onClick={() => updateDraft(draft.id, { responsibilityConfirmed: !draft.responsibilityConfirmed })}
              className="flex items-start gap-2.5 rounded-xl border border-ink-100 bg-ink-50/60 p-3.5 text-left text-xs leading-relaxed text-ink-600 transition hover:border-ink-300"
            >
              {draft.responsibilityConfirmed ? <CheckSquare size={17} className="mt-0.5 shrink-0 text-emerald-600" /> : <Square size={17} className="mt-0.5 shrink-0 text-ink-300" />}
              {t.app.draftEditor.confirmText}
            </button>
            <div className="mt-4 space-y-2">
              <Button
                className="w-full"
                size="sm"
                disabled={!draft.responsibilityConfirmed || exporting}
                onClick={doExportDocx}
                icon={<FileDown size={15} />}
              >
                {exporting ? t.app.draftEditor.exportingDocx : t.app.draftEditor.exportDocx}
              </Button>
              <Button
                className="w-full"
                size="sm"
                variant="outline"
                disabled={!draft.responsibilityConfirmed}
                onClick={doPrint}
                icon={<Printer size={15} />}
              >
                {t.app.draftEditor.exportPdf}
              </Button>
            </div>
            {!draft.responsibilityConfirmed && <p className="mt-2 text-[11px] text-ink-400">{t.app.draftEditor.confirmHint}</p>}
          </Card>

          <Card className="p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-ink-900"><History size={16} /> {t.app.draftEditor.versionHistory}</h3>
            <div className="space-y-2">
              {[...draftVersions].reverse().map((v) => (
                <button
                  key={v.id}
                  onClick={() => setViewingVersionId(v.id === currentVersion?.id ? null : v.id)}
                  className={`w-full rounded-xl border p-3 text-left text-xs transition ${
                    displayedVersion?.id === v.id ? 'border-ink-900 bg-ink-50' : 'border-ink-100 hover:border-ink-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-ink-900">{t.app.draftEditor.versionLabel} {v.number}</span>
                    {v.author === 'ИИ-ассистент' ? <Sparkles size={12} className="text-gold-500" /> : null}
                  </div>
                  <p className="mt-1 text-ink-500">{localizeVersionNote(v, t)}</p>
                  <p className="mt-1 text-[10px] text-ink-400">{v.author === 'ИИ-ассистент' ? t.audit.aiAssistant : v.author} · {v.createdAt}</p>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function DocumentView({ content }: { content: string }) {
  const blocks = content.split(/\n\n+/).map((c) => c.trim()).filter(Boolean)
  return (
    <div className="space-y-5">
      {blocks.map((chunk, i) => {
        const lines = chunk.split('\n')
        const isHeading = lines[0].startsWith('## ')
        const heading = isHeading ? lines[0].replace('## ', '') : null
        const body = isHeading ? lines.slice(1).join('\n') : chunk
        return (
          <div key={i}>
            {heading && <p className="mb-1.5 text-[15px] font-bold text-ink-900">{i + 1}. {heading}</p>}
            <p className="whitespace-pre-line text-[14px] leading-[1.75] text-ink-700 text-justify">{body}</p>
          </div>
        )
      })}
    </div>
  )
}
