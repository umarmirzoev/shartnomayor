/**
 * API-клиент ШартномаЁр — точная типизированная обёртка над реальным .NET-бэкендом
 * (Backend/WebApi, Clean Architecture, .NET 9). Формы запросов/ответов сверены построчно
 * с исходниками контроллеров и DTO (WebApi/Controllers/*.cs, Application/DTOs/*.cs).
 *
 * Режимы работы приложения:
 *   — Демо-режим (по умолчанию): VITE_API_URL не задан, все данные живут в localStorage
 *     (см. src/lib/store.tsx, src/data/seed.ts). Бэкенд не участвует.
 *   — Боевой режим: VITE_API_URL задан (например http://localhost:5292) — src/lib/store.tsx
 *     обращается к функциям этого файла вместо localStorage. UI-компоненты не знают о разнице,
 *     так как работают только через useAppData()/useAuth().
 *
 * Важные факты о реальном контракте (проверено по исходникам бэкенда):
 *   — Базовый путь: {VITE_API_URL}/api/v1/{Controller} — сегмент контроллера НЕ приводится
 *     к нижнему регистру (RouteOptions.LowercaseUrls нигде не включён), поэтому пишем его
 *     ровно как имя C#-класса: Authentication, Clients, Cases, Templates, ClauseBlocks,
 *     Documents, ArtificialIntelligence, Legislation, Audit.
 *   — JSON: ASP.NET Core default (camelCase) + JsonStringEnumConverter — значит все enum'ы,
 *     включая HttpStatusCode в конверте Response<T>.statusCode, сериализуются как строки
 *     ("OK", "BadRequest", "NotFound"…), а не числа.
 *   — Единый конверт ответа: { isSuccess, statusCode, data, message, errors }.
 *   — Списочные эндпоинты возвращают data: PagedResult<T> = { items, totalCount, pageNumber,
 *     pageSize, totalPages, hasPreviousPage, hasNextPage }.
 *   — Авторизация: JWT access-токен (живёт 15 минут) + ротируемый refresh-токен (14 дней).
 *     На 401 клиент один раз пробует /Authentication/refresh и повторяет запрос.
 *   — У бэкенда сознательно нет сид-данных (шаблоны/пункты/клиенты) — см. WebApi/Seeds/DbInitializer.cs:
 *     создаются только Identity-роли и, если включено, один bootstrap-администратор.
 *     Библиотеку шаблонов нужно наполнить через POST /Templates и POST /ClauseBlocks
 *     от имени куратора (см. scripts/seed-backend.mjs в корне репозитория).
 */

const RAW_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')
const API_BASE = RAW_BASE ? `${RAW_BASE}/api/v1` : ''
const DEBUG = import.meta.env.VITE_API_DEBUG === 'true'

const ACCESS_TOKEN_KEY = 'shartnomayor_access_token_v1'
const REFRESH_TOKEN_KEY = 'shartnomayor_refresh_token_v1'

export function isBackendConfigured(): boolean {
  return RAW_BASE.length > 0
}

export function getAuthToken(): string | null {
  try { return localStorage.getItem(ACCESS_TOKEN_KEY) } catch { return null }
}
export function getRefreshToken(): string | null {
  try { return localStorage.getItem(REFRESH_TOKEN_KEY) } catch { return null }
}
export function setAuthTokens(tokens: { accessToken: string; refreshToken: string } | null) {
  try {
    if (tokens) {
      localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken)
      localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)
    } else {
      localStorage.removeItem(ACCESS_TOKEN_KEY)
      localStorage.removeItem(REFRESH_TOKEN_KEY)
    }
  } catch { /* ignore */ }
}
/** Сохранён для обратной совместимости старого места использования; используйте setAuthTokens. */
export const setAuthToken = (token: string | null) => setAuthTokens(token ? { accessToken: token, refreshToken: getRefreshToken() ?? '' } : null)

