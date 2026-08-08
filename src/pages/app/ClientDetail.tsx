import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Building2, User, Phone, Plus, Briefcase } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Field, Input, Select } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { useAppData } from '@/lib/store'
import { caseStatusBadge, caseStatusLabel, clientStatusBadge, clientStatusLabel } from '@/lib/labels'
import type { ClientStatus } from '@/lib/types'
import { useT } from '@/lib/i18n/context'
import type { Dict } from '@/lib/i18n'
import { localizeClientNote, localizeCaseTitle } from '@/lib/seedText'

export default function ClientDetail() {
  const t = useT()
  const { id } = useParams()
  const { clients, cases, addCase, updateClient } = useAppData()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const client = clients.find((c) => c.id === id)
  const clientCases = cases.filter((c) => c.clientId === id)

  if (!client) {
    return <p className="text-sm text-ink-500">{t.app.clientDetail.notFound} <Link to="/app/clients" className="underline">{t.app.clientDetail.backToList}</Link></p>
  }

  const note = localizeClientNote(client, t)

  return (
    <div className="max-w-4xl">
      <Link to="/app/clients" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-900">
        <ArrowLeft size={15} /> {t.app.clientDetail.backLink}
      </Link>

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex items-start gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-ink-900 text-gold-500">
            {client.type === 'company' ? <Building2 size={24} /> : <User size={24} />}
          </span>
          <div>
            <h1 className="text-2xl font-bold text-ink-950">{client.name}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-500"><Phone size={13} /> {client.contact}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge tone="neutral">{client.type === 'company' ? t.app.clientDetail.legalEntity : t.app.clientDetail.individual}</Badge>
              <Badge tone={clientStatusBadge(client.status)}>{clientStatusLabel(client.status, t)}</Badge>
              <span className="text-xs text-ink-400">{t.app.clientDetail.clientSince} {client.createdAt}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={client.status}
            onChange={(e) => updateClient(client.id, { status: e.target.value as ClientStatus })}
            className="w-auto py-2 text-xs"
          >
            <option value="active">{t.labels.clientStatus.active}</option>
            <option value="potential">{t.labels.clientStatus.potential}</option>
            <option value="archived">{t.labels.clientStatus.archived}</option>
          </Select>
          <Button icon={<Plus size={16} />} onClick={() => setOpen(true)}>{t.app.clientDetail.newCase}</Button>
        </div>
      </div>

      {note && (
        <Card className="mb-6 p-5 text-sm text-ink-600">{note}</Card>
      )}

      <h2 className="mb-3 text-sm font-bold text-ink-900">{t.app.clientDetail.casesTitle} ({clientCases.length})</h2>
      <div className="space-y-3">
        {clientCases.map((c) => (
          <Link key={c.id} to={`/app/cases/${c.id}`}>
            <Card className="flex items-center justify-between p-4 transition hover:-translate-y-0.5 hover:shadow-soft">
              <span className="flex items-center gap-3 text-sm font-semibold text-ink-900">
                <Briefcase size={16} className="text-ink-400" /> {localizeCaseTitle(c, t)}
              </span>
              <Badge tone={caseStatusBadge(c.status)}>{caseStatusLabel(c.status, t)}</Badge>
            </Card>
          </Link>
        ))}
        {clientCases.length === 0 && <p className="text-sm text-ink-400">{t.app.clientDetail.noCases}</p>}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={t.app.clientDetail.newCaseModalTitle}>
        <NewCaseForm
          t={t}
          onCreate={(title) => {
            const item = addCase({ clientId: client.id, title, status: 'active' })
            setOpen(false)
            navigate(`/app/cases/${item.id}`)
          }}
        />
      </Modal>
    </div>
  )
}

function NewCaseForm({ onCreate, t }: { onCreate: (title: string) => void; t: Dict }) {
  const [title, setTitle] = useState('')
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!title.trim()) return
        onCreate(title)
      }}
      className="space-y-4"
    >
      <Field label={t.app.clientDetail.caseNameLabel} required>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t.app.clientDetail.caseNamePlaceholder} required />
      </Field>
      <div className="flex justify-end">
        <Button type="submit">{t.app.clientDetail.createCase}</Button>
      </div>
    </form>
  )
}
