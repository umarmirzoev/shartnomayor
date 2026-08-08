import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { ButtonLink } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { AiAssistantWidget } from '@/components/ui/AiAssistantWidget'
import { useT, useLanguage } from '@/lib/i18n/context'
import { chromeLabels } from '@/lib/i18n'
import clsx from 'clsx'

export default function PublicLayout() {
  const t = useT()
  const { lang } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { label: t.nav.features, to: '/features' },
    { label: t.nav.howItWorks, to: '/how-it-works' },
    { label: t.nav.templates, to: '/templates' },
    { label: t.nav.pricing, to: '/pricing' },
    { label: t.nav.faq, to: '/faq' },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
    window.scrollTo({ top: 0 })
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-paper transition-colors duration-300 dark:bg-ink-950">
      <header
        className={clsx(
          'sticky top-0 z-50 border-b transition-all duration-300',
          scrolled
            ? 'border-ink-100 bg-white/85 backdrop-blur-md shadow-sm dark:border-white/10 dark:bg-ink-950/85'
            : 'border-transparent bg-transparent'
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Logo />
          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  clsx(
                    'group relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors duration-200',
                    isActive
                      ? 'text-ink-900 dark:text-white'
                      : 'text-ink-600 hover:text-ink-900 dark:text-ink-300 dark:hover:text-white'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    <span
                      className={clsx(
                        'pointer-events-none absolute inset-x-3 -bottom-0.5 h-[2px] scale-x-0 rounded-full bg-gold-500 transition-transform duration-300 ease-out group-hover:scale-x-100',
                        isActive && 'scale-x-100'
                      )}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>
          <div className="hidden items-center gap-2 lg:flex">
            <LanguageSwitcher />
            <ThemeToggle />
            <ButtonLink to="/app/login" variant="ghost" size="sm">{t.common.login}</ButtonLink>
            <ButtonLink to="/app/login?mode=register" variant="primary" size="sm" iconRight={<ArrowUpRight size={15} />}>
              {t.common.startFree}
            </ButtonLink>
          </div>
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              className="rounded-lg p-2 text-ink-700 transition hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-white/10"
              onClick={() => setOpen((v) => !v)}
              aria-label={chromeLabels[lang].menu}
            >
              <span className="relative block h-[22px] w-[22px]">
                <Menu size={22} className={clsx('absolute inset-0 transition-all duration-200', open ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100')} />
                <X size={22} className={clsx('absolute inset-0 transition-all duration-200', open ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0')} />
              </span>
            </button>
          </div>
        </div>
        <div
          className={clsx(
            'overflow-hidden border-t border-ink-100 bg-white transition-all duration-300 dark:border-white/10 dark:bg-ink-950 lg:hidden',
            open ? 'max-h-[420px] opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <div className="px-5 py-4">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    clsx(
                      'rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-ink-50 text-ink-900 dark:bg-white/10 dark:text-white'
                        : 'text-ink-700 hover:bg-ink-50 dark:text-ink-300 dark:hover:bg-white/5'
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="mt-3 flex flex-col gap-2 border-t border-ink-100 pt-3 dark:border-white/10">
              <ButtonLink to="/app/login" variant="outline" size="sm">{t.common.login}</ButtonLink>
              <ButtonLink to="/app/login?mode=register" variant="primary" size="sm">{t.common.startFree}</ButtonLink>
            </div>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <Footer />
      <AiAssistantWidget />
    </div>
  )
}

function Footer() {
  const t = useT()
  return (
    <footer className="border-t border-ink-100 bg-ink-950 text-ink-300 dark:border-white/10">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <Logo dark />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-400">
              {t.footer.tagline}
            </p>
          </div>
          <FooterCol title={t.footer.colProduct} links={[
            { label: t.nav.features, href: '/features' },
            { label: t.nav.howItWorks, href: '/how-it-works' },
            { label: t.footer.templateLibrary, href: '/templates' },
            { label: t.nav.pricing, href: '/pricing' },
          ]} />
          <FooterCol title={t.footer.colCabinet} links={[
            { label: t.common.login, href: '/app/login' },
            { label: t.common.register, href: '/app/login?mode=register' },
            { label: t.footer.demoDashboard, href: '/app/dashboard' },
          ]} />
          <FooterCol title={t.footer.colLegal} links={[
            { label: t.footer.faqLink, href: '/faq' },
            { label: t.footer.dataProtection, href: '/#security' },
            { label: t.footer.contacts, href: 'mailto:hello@shartnomayor.tj' },
          ]} />
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-xs text-ink-500 md:flex-row md:items-center">
          <p>{t.footer.copyright}</p>
          <p>{t.footer.disclaimer}</p>
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
        {links.map((l) =>
          l.href.startsWith('mailto:') ? (
            <li key={l.label}>
              <a href={l.href} className="text-sm text-ink-400 transition-colors duration-200 hover:text-gold-400">
                {l.label}
              </a>
            </li>
          ) : (
            <li key={l.label}>
              <Link to={l.href} className="text-sm text-ink-400 transition-colors duration-200 hover:text-gold-400">
                {l.label}
              </Link>
            </li>
          )
        )}
      </ul>
    </div>
  )
}
