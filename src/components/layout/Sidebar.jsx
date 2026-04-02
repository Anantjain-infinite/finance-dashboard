// src/components/layout/Sidebar.jsx
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, ArrowLeftRight, Lightbulb,
  ChevronLeft, ChevronRight, Sun, Moon, Shield, Eye, X,
} from 'lucide-react'
import { cn } from '../../utils/cn'
import useAppStore from '../../store/useAppStore'
import { ROLES } from '../../constants/roles'

const NAV_ITEMS = [
  { to: '/dashboard',     icon: LayoutDashboard, label: 'Overview' },
  { to: '/transactions',  icon: ArrowLeftRight,  label: 'Transactions' },
  { to: '/insights',      icon: Lightbulb,       label: 'Insights' },
]

function NavItem({ item, collapsed }) {
  const { to, icon: Icon, label } = item
  const setMobileOpen = useAppStore((s) => s.setSidebarMobileOpen)

  return (
    <NavLink
      to={to}
      onClick={() => setMobileOpen(false)}
      className={({ isActive }) =>
        cn(
          'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
          'hover:bg-zinc-100 dark:hover:bg-zinc-800',
          isActive
            ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm'
            : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
        )
      }
    >
      <Icon size={18} className="flex-shrink-0" />
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden whitespace-nowrap"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Tooltip when collapsed */}
      {collapsed && (
        <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
          {label}
        </div>
      )}
    </NavLink>
  )
}

function RoleToggle({ collapsed }) {
  const role = useAppStore((s) => s.role)
  const setRole = useAppStore((s) => s.setRole)

  return (
    <div className={cn('space-y-1.5', collapsed && 'flex flex-col items-center')}>
      {!collapsed && (
        <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest px-1 mb-2">
          Role
        </p>
      )}
      {[
        { r: ROLES.ADMIN,  Icon: Shield, label: 'Admin'  },
        { r: ROLES.VIEWER, Icon: Eye,    label: 'Viewer' },
      ].map(({ r, Icon, label }) => {
        const active = role === r
        return (
          <button
            key={r}
            onClick={() => setRole(r)}
            title={collapsed ? label : undefined}
            className={cn(
              'group relative flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150',
              active
                ? r === ROLES.ADMIN
                  ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300'
                  : 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                : 'text-zinc-400 dark:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-300',
              collapsed && 'justify-center px-2'
            )}
          >
            <Icon size={14} className="flex-shrink-0" />
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.18 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Tooltip */}
            {collapsed && (
              <div className="absolute left-full ml-3 px-2 py-1 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {label}
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}

function ThemeToggle({ collapsed }) {
  const theme = useAppStore((s) => s.theme)
  const toggleTheme = useAppStore((s) => s.toggleTheme)
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'group relative flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
        'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100',
        collapsed && 'justify-center px-2'
      )}
    >
      <motion.div
        key={isDark ? 'moon' : 'sun'}
        initial={{ rotate: -30, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </motion.div>
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden whitespace-nowrap"
          >
            {isDark ? 'Light mode' : 'Dark mode'}
          </motion.span>
        )}
      </AnimatePresence>

      {collapsed && (
        <div className="absolute left-full ml-3 px-2 py-1 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
          {isDark ? 'Light mode' : 'Dark mode'}
        </div>
      )}
    </button>
  )
}

// ─── Sidebar inner content (shared between desktop + mobile) ─────────────────
function SidebarContent({ collapsed, onClose }) {
  const toggleSidebar = useAppStore((s) => s.toggleSidebar)

  return (
    <div className="flex flex-col h-full py-4">
      {/* Logo + collapse button */}
      <div className={cn(
        'flex items-center px-3 mb-6',
        collapsed ? 'justify-center' : 'justify-between'
      )}>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2"
            >
              <div className="w-7 h-7 rounded-lg bg-zinc-900 dark:bg-white flex items-center justify-center">
                <span className="text-white dark:text-zinc-900 text-xs font-bold">F</span>
              </div>
              <span className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight">
                FinanceOS
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile close / Desktop collapse */}
        {onClose ? (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X size={16} />
          </button>
        ) : (
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-2 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.to} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Bottom controls */}
      <div className={cn('px-2 pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-4')}>
        <RoleToggle collapsed={collapsed} />
        <ThemeToggle collapsed={collapsed} />
      </div>
    </div>
  )
}

// ─── Desktop sidebar ──────────────────────────────────────────────────────────
export function DesktopSidebar() {
  const collapsed = useAppStore((s) => s.sidebarCollapsed)

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="hidden md:flex flex-col flex-shrink-0 border-r border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden"
    >
      <SidebarContent collapsed={collapsed} />
    </motion.aside>
  )
}

// ─── Mobile sidebar drawer ────────────────────────────────────────────────────
export function MobileSidebar() {
  const open = useAppStore((s) => s.sidebarMobileOpen)
  const setOpen = useAppStore((s) => s.setSidebarMobileOpen)

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setOpen(false)}
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-zinc-950 border-r border-zinc-100 dark:border-zinc-800 z-50 md:hidden"
          >
            <SidebarContent collapsed={false} onClose={() => setOpen(false)} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}