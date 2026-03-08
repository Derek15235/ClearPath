import { NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { NAV_LINKS } from './TopNavigationBar'

interface MobileNavProps {
  open: boolean
  onClose: () => void
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.12 }}
          className="md:hidden bg-surface border-b border-border px-4 py-3 space-y-1 z-40"
          aria-label="Mobile navigation"
        >
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
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
        </motion.div>
      )}
    </AnimatePresence>
  )
}