export class ApiError extends Error {
  status: number
  errors: string[]
  constructor(message: string, status: number, errors: string[] = []) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

// ---------------------------------------------------------------------------
// Конверт ответа бэкенда — Application/Common/Models/Response.cs и PagedResult.cs
// ---------------------------------------------------------------------------
interface RawResponse<T> {
  isSuccess: boolean
  statusCode: string
  data: T | null
  message: string
  errors: string[]
}
export interface PagedResult<T> {
  items: T[]
  totalCount: number
  pageNumber: number
  pageSize: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  /** Плоский объект query-параметров — принимает любые *FilterParam из api.ts как есть. */
  query?: object
  signal?: AbortSignal
  timeoutMs?: number
  /** Пропустить авто-обновление токена (используется самим refresh-запросом, чтобы избежать рекурсии). */
  skipAuthRetry?: boolean
}

function buildUrl(path: string, query?: RequestOptions['query']): string {
  const url = new URL(API_BASE + path, API_BASE ? undefined : window.location.origin)
  if (query) {
    Object.entries(query as Record<string, unknown>).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v))
    })
  }
  return API_BASE ? url.toString() : url.pathname + url.search
}

let refreshInFlight: Promise<boolean> | null = null

async function tryRefreshToken(): Promise<boolean> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return false
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      try {
        const res = await request<AuthenticationTokensDto>('/Authentication/refresh', {
          method: 'POST',
          body: { refreshToken },
          skipAuthRetry: true,
        })
        setAuthTokens({ accessToken: res.accessToken, refreshToken: res.refreshToken })
        return true
      } catch {
        setAuthTokens(null)
        return false
      } finally {
        refreshInFlight = null
      }
    })()
  }
  return refreshInFlight
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!isBackendConfigured()) {
    throw new ApiError(
      'Бэкенд не подключён (VITE_API_URL не задан) — приложение работает в демо-режиме на localStorage.',
      0
    )
  }

  const { method = 'GET', body, query, signal, timeoutMs = 20000, skipAuthRetry = false } = options
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  const combinedSignal = signal ?? controller.signal

  const token = getAuthToken()
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  const url = buildUrl(path, query)
  if (DEBUG) console.debug(`[api] ${method} ${url}`, body ?? '')

  let res: Response
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: combinedSignal,
    })
  } catch (err) {
    clearTimeout(timeout)
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError('Превышено время ожидания ответа сервера.', 0)
    }
    throw new ApiError(err instanceof Error ? err.message : 'Сетевая ошибка', 0)
  }
  clearTimeout(timeout)

  // 401 на защищённом эндпоинте: один раз пробуем ротацию refresh-токена и повторяем запрос.
  if (res.status === 401 && !skipAuthRetry && token) {
    const refreshed = await tryRefreshToken()
    if (refreshed) return request<T>(path, { ...options, skipAuthRetry: true })
  }

  if (res.status === 204) return undefined as T

  const isJson = res.headers.get('content-type')?.includes('application/json')
  const payload = isJson ? await res.json().catch(() => null) : null

  if (!isJson) {
    if (!res.ok) throw new ApiError(`Ошибка запроса (${res.status})`, res.status)
    // Бинарный ответ (например экспорт документа) — вызывающий код сам решает, что делать.
    return res as unknown as T
  }

  const envelope = payload as RawResponse<T> | null
  if (!envelope || !res.ok || !envelope.isSuccess) {
    const message = envelope?.errors?.[0] || envelope?.message || `Ошибка запроса (${res.status})`
    throw new ApiError(message, res.status, envelope?.errors ?? [])
  }

  return envelope.data as T
}

// ---------------------------------------------------------------------------
// DTO — сверено с Application/DTOs/*.cs и WebApi/Contracts/ApiRequests.cs
// ---------------------------------------------------------------------------

export interface AuthenticationTokensDto {
  accessToken: string
  refreshToken: string
  accessTokenExpiresAt: string
}
export interface CreateLawyerProfileDto {
  email: string
  password: string
  phoneNumber?: string
  fullName: string
  lawFirmName?: string
}
export interface LawyerProfileDetailDto {
  id: string
  fullName: string
  email?: string
  phoneNumber?: string
  lawFirmName?: string
  subscriptionTier: 'Free' | 'Paid'
  isActive: boolean
  createdAt: string
}

