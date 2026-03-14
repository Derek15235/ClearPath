import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Calendar, FolderLock, ShieldAlert, Settings, Menu, X } from 'lucide-react'
import { BrandLogo } from './BrandLogo'
import { UserProfileMenu } from './UserProfileMenu'
import { MobileNav } from './MobileNav'

export const NAV_LINKS = [
  { to: '/dashboard',   label: 'Dashboard',   icon: LayoutDashboard },
  { to: '/calendar',    label: 'Calendar',    icon: Calendar },
  { to: '/vault',       label: 'Vault',       icon: FolderLock },
  { to: '/risk-center', label: 'Risk Center', icon: ShieldAlert },
  { to: '/settings',   label: 'Settings',    icon: Settings },
] as const

export function TopNavigationBar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">

            <BrandLogo />

            <nav className="hidden md:flex items-center gap-1 ml-8" aria-label="Main navigation">
              {NAV_LINKS.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    [
                      'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary-600/10 text-primary-400'
                        : 'text-content-secondary hover:text-content hover:bg-surface-raised',
                    ].join(' ')
                  }
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  {label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <UserProfileMenu />
              <button
                className="md:hidden p-2 rounded-lg text-content-secondary
                  hover:text-content hover:bg-surface-raised transition-colors"
                onClick={() => setMobileOpen(v => !v)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
