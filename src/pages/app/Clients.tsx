import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, Building2, User, ArrowUpRight } from 'lucide-react'
import clsx from 'clsx'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Field, Input, Select, Textarea } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { useAppData } from '@/lib/store'
import { clientStatusBadge, clientStatusLabel } from '@/lib/labels'
import type { Client, ClientStatus } from '@/lib/types'
import { useT } from '@/lib/i18n/context'
import type { Dict } from '@/lib/i18n'

export default function Clients() {
  const t = useT()
  const { clients, cases, addClient } = useAppData()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<ClientStatus | 'all'>('all')
  const [open, setOpen] = useState(false)

  const statusTabs: { value: ClientStatus | 'all'; label: string }[] = [
    { value: 'all', label: t.app.clients.tabAll },
    { value: 'active', label: t.app.clients.tabActive },
    { value: 'potential', label: t.app.clients.tabPotential },
    { value: 'archived', label: t.app.clients.tabArchived },
  ]

  const counts = useMemo(() => {
    const map: Record<ClientStatus | 'all', number> = { all: clients.length, active: 0, potential: 0, archived: 0 }
    clients.forEach((c) => { map[c.status] += 1 })
    return map
  }, [clients])

  const filtered = useMemo(
    () =>
      clients
        .filter((c) => status === 'all' || c.status === status)
        .filter((c) => c.name.toLowerCase().includes(query.toLowerCase())),
    [clients, query, status]
  )

  return (
    <div className="max-w-6xl">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-ink-950 dark:text-white">{t.app.clients.title}</h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{clients.length} {t.app.clients.countSuffix}</p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => setOpen(true)}>{t.app.clients.newClient}</Button>
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300 dark:text-ink-500" />
          <Input className="pl-10" placeholder={t.app.clients.searchPlaceholder} value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatus(tab.value)}
              className={clsx(
                'flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 active:scale-95',
                status === tab.value
                  ? 'border-ink-900 bg-ink-900 text-white shadow-soft dark:border-white dark:bg-white dark:text-ink-950'
                  : 'border-ink-200 text-ink-600 hover:border-ink-400 hover:bg-ink-50 dark:border-white/10 dark:text-ink-300 dark:hover:border-white/25 dark:hover:bg-white/5'
              )}
            >
              {tab.label}
              <span
                className={clsx(
                  'rounded-full px-1.5 py-0.5 text-[10px] font-bold',
                  status === tab.value ? 'bg-white/20 text-white dark:bg-ink-950/10 dark:text-ink-950' : 'bg-ink-100 text-ink-500 dark:bg-white/10 dark:text-ink-400'
                )}
              >
                {counts[tab.value]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="hidden grid-cols-[1fr_110px_120px_1fr_80px_40px] gap-4 border-b border-ink-100 bg-ink-50/60 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-ink-400 dark:border-white/10 dark:bg-white/[0.02] dark:text-ink-500 sm:grid">
          <span>{t.app.clients.colClient}</span>
          <span>{t.app.clients.colType}</span>
          <span>{t.app.clients.colStatus}</span>
          <span>{t.app.clients.colContacts}</span>
          <span>{t.app.clients.colCases}</span>
          <span />
        </div>
        <div className="divide-y divide-ink-100 dark:divide-white/10">
          {filtered.map((c) => (
            <Link
              key={c.id}
              to={`/app/clients/${c.id}`}
              className="group grid grid-cols-1 gap-2 px-5 py-4 transition-colors duration-200 hover:bg-ink-50 dark:hover:bg-white/[0.04] sm:grid-cols-[1fr_110px_120px_1fr_80px_40px] sm:items-center sm:gap-4"
            >
              <span className="flex items-center gap-2.5 text-sm font-semibold text-ink-900 dark:text-white">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink-100 text-ink-500 dark:bg-white/10 dark:text-ink-300">
                  {c.type === 'company' ? <Building2 size={15} /> : <User size={15} />}
                </span>
                {c.name}
              </span>
              <span>
                <Badge tone="neutral">{c.type === 'company' ? t.app.clients.typeCompany : t.app.clients.typeIndividual}</Badge>
              </span>
              <span>
                <Badge tone={clientStatusBadge(c.status)}>{clientStatusLabel(c.status, t)}</Badge>
              </span>
              <span className="truncate text-sm text-ink-500 dark:text-ink-400">{c.contact}</span>
              <span className="text-sm text-ink-500 dark:text-ink-400">{cases.filter((k) => k.clientId === c.id).length}</span>
              <ArrowUpRight size={15} className="hidden text-ink-300 transition-transform duration-200 group-hover:translate-x-0.5 dark:text-ink-500 sm:block" />
            </Link>
          ))}
          {filtered.length === 0 && <p className="px-5 py-8 text-center text-sm text-ink-400 dark:text-ink-500">{t.common.notFoundShort}</p>}
        </div>
      </Card>

      <NewClientModal open={open} onClose={() => setOpen(false)} onCreate={addClient} t={t} />
    </div>
  )
}

function NewClientModal({ open, onClose, onCreate, t }: { open: boolean; onClose: () => void; onCreate: (c: Omit<Client, 'id' | 'createdAt'>) => Promise<Client>; t: Dict }) {
  const [name, setName] = useState('')
  const [type, setType] = useState<'individual' | 'company'>('company')
  const [status, setStatus] = useState<ClientStatus>('active')
  const [contact, setContact] = useState('')
  const [note, setNote] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    await onCreate({ name, type, status, contact, note })
    setName(''); setContact(''); setNote(''); setStatus('active')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={t.app.clients.modalTitle}>
      <form onSubmit={submit} className="space-y-4">
        <Field label={t.app.clients.nameLabel} required>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t.app.clients.namePlaceholder} required />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label={t.app.clients.typeLabel}>
            <Select value={type} onChange={(e) => setType(e.target.value as 'individual' | 'company')}>
              <option value="company">{t.app.clients.typeCompanyOpt}</option>
              <option value="individual">{t.app.clients.typeIndividualOpt}</option>
            </Select>
          </Field>
          <Field label={t.app.clients.statusLabel}>
            <Select value={status} onChange={(e) => setStatus(e.target.value as ClientStatus)}>
              <option value="active">{t.labels.clientStatus.active}</option>
              <option value="potential">{t.labels.clientStatus.potential}</option>
              <option value="archived">{t.labels.clientStatus.archived}</option>
            </Select>
          </Field>
        </div>
        <Field label={t.app.clients.contactLabel}>
          <Input value={contact} onChange={(e) => setContact(e.target.value)} placeholder={t.app.clients.contactPlaceholder} />
        </Field>
        <Field label={t.app.clients.noteLabel} hint={t.app.clients.noteHint}>
          <Textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder={t.app.clients.notePlaceholder} />
        </Field>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>{t.common.cancel}</Button>
          <Button type="submit">{t.app.clients.addClient}</Button>
        </div>
      </form>
    </Modal>
  )
}
