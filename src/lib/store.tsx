// Единая точка данных приложения. Два режима, один и тот же публичный контракт
// (useAppData()/useAuth()) — компоненты кабинета не знают, откуда пришли данные:
//
//   — Демо-режим (VITE_API_URL не задан): всё живёт в localStorage, см. src/data/seed.ts.
//   — Боевой режим (VITE_API_URL задан): данные и авторизация идут через src/lib/api.ts
//     к реальному .NET-бэкенду (Backend/WebApi). Адаптация форм ответов бэкенда к типам
//     фронтенда — в src/lib/apiAdapters.ts, там же объяснены расхождения моделей.
//
// Мутации (addClient/addCase/addDraft/…) теперь асинхронные в обоих режимах — в боевом
// режиме id создаёт сервер, и синхронный «оптимистичный» id было бы нечестно возвращать.
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Client, Case, Draft, DocumentVersion, LegislationAlert, AuditLogEntry, ClauseBlock, Template } from '@/lib/types'
import {
  seedClients, seedCases, seedDrafts, seedVersions, seedAlerts, seedAudit,
  seedTemplates, seedClauses, seedLawyer, seedAiUsage,
} from '@/data/seed'
import { useT, useLanguage } from '@/lib/i18n/context'
import { localizedTemplates, localizedClauses, localizedFillClauses } from '@/lib/seedText'
import api, { isBackendConfigured, getAuthToken, getRefreshToken, setAuthTokens, ApiError } from '@/lib/api'
import {
  adaptLawyer, adaptClient, adaptCase, adaptTemplate, adaptClauseBlock, adaptDraft, adaptVersion,
  adaptAlert, adaptAuditEntry, clientToCreateDto, AI_AUTHOR_MARK,
} from '@/lib/apiAdapters'

const LS_KEY = 'shartnomayor_state_v1'
const AUTH_KEY = 'shartnomayor_auth_v1'
const isRealBackend = isBackendConfigured()

interface State {
  clients: Client[]
  cases: Case[]
  drafts: Draft[]
  versions: DocumentVersion[]
  alerts: LegislationAlert[]
  audit: AuditLogEntry[]
  aiUsed: number
}

const emptyState: State = { clients: [], cases: [], drafts: [], versions: [], alerts: [], audit: [], aiUsed: 0 }

function loadInitialDemo(): State {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignore */
  }
  return {
    clients: seedClients,
    cases: seedCases,
    drafts: seedDrafts,
    versions: seedVersions,
    alerts: seedAlerts,
    audit: seedAudit,
    aiUsed: seedAiUsage.used,
  }
}

interface Ctx extends State {
  templates: Template[]
  clauses: ClauseBlock[]
  lawyer: { id: string; fullName: string; email: string; firm?: string; plan: 'free' | 'pro' }
  aiLimit: number
  loading: boolean
  isRealBackend: boolean
  addClient: (c: { name: string; type: 'individual' | 'company'; status: Client['status']; contact: string; note?: string }) => Promise<Client>
  updateClient: (id: string, patch: Partial<Client>) => Promise<void>
  addCase: (c: { clientId: string; title: string; status: Case['status'] }) => Promise<Case>
  /** Боевой режим: одним запросом создаёт черновик и первую ИИ-версию (Gemini на бэкенде). */
  addDraft: (d: { caseId: string; templateId: string; title: string; status: Draft['status']; currentVersionId: string; responsibilityConfirmed: boolean; dealDescription?: string }) => Promise<Draft & { generatedContent?: string }>
  addVersion: (v: { draftId: string; content: string; note: string; author: string }) => Promise<DocumentVersion>
  updateDraft: (id: string, patch: Partial<Draft>) => Promise<void>
  loadDraftVersions: (draftId: string) => Promise<void>
  markAlertRead: (id: string) => Promise<void>
  logAudit: (action: string, target: string) => void
  incAiUsage: () => void
  resetDemoData: () => void
  reloadAll: () => Promise<void>
}

const AppDataContext = createContext<Ctx | null>(null)

