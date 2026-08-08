import { FileQuestion } from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import { useT } from '@/lib/i18n/context'

export default function NotFound() {
  const t = useT()
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center dark:bg-ink-950">
      <FileQuestion size={48} className="mb-5 text-ink-300" />
      <h1 className="text-2xl font-bold text-ink-900 dark:text-white">{t.notFound.title}</h1>
      <p className="mt-2 max-w-sm text-ink-500 dark:text-ink-400">{t.notFound.desc}</p>
      <ButtonLink to="/" className="mt-6">{t.notFound.cta}</ButtonLink>
    </div>
  )
}
