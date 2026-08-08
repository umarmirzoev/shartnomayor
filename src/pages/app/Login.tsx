import { useState } from 'react'
import { useNavigate, useSearchParams, Navigate } from 'react-router-dom'
import { ScrollText, Mail, Lock, User2, ArrowRight, ShieldCheck } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/Input'
import { useAuth } from '@/lib/store'

export default function Login() {
  const [params, setParams] = useSearchParams()
  const isRegister = params.get('mode') === 'register'
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('Фарход Расулов')
  const [email, setEmail] = useState('farhod.rasulov@shartnomayor.tj')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) return <Navigate to="/app/dashboard" replace />

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      login(email, name)
      navigate('/app/dashboard')
    }, 600)
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between bg-ink-950 p-12 text-white lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_20%_10%,rgba(212,169,76,0.14),transparent)]" />
        <Logo dark />
        <div className="relative max-w-md">
          <ScrollText size={36} className="mb-6 text-gold-400" />
          <p className="font-serif-display text-2xl leading-snug text-white">
            «ИИ не заменяет юриста и не подписывает документы — он собирает первый черновик и снимает рутину».
          </p>
          <p className="mt-4 text-sm text-ink-400">Ключевой принцип продукта ШартномаЁр</p>
        </div>
        <div className="relative flex items-center gap-2 text-xs text-ink-400">
          <ShieldCheck size={16} className="text-gold-400" /> Данные клиентов защищены шифрованием и ролевым доступом
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <h1 className="text-2xl font-bold text-ink-950">{isRegister ? 'Создать аккаунт' : 'Вход в кабинет'}</h1>
          <p className="mt-1.5 text-sm text-ink-500">
            {isRegister ? 'Демо-режим — данные сохраняются только в этом браузере.' : 'Рады видеть снова. Демо-вход — любой email и пароль.'}
          </p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            {isRegister && (
              <Field label="Полное имя">
                <div className="relative">
                  <User2 size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" />
                  <Input className="pl-10" value={name} onChange={(e) => setName(e.target.value)} placeholder="Фарход Расулов" required />
                </div>
              </Field>
            )}
            <Field label="Email">
              <div className="relative">
                <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" />
                <Input className="pl-10" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@firm.tj" required />
              </div>
            </Field>
            <Field label="Пароль">
              <div className="relative">
                <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" />
                <Input className="pl-10" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
              </div>
            </Field>

            <Button type="submit" className="mt-2 w-full" size="lg" disabled={loading} iconRight={<ArrowRight size={17} />}>
              {loading ? 'Входим…' : isRegister ? 'Зарегистрироваться' : 'Войти'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-500">
            {isRegister ? 'Уже есть аккаунт?' : 'Ещё нет аккаунта?'}{' '}
            <button
              className="font-semibold text-ink-900 underline decoration-gold-400 decoration-2 underline-offset-2"
              onClick={() => setParams(isRegister ? {} : { mode: 'register' })}
            >
              {isRegister ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
