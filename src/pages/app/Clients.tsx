import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, Building2, User, ArrowUpRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Field, Input, Select, Textarea } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { useAppData } from '@/lib/store'
import type { Client } from '@/lib/types'

export default function Clients() {
  const { clients, cases, addClient } = useAppData()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const filtered = useMemo(
    () => clients.filter((c) => c.name.toLowerCase().includes(query.toLowerCase())),
    [clients, query]
  )

  return (
    <div className="max-w-6xl">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-ink-950">Клиенты</h1>
          <p className="mt-1 text-sm text-ink-500">{clients.length} клиентов в базе</p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => setOpen(true)}>Новый клиент</Button>
      </div>

      <div className="relative mb-5 max-w-sm">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" />
        <Input className="pl-10" placeholder="Поиск по имени…" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <Card className="overflow-hidden">
        <div className="hidden grid-cols-[1fr_120px_1fr_100px_40px] gap-4 border-b border-ink-100 bg-ink-50/60 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-ink-400 sm:grid">
          <span>Клиент</span>
          <span>Тип</span>
          <span>Контакты</span>
          <span>Дел</span>
          <span />
        </div>
        <div className="divide-y divide-ink-100">
          {filtered.map((c) => (
            <Link
              key={c.id}
              to={`/app/clients/${c.id}`}
              className="grid grid-cols-1 gap-2 px-5 py-4 transition hover:bg-ink-50 sm:grid-cols-[1fr_120px_1fr_100px_40px] sm:items-center sm:gap-4"
            >
              <span className="flex items-center gap-2.5 text-sm font-semibold text-ink-900">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink-100 text-ink-500">
                  {c.type === 'company' ? <Building2 size={15} /> : <User size={15} />}
                </span>
                {c.name}
              </span>
              <span>
                <Badge tone="neutral">{c.type === 'company' ? 'Юр. лицо' : 'Физ. лицо'}</Badge>
              </span>
              <span className="truncate text-sm text-ink-500">{c.contact}</span>
              <span className="text-sm text-ink-500">{cases.filter((k) => k.clientId === c.id).length}</span>
              <ArrowUpRight size={15} className="hidden text-ink-300 sm:block" />
            </Link>
          ))}
          {filtered.length === 0 && <p className="px-5 py-8 text-center text-sm text-ink-400">Ничего не найдено</p>}
        </div>
      </Card>

      <NewClientModal open={open} onClose={() => setOpen(false)} onCreate={addClient} />
    </div>
  )
}

function NewClientModal({ open, onClose, onCreate }: { open: boolean; onClose: () => void; onCreate: (c: Omit<Client, 'id' | 'createdAt'>) => Client }) {
  const [name, setName] = useState('')
  const [type, setType] = useState<'individual' | 'company'>('company')
  const [contact, setContact] = useState('')
  const [note, setNote] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onCreate({ name, type, contact, note })
    setName(''); setContact(''); setNote('')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Новый клиент">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Имя / название" required>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="ООО «Компания» или Иванов И.И." required />
        </Field>
        <Field label="Тип клиента">
          <Select value={type} onChange={(e) => setType(e.target.value as 'individual' | 'company')}>
            <option value="company">Юридическое лицо</option>
            <option value="individual">Физическое лицо</option>
          </Select>
        </Field>
        <Field label="Контакты">
          <Input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="+992 __ ___ ____ · email" />
        </Field>
        <Field label="Заметка" hint="Необязательно">
          <Textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Краткая информация о клиенте" />
        </Field>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Отмена</Button>
          <Button type="submit">Добавить клиента</Button>
        </div>
      </form>
    </Modal>
  )
}
