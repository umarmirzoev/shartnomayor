// Resolves display text for seed (demo) entities in the current UI language.
// Structural data (ids, relations, dates, statuses, field keys) stays in
// src/data/seed.ts; the actual copy shown to the user is looked up here from
// the active translation dictionary, keyed by entity id.
import type { Client, Case, Draft, DocumentVersion, LegislationAlert, AuditLogEntry, Template, ClauseBlock } from '@/lib/types'
import { seedTemplates, seedClauses } from '@/data/seed'
import type { Dict } from '@/lib/i18n'

type TplText = { title: string; category: string; description: string; fields: Record<string, { label: string; placeholder: string }> }
type ClauseText = { title: string; body: string }

export function localizedTemplates(t: Dict): Template[] {
  const dict = t.seed.templates as unknown as Record<string, TplText | undefined>
  return seedTemplates.map((tpl) => {
    const tt = dict[tpl.id]
    if (!tt) return tpl
    return {
      ...tpl,
      title: tt.title,
      category: tt.category,
      description: tt.description,
      fields: tpl.fields.map((f) => {
        const tf = tt.fields[f.key]
        return tf ? { ...f, label: tf.label, placeholder: tf.placeholder } : f
      }),
    }
  })
}

export function localizedClauses(t: Dict): ClauseBlock[] {
  const dict = t.seed.clauses as unknown as Record<string, ClauseText | undefined>
  return seedClauses.map((c) => {
    const tc = dict[c.id]
    return tc ? { ...c, title: tc.title, body: tc.body } : c
  })
}

export function localizeClientNote(client: Client, t: Dict): string | undefined {
  const dict = t.seed.clients as unknown as Record<string, { note: string } | undefined>
  const e = dict[client.id]
  if (!e) return client.note
  return e.note || undefined
}

export function localizeCaseTitle(c: Case, t: Dict): string {
  const dict = t.seed.cases as unknown as Record<string, { title: string } | undefined>
  return dict[c.id]?.title ?? c.title
}

export function localizeDraftTitle(d: Draft, t: Dict): string {
  const dict = t.seed.drafts as unknown as Record<string, { title: string } | undefined>
  return dict[d.id]?.title ?? d.title
}

export function localizeVersionNote(v: DocumentVersion, t: Dict): string {
  const dict = t.seed.versionNotes as unknown as Record<string, string | undefined>
  return dict[v.id] ?? v.note
}

export function localizeAlert(a: LegislationAlert, t: Dict): { title: string; summary: string } {
  const dict = t.seed.alerts as unknown as Record<string, { title: string; summary: string } | undefined>
  const e = dict[a.id]
  return e ?? { title: a.title, summary: a.summary }
}

export function localizeAuditEntry(e: AuditLogEntry, t: Dict): { action: string; target: string } {
  const dict = t.seed.auditSeed as unknown as Record<string, { action: string; target: string } | undefined>
  const le = dict[e.id]
  return le ?? { action: e.action, target: e.target }
}

export function localizedLawyerFirm(t: Dict): string {
  return t.seed.lawyer.firm
}

export function localizedFillClauses(templateId: string, values: Record<string, string>, t: Dict): string {
  const tpl = seedTemplates.find((tp) => tp.id === templateId)!
  const clauses = localizedClauses(t)
  return tpl.clauseIds
    .map((cid) => clauses.find((c) => c.id === cid)!)
    .map((clause) => {
      let body = clause.body
      Object.entries(values).forEach(([k, v]) => {
        body = body.replaceAll(`{{${k}}}`, v)
      })
      return `## ${clause.title}\n${body}`
    })
    .join('\n\n')
}