export interface GetClientDto {
  id: string
  fullName?: string
  companyName?: string
  contactPhone?: string
  contactEmail?: string
  createdAt: string
}
export interface ClientDetailDto extends GetClientDto {
  notes?: string
  deletedAt?: string
}
export interface CreateClientDto {
  fullName?: string
  companyName?: string
  contactPhone?: string
  contactEmail?: string
  notes?: string
}
export type UpdateClientDto = CreateClientDto

export type CaseStatus = 'Open' | 'Closed'
export interface GetCaseDto {
  id: string
  clientId: string
  title: string
  status: CaseStatus
  createdAt: string
  closedAt?: string
}
export interface CaseDetailDto extends GetCaseDto {
  description?: string
  documentCount: number
}
export interface CreateCaseDto { clientId: string; title: string; description?: string }
export interface UpdateCaseDto { title: string; description?: string }

export type TemplateLanguage = 'Tj' | 'Ru' | 'Both'
export interface GetTemplateDto {
  id: string
  name: string
  description?: string
  language: TemplateLanguage
}
export interface TemplateDetailDto extends GetTemplateDto {
  isActive: boolean
  requiresNotary: boolean
  maintainedByRef?: string
  createdAt: string
  updatedAt: string
}
export interface CreateTemplateDto { name: string; description?: string; language: TemplateLanguage; maintainedByRef?: string }
export type UpdateTemplateDto = CreateTemplateDto

export interface ClauseBlockDetailDto {
  id: string
  title: string
  contentTj: string
  contentRu: string
  category: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}
export interface CreateClauseBlockDto { title: string; contentTj: string; contentRu: string; category: string }
export type UpdateClauseBlockDto = CreateClauseBlockDto

export interface ClauseBlockDetailWithLinkDto {
  id: string
  templateId: string
  clauseBlockId: string
  isDefault: boolean
  order: number
}
export interface CreateTemplateClauseBlockDto { templateId: string; clauseBlockId: string; isDefault: boolean; order: number }

export type DocumentStatus =
  | 'Draft' | 'PendingFirmApproval' | 'SentToClient' | 'RevisionsRequested' | 'AcceptedByClient'
  | 'AwaitingSignature' | 'Signed' | 'RejectedByClient' | 'Expired' | 'RevokedByLawyer'
  | 'RequiresUpdate' | 'Archived' | 'Deleted'
export type DocumentVersionSource = 'AiGenerated' | 'AiRegenerated' | 'ManualEdit'

export interface GetDraftDto {
  id: string
  caseId: string
  templateId: string
  templateName?: string
  status: DocumentStatus
  currentVersionId?: string
  createdAt: string
  updatedAt: string
}
export interface GetDocumentVersionDto {
  id: string
  draftId: string
  versionNumber: number
  changeSummary?: string
  source: DocumentVersionSource
  createdByLawyerId: string
  createdAt: string
}
export interface DraftDetailDto {
  id: string
  caseId: string
  templateId: string
  status: DocumentStatus
  currentVersionId?: string
  responsibilityConfirmedAt?: string
  dueRespondByDate?: string
  archivedAt?: string
  createdAt: string
  updatedAt: string
  currentVersion?: GetDocumentVersionDto
  currentContent?: string
}
export interface CreateDraftDto { caseId: string; templateId: string; dealDescription: string }
export interface UpdateDraftDto { content: string; changeSummary?: string }
export interface DraftOperationDto { draftId: string; versionId: string; versionNumber: number; content: string }
export interface DocumentVersionDetailDto {
  id: string
  draftId: string
  versionNumber: number
  content?: string
  changeSummary?: string
  source: DocumentVersionSource
  createdByLawyerId: string
  createdAt: string
}
export type DocumentExportFormat = 'Docx' | 'Pdf'
export interface ExportedDocumentDto {
  fileName: string
  contentType: string
  /** Байты файла в base64 (стандартная сериализация byte[] в ASP.NET Core JSON). */
  content: string
}

