// Адаптеры «реальный бэкенд → доменные типы фронтенда» (src/lib/types.ts).
// Существующие экраны кабинета написаны против типов Client/Case/Draft/... из демо-режима;
// бэкенд моделирует часть этих сущностей иначе (см. комментарии у каждой функции).
// Здесь и только здесь фиксируются расхождения моделей — компоненты об этом не знают.
import type {
  Client, Case, Draft, DocumentVersion, Template, ClauseBlock, LegislationAlert, AuditLogEntry, Lawyer,
} from '@/lib/types'
import type {
  GetClientDto, ClientDetailDto, GetCaseDto, CaseDetailDto, GetTemplateDto, ClauseBlockDetailDto,
  GetDraftDto, DraftDetailDto, GetDocumentVersionDto, DocumentVersionDetailDto,
  CaseLegislationAlertDetailDto, AuditLogEntryDetailDto, LawyerProfileDetailDto, DocumentStatus,
} from '@/lib/api'

const dateOnly = (iso: string) => (iso ? iso.slice(0, 10) : '')
const dateTime = (iso: string) => (iso ? new Date(iso).toLocaleString('ru-RU') : '')

/** Помечает версии, сгенерированные/пересобранные ИИ — DraftEditor.tsx показывает для них иконку ✨. */
export const AI_AUTHOR_MARK = 'ИИ-ассистент'

export function adaptLawyer(dto: LawyerProfileDetailDto): Lawyer {
  return {
    id: dto.id,
    fullName: dto.fullName,
    email: dto.email ?? '',
    firm: dto.lawFirmName,
    plan: dto.subscriptionTier === 'Paid' ? 'pro' : 'free',
  }
}

/**
 * Client (бэкенд) не имеет поля «статус» — только fullName/companyName/contactPhone/
 * contactEmail/notes/deletedAt. Понятия 'potential' в реальной модели нет: любой
 * неудалённый клиент показывается как 'active', удалённый (после воркфлоу полного
 * удаления) — как 'archived'. Переключатель статуса в ClientDetail.tsx в боевом режиме
 * меняет это только локально в интерфейсе (см. store.tsx) — писать в бэкенд некуда.
 */
export function adaptClient(dto: GetClientDto | ClientDetailDto): Client {
  const notes = 'notes' in dto ? dto.notes : undefined
  const deletedAt = 'deletedAt' in dto ? dto.deletedAt : undefined
  return {
    id: dto.id,
    name: dto.fullName || dto.companyName || '—',
    type: dto.companyName ? 'company' : 'individual',
    status: deletedAt ? 'archived' : 'active',
    contact: [dto.contactPhone, dto.contactEmail].filter(Boolean).join(' · '),
    note: notes || undefined,
    createdAt: dateOnly(dto.createdAt),
  }
}
export function clientToCreateDto(c: { name: string; type: 'individual' | 'company'; contact: string; note?: string }) {
  const [contactPhone, contactEmail] = c.contact.split('·').map((s) => s.trim()).filter(Boolean)
  return {
    fullName: c.type === 'individual' ? c.name : undefined,
    companyName: c.type === 'company' ? c.name : undefined,
    contactPhone: contactPhone || undefined,
    contactEmail: contactEmail || undefined,
    notes: c.note || undefined,
  }
}

/** Case (бэкенд): только Open/Closed. Демо-статус 'archived' у реального бэкенда нет. */
export function adaptCaseStatus(status: DocumentStatus | 'Open' | 'Closed'): Case['status'] {
  return status === 'Closed' ? 'closed' : 'active'
}
export function adaptCase(dto: GetCaseDto | CaseDetailDto): Case {
  return {
    id: dto.id,
    clientId: dto.clientId,
    title: dto.title,
    status: adaptCaseStatus(dto.status),
    createdAt: dateOnly(dto.createdAt),
  }
}

