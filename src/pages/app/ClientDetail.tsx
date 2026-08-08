import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Building2, User, Phone, Plus, Briefcase } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { useAppData } from '@/lib/store'
import { caseStatusBadge, caseStatusLabel } from '@/lib/labels'

export default function ClientDetail() {
  const { id } = useParams()
  const { clients, cases, addCase } = useAppData()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const client = clients.find((c) => c.id === id)
  const clientCases = cases.filter((c) => c.clientId === id)

  if (!client) {
    return <p className="text-sm text-ink-500">Клиент не найден. <Link to="/app/clients" className="underline">Назад к списку</Link></p>
  }

  return (
    <div className="max-w-4xl">
      <Link to="/app/clients" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-900">
        <ArrowLeft size={15} /> Клиенты
      </Link>

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex items-start gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-ink-900 text-gold-500">
            {client.type === 'company' ? <Building2 size={24} /> : <User size={24} />}
          </span>
          <div>
            <h1 className="text-2xl font-bold text-ink-950">{client.name}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-500"><Phone size={13} /> {client.contact}</p>
            <div className="mt-2 flex items-center gap-2">
              <Badge tone="neutral">{client.type === 'company' ? 'Юридическое лицо' : 'Физическое лицо'}</Badge>
              <span className="text-xs text-ink-400">клиент с {client.createdAt}</span>
            </div>
          </div>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => setOpen(true)}>Новое дело</Button>
      </div>

      {client.note && (
        <Card className="mb-6 p-5 text-sm text-ink-600">{client.note}</Card>
      )}

      <h2 className="mb-3 text-sm font-bold text-ink-900">Дела клиента ({clientCases.length})</h2>
      <div className="space-y-3">
        {clientCases.map((c) => (
          <Link key={c.id} to={`/app/cases/${c.id}`}>
            <Card className="flex items-center justify-between p-4 transition hover:-translate-y-0.5 hover:shadow-soft">
              <span className="flex items-center gap-3 text-sm font-semibold text-ink-900">
                <Briefcase size={16} className="text-ink-400" /> {c.title}
              </span>
              <Badge tone={caseStatusBadge(c.status)}>{caseStatusLabel(c.status)}</Badge>
            </Card>
          </Link>
        ))}
        {clientCases.length === 0 && <p className="text-sm text-ink-400">У этого клиента пока нет дел.</p>}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Новое дело">
        <NewCaseForm
          clientId={client.id}
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

function NewCaseForm({ onCreate }: { clientId: string; onCreate: (title: string) => void }) {
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
      <Field label="Название дела" required>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Например: Аренда офиса на пр. Рудаки" required />
      </Field>
      <div className="flex justify-end">
        <Button type="submit">Создать дело</Button>
      </div>
    </form>
  )
}