export interface GetLegislationAlertDto {
  id: string
  title: string
  summary: string
  lawChangedAt?: string
  detectedAt: string
}
export interface CaseLegislationAlertDetailDto {
  id: string
  caseId: string
  legislationAlertId: string
  isRead: boolean
  readAt?: string
  case?: GetCaseDto
  alert?: GetLegislationAlertDto
}
export interface CreateLegislationAlertDto { title: string; summary: string; sourceUrl?: string; lawChangedAt?: string }

export interface GetAiUsageQuotaDto {
  id: string
  requestsUsed: number
  requestsLimit?: number
  remainingRequests?: number
  periodEnd: string
}

export interface AuditLogEntryDetailDto {
  id: string
  actorType: 'Lawyer' | 'Client' | 'System'
  actorId?: string
  action: 'Opened' | 'Modified' | 'Deleted' | 'FullyDeleted' | 'Exported' | 'StatusChanged'
  entityType: string
  entityId: string
  metadata?: string
  occurredAt: string
}

interface FilterParam {
  pageNumber?: number
  pageSize?: number
  sortBy?: string
  sortDescending?: boolean
}

// ---------------------------------------------------------------------------
// Ресурсные клиенты — по одному на контроллер, маршруты сверены построчно.
// ---------------------------------------------------------------------------

export const authApi = {
  register: (data: CreateLawyerProfileDto) =>
    request<string>('/Authentication/register', { method: 'POST', body: data }),
  login: (email: string, password: string) =>
    request<AuthenticationTokensDto>('/Authentication/login', { method: 'POST', body: { email, password } }),
  refresh: (refreshToken: string) =>
    request<AuthenticationTokensDto>('/Authentication/refresh', { method: 'POST', body: { refreshToken } }),
  me: () => request<LawyerProfileDetailDto>('/Authentication/me'),
}

export const clientsApi = {
  list: (filter: FilterParam & { searchTerm?: string } = {}) =>
    request<PagedResult<GetClientDto>>('/Clients', { query: filter }),
  get: (id: string) => request<ClientDetailDto>(`/Clients/${id}`),
  create: (data: CreateClientDto) => request<string>('/Clients', { method: 'POST', body: data }),
  update: (id: string, data: UpdateClientDto) =>
    request<ClientDetailDto>(`/Clients/${id}`, { method: 'PUT', body: data }),
  cases: (clientId: string, filter: FilterParam & { status?: CaseStatus } = {}) =>
    request<PagedResult<GetCaseDto>>(`/Clients/${clientId}/cases`, { query: filter }),
  requestFullDeletion: (clientId: string) =>
    request<string>(`/Clients/${clientId}/deletion-requests`, { method: 'POST' }),
}

export const casesApi = {
  create: (data: CreateCaseDto) => request<string>('/Cases', { method: 'POST', body: data }),
  update: (id: string, data: UpdateCaseDto) =>
    request<CaseDetailDto>(`/Cases/${id}`, { method: 'PUT', body: data }),
  close: (id: string) => request<void>(`/Cases/${id}/close`, { method: 'POST' }),
  get: (id: string) => request<CaseDetailDto>(`/Cases/${id}`),
  documents: (caseId: string, filter: FilterParam & { status?: DocumentStatus } = {}) =>
    request<PagedResult<GetDraftDto>>(`/Cases/${caseId}/documents`, { query: filter }),
}

export const templatesApi = {
  list: (filter: FilterParam & { language?: TemplateLanguage } = {}) =>
    request<PagedResult<GetTemplateDto>>('/Templates', { query: filter }),
  clauseBlocks: (templateId: string, defaultOnly = false) =>
    request<ClauseBlockDetailDto[]>(`/Templates/${templateId}/clause-blocks`, { query: { defaultOnly } }),
  create: (data: CreateTemplateDto) => request<string>('/Templates', { method: 'POST', body: data }),
  attachClauseBlock: (templateId: string, data: Omit<CreateTemplateClauseBlockDto, 'templateId'>) =>
    request<string>(`/Templates/${templateId}/clause-blocks`, { method: 'POST', body: data }),
}

