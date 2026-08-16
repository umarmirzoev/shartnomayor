import { useState } from 'react'
import { useNavigate, useSearchParams, Navigate } from 'react-router-dom'
import { Mail, Lock, User2, ArrowRight, ShieldCheck } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/Input'
import { WritingDocument } from '@/components/landing/WritingDocument'
import { useAuth, useAppData } from '@/lib/store'
import { useT } from '@/lib/i18n/context'
import { isBackendConfigured } from '@/lib/api'

export default function Login() {
  const t = useT()
  const [params, setParams] = useSearchParams()
  const isRegister = params.get('mode') === 'register'
  const { login, register, isAuthenticated } = useAuth()
  const { reloadAll } = useAppData()
  const navigate = useNavigate()

  const [name, setName] = useState('Фарход Расулов')
  const [email, setEmail] = useState('farhod.rasulov@shartnomayor.tj')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (isAuthenticated) return <Navigate to="/app/dashboard" replace />

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (isBackendConfigured()) {
        // Боевой режим: пароль реально проверяется бэкендом, ошибка показывается пользователю.
        if (isRegister) {
          await register({ email, password, fullName: name })
        } else {
          await login(email, password)
        }
        await reloadAll()
      } else {
        // Демо-режим: любой email/пароль, задержка — чтобы не выглядело мгновенно и «ненастоящим».
        await new Promise((resolve) => setTimeout(resolve, 600))
        await login(email, password, name)
      }
      navigate('/app/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось выполнить вход.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between bg-ink-950 p-12 text-white lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_20%_10%,rgba(212,169,76,0.14),transparent)]" />
        <Logo dark />
        <div className="relative max-w-md">
          <WritingDocument className="mb-8" />
          <p className="font-serif-display text-2xl leading-snug text-white">
            {t.app.login.quote}
          </p>
          <p className="mt-4 text-sm text-ink-400">{t.app.login.quoteAuthor}</p>
        </div>
        <div className="relative flex items-center gap-2 text-xs text-ink-400">
          <ShieldCheck size={16} className="text-gold-400" /> {t.app.login.dataProtected}
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <h1 className="text-2xl font-bold text-ink-950">{isRegister ? t.app.login.createAccount : t.app.login.signIn}</h1>
          <p className="mt-1.5 text-sm text-ink-500">
            {isRegister ? t.app.login.registerNote : t.app.login.loginNote}
          </p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            {isRegister && (
              <Field label={t.app.login.fullName}>
                <div className="relative">
                  <User2 size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" />
                  <Input className="pl-10" value={name} onChange={(e) => setName(e.target.value)} placeholder="Фарход Расулов" required />
                </div>
              </Field>
            )}
            <Field label={t.app.login.email}>
              <div className="relative">
                <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" />
                <Input className="pl-10" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@firm.tj" required />
              </div>
            </Field>
            <Field label={t.app.login.password}>
              <div className="relative">
                <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" />
                <Input className="pl-10" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
              </div>
            </Field>

            {error && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-600">{error}</p>
            )}

            <Button type="submit" className="mt-2 w-full" size="lg" disabled={loading} iconRight={<ArrowRight size={17} />}>
              {loading ? t.app.login.signingIn : isRegister ? t.common.register : t.common.login}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-500">
            {isRegister ? t.app.login.hasAccount : t.app.login.noAccount}{' '}
            <button
              className="font-semibold text-ink-900 underline decoration-gold-400 decoration-2 underline-offset-2"
              onClick={() => setParams(isRegister ? {} : { mode: 'register' })}
            >
              {isRegister ? t.common.login : t.common.register}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
