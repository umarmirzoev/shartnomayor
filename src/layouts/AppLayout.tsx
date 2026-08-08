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

const nav = [
  { to: '/app/dashboard', label: 'Дашборд', icon: LayoutDashboard },
  { to: '/app/clients', label: 'Клиенты', icon: Users },
  { to: '/app/cases', label: 'Дела', icon: Briefcase },
  { to: '/app/drafts/new', label: 'Новый черновик', icon: Sparkles, highlight: true },
  { to: '/app/templates', label: 'Шаблоны', icon: LibraryBig },
  { to: '/app/alerts', label: 'Изменения в законе', icon: Bell, badge: true },
  { to: '/app/settings', label: 'Настройки', icon: Settings },
]

export default function AppLayout() {
  const { isAuthenticated, user, logout } = useAuth()
  const { alerts } = useAppData()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const unread = alerts.filter((a) => !a.read).length

  if (!isAuthenticated) return <Navigate to="/app/login" replace />

  return (
    <div className="flex min-h-screen bg-ink-50">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-ink-950/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-ink-100 bg-white transition-transform lg:static lg:translate-x-0',
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
                    ? 'mb-2 bg-ink-900 text-white hover:bg-ink-800'
                    : isActive
                    ? 'bg-gold-100 text-ink-900'
                    : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'
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

        <div className="border-t border-ink-100 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-ink-50 px-3 py-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-900 text-sm font-bold text-gold-400">
              {(user?.name || 'Ф').slice(0, 1)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink-900">{user?.name}</p>
              <p className="truncate text-xs text-ink-400">{user?.email}</p>
            </div>
            <button
              onClick={() => { logout(); navigate('/') }}
              className="p-1.5 text-ink-400 transition hover:text-red-500"
              title="Выйти"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-ink-100 bg-white/80 px-5 py-3.5 backdrop-blur lg:px-8">
          <button className="p-1.5 text-ink-500 lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <Badge tone="gold">Тариф: Бесплатный</Badge>
            <div className="hidden items-center gap-1.5 rounded-full border border-ink-100 py-1 pl-1 pr-3 text-sm text-ink-600 sm:flex">
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
    </div>
  )
}