export const clauseBlocksApi = {
  list: (filter: FilterParam & { searchTerm?: string; category?: string } = {}) =>
    request<PagedResult<ClauseBlockDetailDto>>('/ClauseBlocks', { query: filter }),
  create: (data: CreateClauseBlockDto) => request<string>('/ClauseBlocks', { method: 'POST', body: data }),
}

// Создание, обновление и regenerate черновика синхронно ждут ответа Gemini и запись в S3-хранилище —
// на бесплатном тарифе Render это может занимать больше минуты, поэтому им нужен отдельный
// увеличенный таймаут вместо общего 20-секундного значения по умолчанию.
const AI_GENERATION_TIMEOUT_MS = 90000

export const draftsApi = {
  create: (data: CreateDraftDto) =>
    request<DraftOperationDto>('/Documents', { method: 'POST', body: data, timeoutMs: AI_GENERATION_TIMEOUT_MS }),
  update: (draftId: string, data: UpdateDraftDto) =>
    request<DraftOperationDto>(`/Documents/${draftId}`, { method: 'PUT', body: data, timeoutMs: AI_GENERATION_TIMEOUT_MS }),
  regenerate: (draftId: string, instructions: string, changeSummary: string) =>
    request<DraftOperationDto>(`/Documents/${draftId}/regenerate`, {
      method: 'POST',
      body: { instructions, changeSummary },
      timeoutMs: AI_GENERATION_TIMEOUT_MS,
    }),
  confirmResponsibility: (draftId: string) =>
    request<void>(`/Documents/${draftId}/responsibility-confirmation`, { method: 'POST' }),
  get: (draftId: string) => request<DraftDetailDto>(`/Documents/${draftId}`),
  versions: (draftId: string, filter: FilterParam = {}) =>
    request<PagedResult<GetDocumentVersionDto>>(`/Documents/${draftId}/versions`, { query: filter }),
  versionById: (versionId: string) => request<DocumentVersionDetailDto>(`/Documents/versions/${versionId}`),
  /**
   * Экспортирует документ. Бэкенд отдаёт обычный JSON-конверт Response<ExportedDocumentDto>
   * (НЕ сырые байты файла — Content-Type ответа остаётся application/json), где
   * data.content — это байты файла, закодированные в base64 (сериализация byte[] в ASP.NET Core).
   * Декодируем base64 в Blob сами и возвращаем вместе с именем файла и MIME-типом от бэкенда.
   */
  export: async (
    draftId: string,
    format: DocumentExportFormat
  ): Promise<{ blob: Blob; fileName: string }> => {
    const data = await request<ExportedDocumentDto>(`/Documents/${draftId}/exports`, {
      method: 'POST',
      body: { format },
    })
    const binary = atob(data.content)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
    return { blob: new Blob([bytes], { type: data.contentType }), fileName: data.fileName }
  },
}

export const legislationApi = {
  alerts: (filter: FilterParam & { unreadOnly?: boolean } = {}) =>
    request<PagedResult<CaseLegislationAlertDetailDto>>('/Legislation/alerts', { query: filter }),
  markRead: (linkId: string) => request<void>(`/Legislation/alerts/${linkId}/read`, { method: 'POST' }),
}

export const auditApi = {
  /** entityType — точное имя из белого списка Application-слоя: "Case" | "Draft" | "DocumentVersion". */
  list: (entityType: 'Case' | 'Draft' | 'DocumentVersion', entityId: string, filter: FilterParam = {}) =>
    request<PagedResult<AuditLogEntryDetailDto>>(`/Audit/${entityType}/${entityId}`, { query: filter }),
}

export const aiUsageApi = {
  get: () => request<GetAiUsageQuotaDto>('/ArtificialIntelligence/usage'),
}

export const api = {
  auth: authApi,
  clients: clientsApi,
  cases: casesApi,
  templates: templatesApi,
  clauseBlocks: clauseBlocksApi,
  drafts: draftsApi,
  legislation: legislationApi,
  audit: auditApi,
  aiUsage: aiUsageApi,
  isConfigured: isBackendConfigured,
}

export default api
