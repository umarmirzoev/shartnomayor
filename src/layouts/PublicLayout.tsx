import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { ButtonLink } from '@/components/ui/Button'
import clsx from 'clsx'

const navItems = [
  { label: 'Возможности', href: '/#features' },
  { label: 'Как это работает', href: '/#how' },
  { label: 'Шаблоны', href: '/#templates' },
  { label: 'Тарифы', href: '/#pricing' },
  { label: 'Вопросы', href: '/#faq' },
]

export default function PublicLayout() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [location])

  return (
    <div className="min-h-screen bg-paper">
      <header
        className={clsx(
          'sticky top-0 z-50 border-b transition-all duration-300',
          scrolled ? 'border-ink-100 bg-white/85 backdrop-blur-md shadow-sm' : 'border-transparent bg-transparent'
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Logo />
          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-ink-600 transition hover:bg-ink-50 hover:text-ink-900"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="hidden items-center gap-2 lg:flex">
            <ButtonLink to="/app/login" variant="ghost" size="sm">Войти</ButtonLink>
            <ButtonLink to="/app/login?mode=register" variant="primary" size="sm" iconRight={<ArrowUpRight size={15} />}>
              Начать бесплатно
            </ButtonLink>
          </div>
          <button className="p-2 text-ink-700 lg:hidden" onClick={() => setOpen((v) => !v)} aria-label="Меню">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {open && (
          <div className="border-t border-ink-100 bg-white px-5 py-4 lg:hidden">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <a key={item.href} href={item.href} className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50">
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="mt-3 flex flex-col gap-2 border-t border-ink-100 pt-3">
              <ButtonLink to="/app/login" variant="outline" size="sm">Войти</ButtonLink>
              <ButtonLink to="/app/login?mode=register" variant="primary" size="sm">Начать бесплатно</ButtonLink>
            </div>
          </div>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

function Footer() {
  return (
    <footer className="border-t border-ink-100 bg-ink-950 text-ink-300">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <Logo dark />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-400">
              ИИ-ассистент для юристов Таджикистана: черновики договоров из проверенной библиотеки шаблонов, ведение дел и мониторинг изменений законодательства.
            </p>
          </div>
          <FooterCol title="Продукт" links={[
            { label: 'Возможности', href: '/#features' },
            { label: 'Как это работает', href: '/#how' },
            { label: 'Библиотека шаблонов', href: '/#templates' },
            { label: 'Тарифы', href: '/#pricing' },
          ]} />
          <FooterCol title="Кабинет" links={[
            { label: 'Войти', href: '/app/login' },
            { label: 'Регистрация', href: '/app/login?mode=register' },
            { label: 'Демо-дашборд', href: '/app/dashboard' },
          ]} />
          <FooterCol title="Правовая информация" links={[
            { label: 'ИИ не заменяет юриста', href: '/#ai' },
            { label: 'Защита данных', href: '/#security' },
            { label: 'Контакты', href: 'mailto:hello@shartnomayor.tj' },
          ]} />
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-xs text-ink-500 md:flex-row md:items-center">
          <p>© 2026 ШартномаЁр. Душанбе, Республика Таджикистан.</p>
          <p>MVP-прототип для хакатона · не является юридической консультацией</p>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-500">{title}</h4>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.href} className="text-sm text-ink-400 transition hover:text-gold-400">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
