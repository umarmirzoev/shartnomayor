export interface Lawyer {
  id: string
  fullName: string
  email: string
  firm?: string
  plan: 'free' | 'pro'
}

export interface Client {
  id: string
  name: string
  type: 'individual' | 'company'
  contact: string
  note?: string
  createdAt: string
}

export interface Case {
  id: string
  clientId: string
  title: string
  status: 'active' | 'closed' | 'archived'
  createdAt: string
}

export type DraftStatus = 'draft' | 'in_review' | 'ready' | 'exported' | 'archived'

export interface ClauseBlock {
  id: string
  templateId: string
  title: string
  body: string
  optional: boolean
}

export interface Template {
  id: string
  title: string
  category: string
  description: string
  fields: { key: string; label: string; placeholder: string }[]
  clauseIds: string[]
}

export interface DocumentVersion {
  id: string
  draftId: string
  number: number
  content: string
  createdAt: string
  note: string
  author: string
}

export interface Draft {
  id: string
  caseId: string
  templateId: string
  title: string
  status: DraftStatus
  currentVersionId: string
  responsibilityConfirmed: boolean
  createdAt: string
  updatedAt: string
}

export interface LegislationAlert {
  id: string
  title: string
  summary: string
  affectedTemplateIds: string[]
  date: string
  read: boolean
  severity: 'info' | 'important' | 'critical'
}

export interface AuditLogEntry {
  id: string
  action: string
  target: string
  actor: string
  date: string
}

export interface AiUsage {
  used: number
  limit: number
  periodLabel: string
}
