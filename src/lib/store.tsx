import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Client, Case, Draft, DocumentVersion, LegislationAlert, AuditLogEntry } from '@/lib/types'
import {
  seedClients, seedCases, seedDrafts, seedVersions, seedAlerts, seedAudit,
  seedTemplates, seedClauses, seedLawyer, seedAiUsage,
} from '@/data/seed'

const LS_KEY = 'shartnomayor_state_v1'
const AUTH_KEY = 'shartnomayor_auth_v1'

interface State {
  clients: Client[]
  cases: Case[]
  drafts: Draft[]
  versions: DocumentVersion[]
  alerts: LegislationAlert[]
  audit: AuditLogEntry[]
  aiUsed: number
}

function loadInitial(): State {
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
  templates: typeof seedTemplates
  clauses: typeof seedClauses
  lawyer: typeof seedLawyer
  aiLimit: number
  addClient: (c: Omit<Client, 'id' | 'createdAt'>) => Client
  addCase: (c: Omit<Case, 'id' | 'createdAt'>) => Case
  addDraft: (d: Omit<Draft, 'id' | 'createdAt' | 'updatedAt'>) => Draft
  addVersion: (v: Omit<DocumentVersion, 'id' | 'createdAt' | 'number'>) => DocumentVersion
  updateDraft: (id: string, patch: Partial<Draft>) => void
  markAlertRead: (id: string) => void
  logAudit: (action: string, target: string) => void
  incAiUsage: () => void
  resetDemoData: () => void
}

const AppDataContext = createContext<Ctx | null>(null)

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(loadInitial)

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(state))
  }, [state])

  const logAudit = (action: string, target: string) => {
    setState((s) => ({
      ...s,
      audit: [
        { id: `a-${Date.now()}`, action, target, actor: seedLawyer.fullName, date: new Date().toLocaleString('ru-RU') },
        ...s.audit,
      ],
    }))
  }

  const value = useMemo<Ctx>(() => ({
    ...state,
    templates: seedTemplates,
    clauses: seedClauses,
    lawyer: seedLawyer,
    aiLimit: seedAiUsage.limit,
    addClient: (c) => {
      const client: Client = { ...c, id: `cli-${Date.now()}`, createdAt: new Date().toISOString().slice(0, 10) }
      setState((s) => ({ ...s, clients: [client, ...s.clients] }))
      logAudit('Добавлен новый клиент', client.name)
      return client
    },
    addCase: (c) => {
      const item: Case = { ...c, id: `case-${Date.now()}`, createdAt: new Date().toISOString().slice(0, 10) }
      setState((s) => ({ ...s, cases: [item, ...s.cases] }))
      logAudit('Создано новое дело', item.title)
      return item
    },
    addDraft: (d) => {
      const item: Draft = {
        ...d,
        id: `draft-${Date.now()}`,
        createdAt: new Date().toISOString().slice(0, 10),
        updatedAt: new Date().toISOString().slice(0, 10),
      }
      setState((s) => ({ ...s, drafts: [item, ...s.drafts] }))
      logAudit('Создан черновик по описанию сделки (ИИ)', item.title)
      return item
    },
    addVersion: (v) => {
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
      logAudit('Изменена версия черновика', v.note || 'Ручная правка')
      return version
    },
    updateDraft: (id, patch) => {
      setState((s) => ({ ...s, drafts: s.drafts.map((d) => (d.id === id ? { ...d, ...patch } : d)) }))
    },
    markAlertRead: (id) => {
      setState((s) => ({ ...s, alerts: s.alerts.map((a) => (a.id === id ? { ...a, read: true } : a)) }))
    },
    logAudit,
    incAiUsage: () => setState((s) => ({ ...s, aiUsed: Math.min(s.aiUsed + 1, seedAiUsage.limit) })),
    resetDemoData: () => {
      localStorage.removeItem(LS_KEY)
      setState(loadInitial())
    },
  }), [state])

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

  const login = (email: string, name?: string) => {
    const u = { name: name || seedLawyer.fullName, email }
    localStorage.setItem(AUTH_KEY, JSON.stringify(u))
    setUser(u)
  }
  const logout = () => {
    localStorage.removeItem(AUTH_KEY)
    setUser(null)
  }

  return { user, login, logout, isAuthenticated: !!user }
}
