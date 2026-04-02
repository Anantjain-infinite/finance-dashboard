import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Pencil, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '../../utils/cn'
import { formatCurrency } from '../../utils/formatCurrency'
import { getCategoryColor } from '../../utils/categoryColors'
import { ROLES } from '../../constants/roles'
import useAppStore from '../../store/useAppStore'

export default function TransactionRow({ tx, onEdit, onDelete, index }) {
  const [hovered,  setHovered]  = useState(false)
  const [deleting, setDeleting] = useState(false)
  const role    = useAppStore((s) => s.role)
  const isAdmin  = role === ROLES.ADMIN
  const isIncome = tx.type === 'income'
  const colors   = getCategoryColor(tx.category)

  async function handleDelete() {
    setDeleting(true)
    await onDelete(tx.id)
    setDeleting(false)
  }

  return (
    <motion.tr
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16, transition: { duration: 0.18 } }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.025, 0.25) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'transition-colors duration-100',
        'hover:bg-zinc-50 dark:hover:bg-zinc-800/50',
        deleting && 'opacity-40 pointer-events-none'
      )}
    >
      {/* Date */}
      <td className="py-3 pl-5 pr-2 text-xs text-zinc-500 dark:text-zinc-500 whitespace-nowrap">
        {format(new Date(tx.date), 'd MMM yy')}
      </td>

      {/* Description + merchant */}
      <td className="py-3 px-3 min-w-0">
        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate max-w-[160px] sm:max-w-xs">
          {tx.description}
        </p>
        <p className="text-xs text-zinc-400 dark:text-zinc-600 truncate max-w-[140px] sm:max-w-xs">
          {tx.merchant}
        </p>
      </td>

      {/* Category — hidden on xs */}
      <td className="py-3 px-3 hidden sm:table-cell">
        <span className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap',
          colors.bg, colors.text
        )}>
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: colors.hex }} />
          {tx.category}
        </span>
      </td>

      {/* Type — hidden on xs and sm */}
      <td className="py-3 px-3 hidden md:table-cell">
        <span className={cn(
          'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize whitespace-nowrap',
          isIncome
            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
        )}>
          {tx.type}
        </span>
      </td>

      <td className="py-3 pl-2 pr-5 text-right">
        <AnimatePresence mode="wait" initial={false}>
          {isAdmin && hovered ? (
            <motion.div
              key="actions"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.13 }}
              className="flex items-center justify-end gap-0.5"
            >
              <button
                onClick={() => onEdit(tx)}
                title="Edit"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                <Pencil size={13} />
              </button>
              <button
                onClick={handleDelete}
                title="Delete"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <Trash2 size={13} />
              </button>
            </motion.div>
          ) : (
            <motion.span
              key="amount"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className={cn(
                'text-sm font-semibold tabular-nums whitespace-nowrap',
                isIncome
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-red-500 dark:text-red-400'
              )}
            >
              {isIncome ? '+' : '−'}{formatCurrency(tx.amount)}
            </motion.span>
          )}
        </AnimatePresence>
      </td>
    </motion.tr>
  )
}
