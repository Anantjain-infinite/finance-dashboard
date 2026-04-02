import { useLocation } from 'react-router-dom'
import { Menu, Shield, Eye } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import useAppStore from '../../store/useAppStore'
import { ROLES } from '../../constants/roles'

const PAGE_META = {
  '/dashboard':    { title: 'Overview',     subtitle: 'Your financial summary at a glance' },
  '/transactions': { title: 'Transactions', subtitle: 'Browse, search and manage your transactions' },
  '/insights':     { title: 'Insights',     subtitle: 'Spending patterns and monthly analysis' },
}

export default function Topbar() {
  const { pathname } = useLocation()
  const setMobileOpen = useAppStore((s) => s.setSidebarMobileOpen)
  const role = useAppStore((s) => s.role)

  const meta = PAGE_META[pathname] || PAGE_META['/dashboard']
  const isAdmin = role === ROLES.ADMIN

  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 px-4 sm:px-6 h-14 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-sm border-b border-zinc-100 dark:border-zinc-800">
      {/* Mobile hamburger */}
      <button
        className="md:hidden p-2 -ml-1 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={18} />
      </button>

      {/* Page title */}
      <div className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
          >
            <h1 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
              {meta.title}
            </h1>
            <p className="text-xs text-zinc-400 dark:text-zinc-600 hidden sm:block truncate">
              {meta.subtitle}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Role indicator badge */}
      <motion.div
        layout
        className={`
          flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
          ${isAdmin
            ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300'
            : 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
          }
        `}
      >
        {isAdmin ? <Shield size={12} /> : <Eye size={12} />}
        <span className="hidden sm:inline">{isAdmin ? 'Admin' : 'Viewer'}</span>
      </motion.div>
    </header>
  )
}
