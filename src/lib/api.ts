/**
 * API-клиent ШартномаЁр — единая точка подключения фронтенда к реальному бэкенду.
 *
 * Сейчас приложение работает в демо-режиме: все данные живут в localStorage
 * (см. src/lib/store.tsx) и в src/data/seed.ts. Когда бэкенд будет готов —
 * достаточно:
 *   1. Задать VITE_API_URL в .env (см. .env.example).
 *   2. В src/lib/store.tsx заменить чтение/запись localStorage на вызовы
 *      соответствующих методов из этого файла (api.clients.list(), api.drafts.create() и т.д.)
 *      Формы запросов/ответов уже описаны типами в src/lib/types.ts.
 *   3. Ничего в UI-компонентах менять не придётся — они работают через
 *      хук useAppData() и не знают, откуда приходят данные.
 *
 * isBackendConfigured() позволяет включать реальные запросы только когда
 * VITE_API_URL задан, и мягко откатываться в демо-режим в остальных случаях.
 */

import type {
  Client, Case, Draft, DocumentVersion, LegislationAlert, AuditLogEntry,
  Template, ClauseBlock, Lawyer, AiUsage,
} from '@/lib/types'

const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')
const DEBUG = import.meta.env.VITE_API_DEBUG === 'true'

const TOKEN_KEY = 'shartnomayor_token_v1'

export function isBackendConfigured(): boolean {
  return API_BASE.length > 0
}

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setAuthToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* ignore */
  }
}

export class ApiError extends Error {
  status: number
  body: unknown

  constructor(message: string, status: number, body?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  query?: Record<string, string | number | boolean | undefined>
  signal?: AbortSignal
  timeoutMs?: number
}

function buildUrl(path: string, query?: RequestOptions['query']): string {
  const url = new URL(API_BASE + path, API_BASE ? undefined : window.location.origin)
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined) url.searchParams.set(k, String(v))
    })
  }
  return API_BASE ? url.toString() : url.pathname + url.search
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!isBackendConfigured()) {
    throw new ApiError(
      'Бэкенд не подключён (VITE_API_URL не задан) — приложение работает в демо-режиме на localStorage.',
      0
    )
  }

  const { method = 'GET', body, query, signal, timeoutMs = 15000 } = options
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  const combinedSignal = signal ?? controller.signal

  const token = getAuthToken()
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  const url = buildUrl(path, query)
  if (DEBUG) console.debug(`[api] ${method} ${url}`, body ?? '')

  try {
    const res = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: combinedSignal,
      credentials: 'include',
    })

    const isJson = res.headers.get('content-type')?.includes('application/json')
    const payload = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null)

    if (!res.ok) {
      const message = (isJson && payload && typeof payload === 'object' && 'message' in payload)
        ? String((payload as Record<string, unknown>).message)
        : `Ошибка запроса (${res.status})`
      throw new ApiError(message, res.status, payload)
    }

    return payload as T
  } catch (err) {
    if (err instanceof ApiError) throw err
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError('Превышено время ожидания ответа сервера.', 0)
    }
    throw new ApiError(err instanceof Error ? err.message : 'Сетевая ошибка', 0)
  } finally {
    clearTimeout(timeout)
  }
}

// ---------------------------------------------------------------------------
// Resource namespaces — mirror src/lib/types.ts and src/lib/store.tsx 1:1 so
// swapping the store's implementation later is a mechanical change.
// ---------------------------------------------------------------------------

export const authApi = {
  login: (email: string, password: string) =>
    request<{ token: string; lawyer: Lawyer }>('/auth/login', { method: 'POST', body: { email, password } }),
  register: (data: { email: string; password: string; fullName: string; firm?: string }) =>
    request<{ token: string; lawyer: Lawyer }>('/auth/register', { method: 'POST', body: data }),
  me: () => request<Lawyer>('/auth/me'),
  logout: () => request<void>('/auth/logout', { method: 'POST' }),
}

export const clientsApi = {
  list: () => request<Client[]>('/clients'),
  get: (id: string) => request<Client>(`/clients/${id}`),
  create: (data: Omit<Client, 'id' | 'createdAt'>) => request<Client>('/clients', { method: 'POST', body: data }),
  update: (id: string, patch: Partial<Client>) => request<Client>(`/clients/${id}`, { method: 'PATCH', body: patch }),
  remove: (id: string) => request<void>(`/clients/${id}`, { method: 'DELETE' }),
}

export const casesApi = {
  list: (params?: { clientId?: string; status?: Case['status'] }) => request<Case[]>('/cases', { query: params }),
  get: (id: string) => request<Case>(`/cases/${id}`),
  create: (data: Omit<Case, 'id' | 'createdAt'>) => request<Case>('/cases', { method: 'POST', body: data }),
  update: (id: string, patch: Partial<Case>) => request<Case>(`/cases/${id}`, { method: 'PATCH', body: patch }),
}

export const templatesApi = {
  list: () => request<Template[]>('/templates'),
  get: (id: string) => request<Template>(`/templates/${id}`),
  clauses: (templateId: string) => request<ClauseBlock[]>(`/templates/${templateId}/clauses`),
}

export const draftsApi = {
  list: (params?: { caseId?: string; status?: Draft['status'] }) => request<Draft[]>('/drafts', { query: params }),
  get: (id: string) => request<Draft>(`/drafts/${id}`),
  create: (data: Omit<Draft, 'id' | 'createdAt' | 'updatedAt'>) => request<Draft>('/drafts', { method: 'POST', body: data }),
  update: (id: string, patch: Partial<Draft>) => request<Draft>(`/drafts/${id}`, { method: 'PATCH', body: patch }),
  generate: (data: { templateId: string; caseId: string; description: string }) =>
    request<{ draft: Draft; version: DocumentVersion }>('/drafts/generate', { method: 'POST', body: data }),
  versions: (draftId: string) => request<DocumentVersion[]>(`/drafts/${draftId}/versions`),
  addVersion: (draftId: string, data: { content: string; note: string }) =>
    request<DocumentVersion>(`/drafts/${draftId}/versions`, { method: 'POST', body: data }),
  export: (draftId: string, format: 'docx' | 'pdf') =>
    request<{ url: string }>(`/drafts/${draftId}/export`, { method: 'POST', body: { format } }),
}

export const alertsApi = {
  list: () => request<LegislationAlert[]>('/alerts'),
  markRead: (id: string) => request<void>(`/alerts/${id}/read`, { method: 'POST' }),
}

export const auditApi = {
  list: (params?: { targetId?: string }) => request<AuditLogEntry[]>('/audit', { query: params }),
}

export const aiUsageApi = {
  get: () => request<AiUsage>('/ai/usage'),
}

export const api = {
  auth: authApi,
  clients: clientsApi,
  cases: casesApi,
  templates: templatesApi,
  drafts: draftsApi,
  alerts: alertsApi,
  audit: auditApi,
  aiUsage: aiUsageApi,
  isConfigured: isBackendConfigured,
}

export default api
