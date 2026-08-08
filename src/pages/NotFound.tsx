import { FileQuestion } from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center">
      <FileQuestion size={48} className="mb-5 text-ink-300" />
      <h1 className="text-2xl font-bold text-ink-900">Страница не найдена</h1>
      <p className="mt-2 max-w-sm text-ink-500">Такого документа в системе нет. Возможно, ссылка устарела.</p>
      <ButtonLink to="/" className="mt-6">На главную</ButtonLink>
    </div>
  )
}
