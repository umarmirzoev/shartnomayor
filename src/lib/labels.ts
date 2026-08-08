import type { DraftStatus, Case } from '@/lib/types'

export function statusLabel(status: DraftStatus): string {
  const map: Record<DraftStatus, string> = {
    draft: 'Черновик',
    in_review: 'На проверке',
    ready: 'Готов',
    exported: 'Экспортирован',
    archived: 'В архиве',
  }
  return map[status]
}

export function statusBadge(status: DraftStatus): 'neutral' | 'gold' | 'green' | 'blue' | 'red' | 'amber' {
  const map: Record<DraftStatus, 'neutral' | 'gold' | 'green' | 'blue' | 'red' | 'amber'> = {
    draft: 'neutral',
    in_review: 'amber',
    ready: 'blue',
    exported: 'green',
    archived: 'neutral',
  }
  return map[status]
}

export function caseStatusLabel(status: Case['status']): string {
  const map: Record<Case['status'], string> = { active: 'Активно', closed: 'Закрыто', archived: 'В архиве' }
  return map[status]
}

export function caseStatusBadge(status: Case['status']): 'green' | 'neutral' | 'amber' {
  const map: Record<Case['status'], 'green' | 'neutral' | 'amber'> = { active: 'green', closed: 'neutral', archived: 'amber' }
  return map[status]
}

export function severityBadge(sev: 'info' | 'important' | 'critical'): 'blue' | 'amber' | 'red' {
  return sev === 'critical' ? 'red' : sev === 'important' ? 'amber' : 'blue'
}

export function severityLabel(sev: 'info' | 'important' | 'critical'): string {
  return sev === 'critical' ? 'Критично' : sev === 'important' ? 'Важно' : 'Информация'
}