export function adaptTemplate(dto: GetTemplateDto, clauseIds: string[] = []): Template {
  const languageLabel: Record<string, string> = { Tj: 'Тоҷикӣ', Ru: 'Русский', Both: 'Тоҷикӣ · Русский' }
  return {
    id: dto.id,
    title: dto.name,
    // Бэкенд не хранит категорию шаблона (только у ClauseBlock есть Category) — показываем язык.
    category: languageLabel[dto.language] ?? dto.language,
    description: dto.description || '',
    // Бэкенд не хранит структурированные поля анкеты — юрист описывает сделку свободным текстом
    // (см. DraftNew.tsx: dealDescription уже собирается и отправляется как есть).
    fields: [],
    clauseIds,
  }
}

export function adaptClauseBlock(dto: ClauseBlockDetailDto, templateId: string, lang: 'ru' | 'tg' | 'en', optional: boolean): ClauseBlock {
  return {
    id: dto.id,
    templateId,
    title: dto.title,
    body: lang === 'tg' ? dto.contentTj : dto.contentRu,
    optional,
  }
}

const DRAFT_STATUS_MAP: Record<DocumentStatus, Draft['status']> = {
  Draft: 'draft',
  RevisionsRequested: 'draft',
  RequiresUpdate: 'draft',
  PendingFirmApproval: 'in_review',
  SentToClient: 'in_review',
  AwaitingSignature: 'in_review',
  AcceptedByClient: 'ready',
  Signed: 'ready',
  RejectedByClient: 'draft',
  Expired: 'draft',
  RevokedByLawyer: 'draft',
  Archived: 'archived',
  Deleted: 'archived',
}
/** Сжимает 13 состояний DocumentStatus бэкенда в 5 статусов демо-модели (см. types.ts DraftStatus). */
export function adaptDraftStatus(status: DocumentStatus): Draft['status'] {
  return DRAFT_STATUS_MAP[status] ?? 'draft'
}

export function adaptDraft(dto: GetDraftDto | DraftDetailDto, title: string): Draft {
  return {
    id: dto.id,
    caseId: dto.caseId,
    templateId: dto.templateId,
    title,
    status: adaptDraftStatus(dto.status),
    currentVersionId: dto.currentVersionId || '',
    // "responsibilityConfirmedAt" присутствует только в DraftDetailDto — в списочном GetDraftDto его нет.
    responsibilityConfirmed: 'responsibilityConfirmedAt' in dto ? !!dto.responsibilityConfirmedAt : false,
    createdAt: dateOnly(dto.createdAt),
    updatedAt: dateOnly(dto.updatedAt),
  }
}

export function adaptVersion(dto: GetDocumentVersionDto | DocumentVersionDetailDto, content: string, authorName: string): DocumentVersion {
  return {
    id: dto.id,
    draftId: dto.draftId,
    number: dto.versionNumber,
    content,
    createdAt: dateTime(dto.createdAt),
    note: dto.changeSummary || '',
    author: dto.source === 'ManualEdit' ? authorName : AI_AUTHOR_MARK,
  }
}

export function adaptAlert(dto: CaseLegislationAlertDetailDto): LegislationAlert {
  return {
    id: dto.id,
    title: dto.alert?.title || '',
    summary: dto.alert?.summary || '',
    // Бэкенд связывает уведомление с делами (Case), а не напрямую с шаблонами договоров.
    affectedTemplateIds: [],
    date: dateOnly(dto.alert?.detectedAt || ''),
    read: dto.isRead,
    severity: 'important',
  }
}

const AUDIT_ACTION_LABEL: Record<AuditLogEntryDetailDto['action'], string> = {
  Opened: 'Документ открыт',
  Modified: 'Изменение',
  Deleted: 'Удаление',
  FullyDeleted: 'Полное удаление',
  Exported: 'Экспорт документа',
  StatusChanged: 'Изменён статус',
}
export function adaptAuditEntry(dto: AuditLogEntryDetailDto, actorName: string): AuditLogEntry {
  return {
    id: dto.id,
    action: AUDIT_ACTION_LABEL[dto.action] ?? dto.action,
    target: `${dto.entityType} ${dto.entityId.slice(0, 8)}`,
    actor: dto.actorType === 'System' ? 'Система' : actorName,
    date: dateTime(dto.occurredAt),
  }
}
