import { useState } from 'react'
import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, Briefcase, FileText, LibraryBig, Bell, Settings,
  LogOut, Menu, X, ChevronDown, Sparkles,
} from 'lucide-react'
import clsx from 'clsx'
import { Logo } from '@/components/Logo'
import { useAuth, useAppData } from '@/lib/store'
import { Badge } from '@/components/ui/Badge'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { AiAssistantWidget } from '@/components/ui/AiAssistantWidget'
import { useT } from '@/lib/i18n/context'

export default function AppLayout() {
  const t = useT()
  const { isAuthenticated, user, logout } = useAuth()
  const { alerts } = useAppData()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const unread = alerts.filter((a) => !a.read).length

  const nav = [
    { to: '/app/dashboard', label: t.app.layout.dashboard, icon: LayoutDashboard },
    { to: '/app/clients', label: t.app.layout.clients, icon: Users },
    { to: '/app/cases', label: t.app.layout.cases, icon: Briefcase },
    { to: '/app/drafts/new', label: t.app.layout.newDraft, icon: Sparkles, highlight: true },
    { to: '/app/templates', label: t.app.layout.templates, icon: LibraryBig },
    { to: '/app/alerts', label: t.app.layout.alerts, icon: Bell, badge: true },
    { to: '/app/settings', label: t.app.layout.settings, icon: Settings },
  ]

  if (!isAuthenticated) return <Navigate to="/app/login" replace />

  return (
    <div className="flex min-h-screen bg-ink-50 dark:bg-ink-950">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-ink-950/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-ink-100 bg-white transition-transform dark:border-white/10 dark:bg-ink-900 lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <Logo to="/app/dashboard" />
          <button className="p-1 text-ink-400 lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3.5">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                clsx(
                  'flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition',
                  item.highlight
                    ? 'mb-2 bg-ink-900 text-white hover:bg-ink-800 dark:bg-white dark:text-ink-950 dark:hover:bg-ink-100'
                    : isActive
                    ? 'bg-gold-100 text-ink-900 dark:bg-white/10 dark:text-white'
                    : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900 dark:text-ink-300 dark:hover:bg-white/5 dark:hover:text-white'
                )
              }
            >
              <span className="flex items-center gap-2.5">
                <item.icon size={17} strokeWidth={2.25} />
                {item.label}
              </span>
              {item.badge && unread > 0 && (
                <Badge tone="red">{unread}</Badge>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-ink-100 p-4 dark:border-white/10">
          <div className="flex items-center gap-3 rounded-xl bg-ink-50 px-3 py-2.5 dark:bg-white/[0.04]">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-900 text-sm font-bold text-gold-400">
              {(user?.name || 'Ф').slice(0, 1)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink-900 dark:text-white">{user?.name}</p>
              <p className="truncate text-xs text-ink-400">{user?.email}</p>
            </div>
            <button
              onClick={() => { logout(); navigate('/') }}
              className="p-1.5 text-ink-400 transition hover:text-red-500"
              title={t.app.layout.logout}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-ink-100 bg-white/80 px-5 py-3.5 backdrop-blur dark:border-white/10 dark:bg-ink-900/80 lg:px-8">
          <button className="p-1.5 text-ink-500 lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
            <Badge tone="gold">{t.common.freePlan}</Badge>
            <div className="hidden items-center gap-1.5 rounded-full border border-ink-100 py-1 pl-1 pr-3 text-sm text-ink-600 dark:border-white/10 dark:text-ink-300 sm:flex">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-ink-900 text-[11px] font-bold text-gold-400">
                {(user?.name || 'Ф').slice(0, 1)}
              </div>
              {user?.name?.split(' ')[0]}
              <ChevronDown size={14} />
            </div>
          </div>
        </header>
        <main className="flex-1 px-5 py-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
      <AiAssistantWidget />
    </div>
  )
}
