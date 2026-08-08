import type { DraftStatus, Case, ClientStatus } from '@/lib/types'
import type { Dict } from '@/lib/i18n'

export function statusLabel(status: DraftStatus, t: Dict): string {
  return t.labels.draftStatus[status]
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

export function caseStatusLabel(status: Case['status'], t: Dict): string {
  return t.labels.caseStatus[status]
}

export function caseStatusBadge(status: Case['status']): 'green' | 'neutral' | 'amber' {
  const map: Record<Case['status'], 'green' | 'neutral' | 'amber'> = { active: 'green', closed: 'neutral', archived: 'amber' }
  return map[status]
}

export function severityBadge(sev: 'info' | 'important' | 'critical'): 'blue' | 'amber' | 'red' {
  return sev === 'critical' ? 'red' : sev === 'important' ? 'amber' : 'blue'
}

export function severityLabel(sev: 'info' | 'important' | 'critical', t: Dict): string {
  return t.labels.severity[sev]
}

export function clientStatusLabel(status: ClientStatus, t: Dict): string {
  return t.labels.clientStatus[status]
}

export function clientStatusBadge(status: ClientStatus): 'green' | 'amber' | 'neutral' {
  const map: Record<ClientStatus, 'green' | 'amber' | 'neutral'> = { active: 'green', potential: 'amber', archived: 'neutral' }
  return map[status]
}