export function AppDataProvider({ children }: { children: ReactNode }) {
  const t = useT()
  const { lang } = useLanguage()
  const [state, setState] = useState<State>(isRealBackend ? emptyState : loadInitialDemo)
  const [loading, setLoading] = useState(isRealBackend)
  const [realTemplates, setRealTemplates] = useState<Template[]>([])
  const [realClauses, setRealClauses] = useState<ClauseBlock[]>([])
  const [realLawyer, setRealLawyer] = useState<Ctx['lawyer']>({ id: '', fullName: seedLawyer.fullName, email: '', plan: 'free' })
  const [realAiLimit, setRealAiLimit] = useState(seedAiUsage.limit)

  useEffect(() => {
    if (!isRealBackend) return
    localStorage.setItem(LS_KEY, JSON.stringify(state))
  }, [state])

  const logAudit = (action: string, target: string) => {
    if (isRealBackend) return // боевой режим: аудит пишет бэкенд сам на каждую CQRS-операцию
    setState((s) => ({
      ...s,
      audit: [
        { id: `a-${Date.now()}`, action, target, actor: seedLawyer.fullName, date: new Date().toLocaleString('ru-RU') },
        ...s.audit,
      ],
    }))
  }

  // -------------------------------------------------------------------------
  // Боевой режим: загрузка данных с реального бэкенда.
  // Бэкенд не даёт «плоский» список дел/черновиков по всем клиентам разом (безопасность
  // по tenant), поэтому дела грузятся по каждому клиенту, а черновики — по каждому делу.
  // На демо-масштабе (единицы клиентов) это быстро; для большого портфеля стоило бы
  // сделать выделенный агрегирующий эндпоинт на бэкенде.
  // -------------------------------------------------------------------------
  // Ограничивает число одновременных запросов — библиотека шаблонов может содержать сотни
  // записей, и неограниченный Promise.all забивает пул соединений бэкенда к базе (особенно
  // заметно на маломощном бесплатном хостинге вроде Render free tier).
  async function mapWithConcurrency<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
    const results: R[] = new Array(items.length)
    let index = 0
    async function worker() {
      while (index < items.length) {
        const current = index++
        results[current] = await fn(items[current])
      }
    }
    await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
    return results
  }

  // Бэкенд ограничивает pageSize максимум 100 записями (см. Application/Common/Validation/
  // ValidationRules.MaximumPageSize) — при библиотеке в сотни шаблонов одной страницы мало,
  // поэтому дочитываем все оставшиеся страницы перед тем, как отдавать список в UI.
  async function fetchAllTemplates() {
    const first = await api.templates.list({ pageSize: 100, pageNumber: 1 })
    const items = [...first.items]
    for (let page = 2; page <= first.totalPages; page++) {
      // Один медленный ответ хостинга не должен обнулять уже полученные страницы —
      // отдаём то, что успели собрать, вместо падения всей загрузки библиотеки.
      try {
        const next = await api.templates.list({ pageSize: 100, pageNumber: page })
        items.push(...next.items)
      } catch {
        break
      }
    }
    return { ...first, items }
  }

  async function loadAll() {
    if (!isRealBackend || !getAuthToken()) { setLoading(false); return }
    setLoading(true)
    try {
      const [profile, clientsPage, templatesPage, aiUsage] = await Promise.all([
        api.auth.me(),
        api.clients.list({ pageSize: 100 }),
        fetchAllTemplates().catch(() => ({ items: [] as never[] })),
        api.aiUsage.get().catch(() => null),
      ])
      setRealLawyer(adaptLawyer(profile))
      if (aiUsage?.requestsLimit) setRealAiLimit(aiUsage.requestsLimit)

      const clients = clientsPage.items.map(adaptClient)

      const casesNested = await Promise.all(
        clientsPage.items.map((c) => api.clients.cases(c.id, { pageSize: 100 }).catch(() => ({ items: [] as never[] })))
      )
      const cases = casesNested.flatMap((page) => page.items.map(adaptCase))
      const rawCases = casesNested.flatMap((page) => page.items)

      const draftsNested = await Promise.all(
        rawCases.map((c) => api.cases.documents(c.id, { pageSize: 100 }).catch(() => ({ items: [] as never[] })))
      )
      const clientById = new Map(clients.map((c) => [c.id, c]))
      const caseById = new Map(cases.map((c) => [c.id, c]))
      const templateNameById = new Map(templatesPage.items.map((tp) => [tp.id, tp.name]))
      const drafts = draftsNested.flatMap((page) =>
        page.items.map((d) => {
          const relatedCase = caseById.get(d.caseId)
          const client = relatedCase ? clientById.get(relatedCase.clientId) : undefined
          const title = `${d.templateName || templateNameById.get(d.templateId) || 'Договор'} — ${client?.name || relatedCase?.title || ''}`
          return adaptDraft(d, title)
        })
      )

      const templatesWithClauses = await mapWithConcurrency(
        templatesPage.items,
        3,
        async (tp) => {
          const clauseLinks = await api.templates.clauseBlocks(tp.id).catch(() => [])
          return { template: adaptTemplate(tp, clauseLinks.map((c) => c.id)), clauseLinks }
        }
      )
      const templates = templatesWithClauses.map((x) => x.template)
      const clauses: ClauseBlock[] = templatesWithClauses.flatMap(({ template, clauseLinks }) =>
        clauseLinks.map((c) => adaptClauseBlock(c, template.id, lang, false))
      )

      // Бэкенд намеренно ограничивает MVP-выборку только непрочитанными уведомлениями
      // (см. LegislationFeature.cs: RuleFor(...).Equal(true)) — запрос с false отклоняется.
      const alertsPage = await api.legislation.alerts({ pageSize: 50, unreadOnly: true }).catch(() => ({ items: [] as never[] }))
      const alerts = alertsPage.items.map(adaptAlert)

      setRealTemplates(templates)
      setRealClauses(clauses)
      setState((s) => ({ ...s, clients, cases, drafts, alerts, aiUsed: aiUsage?.requestsUsed ?? s.aiUsed }))
    } catch (err) {
      if (!(err instanceof ApiError && err.status === 401)) {
        console.error('Не удалось загрузить данные с бэкенда', err)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isRealBackend) void loadAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadDraftVersionsReal(draftId: string) {
    const [detail, versionsPage] = await Promise.all([
      api.drafts.get(draftId),
      api.drafts.versions(draftId, { pageSize: 100 }),
    ])
    const authorName = realLawyer.fullName
    const versions: DocumentVersion[] = await Promise.all(
      versionsPage.items.map(async (v) => {
        if (v.id === detail.currentVersionId && detail.currentContent) {
          return adaptVersion(v, detail.currentContent, authorName)
        }
        const full = await api.drafts.versionById(v.id).catch(() => null)
        return adaptVersion(v, full?.content || '', authorName)
      })
    )
    setState((s) => ({
      ...s,
      versions: [...s.versions.filter((v) => v.draftId !== draftId), ...versions],
    }))
  }

  const value = useMemo<Ctx>(() => {
    if (isRealBackend) {
      return {
        ...state,
        templates: realTemplates,
        clauses: realClauses,
        lawyer: realLawyer,
        aiLimit: realAiLimit,
        loading,
        isRealBackend: true,
        reloadAll: loadAll,
        loadDraftVersions: loadDraftVersionsReal,

        addClient: async (c) => {
          const id = await api.clients.create(clientToCreateDto(c))
          const detail = await api.clients.get(id)
          const client = adaptClient(detail)
          setState((s) => ({ ...s, clients: [client, ...s.clients] }))
          return client
        },
        updateClient: async (id, patch) => {
          const current = state.clients.find((c) => c.id === id)
          if (!current) return
          const merged = { ...current, ...patch }
          // Статус ('active'/'potential'/'archived') у бэкенда не хранится — меняем только локально.
          if (Object.keys(patch).length === 1 && 'status' in patch) {
            setState((s) => ({ ...s, clients: s.clients.map((c) => (c.id === id ? merged : c)) }))
            return
          }
          const detail = await api.clients.update(id, clientToCreateDto(merged))
          setState((s) => ({ ...s, clients: s.clients.map((c) => (c.id === id ? adaptClient(detail) : c)) }))
        },
        addCase: async (c) => {
          const id = await api.cases.create({ clientId: c.clientId, title: c.title })
          const detail = await api.cases.get(id)
          const item = adaptCase(detail)
          setState((s) => ({ ...s, cases: [item, ...s.cases] }))
          return item
        },
        addDraft: async (d) => {
          const op = await api.drafts.create({
            caseId: d.caseId,
            templateId: d.templateId,
            dealDescription: d.dealDescription || d.title,
          })
          const detail = await api.drafts.get(op.draftId)
          const draft = adaptDraft(detail, d.title)
          const version = adaptVersion(
            { id: op.versionId, draftId: op.draftId, versionNumber: op.versionNumber, source: 'AiGenerated', createdByLawyerId: realLawyer.id, createdAt: new Date().toISOString() },
            op.content,
            realLawyer.fullName
          )
          setState((s) => ({ ...s, drafts: [draft, ...s.drafts], versions: [...s.versions, version] }))
          return { ...draft, generatedContent: op.content }
        },
        // В боевом режиме версия создаётся сервером внутри addDraft/updateDraft — здесь это no-op,
        // чтобы не дублировать существующие вызовы addVersion() в DraftEditor.tsx/DraftNew.tsx.
        addVersion: async (v) => {
          const draft = state.drafts.find((d) => d.id === v.draftId)
          const op = await api.drafts.update(v.draftId, { content: v.content, changeSummary: v.note })
          const version = adaptVersion(
            { id: op.versionId, draftId: v.draftId, versionNumber: op.versionNumber, source: 'ManualEdit', createdByLawyerId: realLawyer.id, createdAt: new Date().toISOString() },
            op.content,
            realLawyer.fullName
          )
          setState((s) => ({
            ...s,
            versions: [...s.versions, version],
            drafts: s.drafts.map((d) => (d.id === v.draftId ? { ...d, currentVersionId: version.id, updatedAt: new Date().toISOString().slice(0, 10) } : d)),
          }))
          void draft
          return version
        },
        updateDraft: async (id, patch) => {
          if (patch.responsibilityConfirmed) {
            await api.drafts.confirmResponsibility(id).catch(() => {})
          }
          setState((s) => ({ ...s, drafts: s.drafts.map((d) => (d.id === id ? { ...d, ...patch } : d)) }))
        },
        markAlertRead: async (id) => {
          await api.legislation.markRead(id).catch(() => {})
          setState((s) => ({ ...s, alerts: s.alerts.map((a) => (a.id === id ? { ...a, read: true } : a)) }))
        },
        logAudit,
        incAiUsage: () => setState((s) => ({ ...s, aiUsed: s.aiUsed + 1 })),
        resetDemoData: () => void loadAll(),
      }
    }

    // ---------------------------------------------------------------------
    // Демо-режим — прежнее поведение на localStorage, без изменений по сути.
    // ---------------------------------------------------------------------
    return {
      ...state,
      templates: localizedTemplates(t),
      clauses: localizedClauses(t),
      lawyer: { id: seedLawyer.id, fullName: seedLawyer.fullName, email: seedLawyer.email, firm: seedLawyer.firm, plan: seedLawyer.plan },
      aiLimit: seedAiUsage.limit,
      loading: false,
      isRealBackend: false,
      reloadAll: async () => {},
      loadDraftVersions: async () => {},
      addClient: async (c) => {
        const client: Client = { ...c, id: `cli-${Date.now()}`, createdAt: new Date().toISOString().slice(0, 10) }
        setState((s) => ({ ...s, clients: [client, ...s.clients] }))
        logAudit(t.audit.addClient, client.name)
        return client
      },
      updateClient: async (id, patch) => {
        setState((s) => ({ ...s, clients: s.clients.map((c) => (c.id === id ? { ...c, ...patch } : c)) }))
        if (patch.status) {
          const target = state.clients.find((c) => c.id === id)
          if (target) logAudit(t.audit.statusChanged, target.name)
        }
      },
      addCase: async (c) => {
        const item: Case = { ...c, id: `case-${Date.now()}`, createdAt: new Date().toISOString().slice(0, 10) }
        setState((s) => ({ ...s, cases: [item, ...s.cases] }))
        logAudit(t.audit.addCase, item.title)
        return item
      },
      addDraft: async (d) => {
        const item: Draft = {
          id: `draft-${Date.now()}`,
          caseId: d.caseId,
          templateId: d.templateId,
          title: d.title,
          status: d.status,
          currentVersionId: d.currentVersionId,
          responsibilityConfirmed: d.responsibilityConfirmed,
          createdAt: new Date().toISOString().slice(0, 10),
          updatedAt: new Date().toISOString().slice(0, 10),
        }
        setState((s) => ({ ...s, drafts: [item, ...s.drafts] }))
        logAudit(t.audit.addDraftAi, item.title)
        return item
      },
      addVersion: async (v) => {
        const existing = state.versions.filter((x) => x.draftId === v.draftId)
        const number = existing.length + 1
        const version: DocumentVersion = {
          ...v,
          id: `v-${v.draftId}-${Date.now()}`,
          number,
          createdAt: new Date().toLocaleString('ru-RU'),
        }
        setState((s) => ({
          ...s,
          versions: [...s.versions, version],
          drafts: s.drafts.map((d) => (d.id === v.draftId ? { ...d, currentVersionId: version.id, updatedAt: new Date().toISOString().slice(0, 10) } : d)),
        }))
        logAudit(t.audit.editVersion, v.note || t.audit.manualEdit)
        return version
      },
      updateDraft: async (id, patch) => {
        setState((s) => ({ ...s, drafts: s.drafts.map((d) => (d.id === id ? { ...d, ...patch } : d)) }))
      },
      markAlertRead: async (id) => {
        setState((s) => ({ ...s, alerts: s.alerts.map((a) => (a.id === id ? { ...a, read: true } : a)) }))
      },
      logAudit,
      incAiUsage: () => setState((s) => ({ ...s, aiUsed: Math.min(s.aiUsed + 1, seedAiUsage.limit) })),
      resetDemoData: () => {
        localStorage.removeItem(LS_KEY)
        setState(loadInitialDemo())
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, [state, t, lang, loading, realTemplates, realClauses, realLawyer, realAiLimit])

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useAppData() {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider')
  return ctx
}

export function useAuth() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(() => {
    try {
      const raw = localStorage.getItem(AUTH_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })
  const [authChecked, setAuthChecked] = useState(!isRealBackend)
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    if (!isRealBackend) return
    if (!getAuthToken() && !getRefreshToken()) { setAuthChecked(true); return }
    api.auth.me()
      .then((profile) => {
        const u = { name: profile.fullName, email: profile.email || '' }
        localStorage.setItem(AUTH_KEY, JSON.stringify(u))
        setUser(u)
      })
      .catch(() => {
        setAuthTokens(null)
        localStorage.removeItem(AUTH_KEY)
        setUser(null)
      })
      .finally(() => setAuthChecked(true))
  }, [])

  const login = async (email: string, password: string, name?: string) => {
    setAuthError(null)
    if (isRealBackend) {
      try {
        const tokens = await api.auth.login(email, password)
        setAuthTokens({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken })
        const profile = await api.auth.me()
        const u = { name: profile.fullName, email: profile.email || email }
        localStorage.setItem(AUTH_KEY, JSON.stringify(u))
        setUser(u)
      } catch (err) {
        setAuthError(err instanceof ApiError ? err.message : 'Не удалось войти.')
        throw err
      }
      return
    }
    const u = { name: name || seedLawyer.fullName, email }
    localStorage.setItem(AUTH_KEY, JSON.stringify(u))
    setUser(u)
  }

  const register = async (data: { email: string; password: string; fullName: string; lawFirmName?: string }) => {
    setAuthError(null)
    if (isRealBackend) {
      try {
        await api.auth.register(data)
        await login(data.email, data.password)
      } catch (err) {
        setAuthError(err instanceof ApiError ? err.message : 'Не удалось зарегистрироваться.')
        throw err
      }
      return
    }
    await login(data.email, data.password, data.fullName)
  }

  const logout = () => {
    if (isRealBackend) setAuthTokens(null)
    localStorage.removeItem(AUTH_KEY)
    setUser(null)
  }

  return { user, login, register, logout, isAuthenticated: !!user, authChecked, authError }
}

export { AI_AUTHOR_MARK }
