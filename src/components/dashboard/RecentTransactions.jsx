import { motion } from 'framer-motion'
import { ArrowDownLeft, ArrowUpRight, MoveRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { cn } from '../../utils/cn'
import { formatCurrency } from '../../utils/formatCurrency'
import { getCategoryColor } from '../../utils/categoryColors'
import Skeleton from '../ui/Skeleton'
import EmptyState from '../ui/EmptyState'

export function RecentTransactionsSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-800">
      <div className="flex items-center justify-between mb-5">
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="space-y-1">
        {[0,1,2,3,4,5,6].map((i) => (
          <div key={i} className="flex items-center gap-3 py-2">
            <Skeleton className="w-9 h-9 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className={`h-3 ${i % 2 === 0 ? 'w-3/4' : 'w-1/2'}`} />
              <Skeleton className="h-2.5 w-2/5" />
            </div>
            <Skeleton className="h-3 w-20 flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  )
}

function TxRow({ tx, index }) {
  const colors   = getCategoryColor(tx.category)
  const isIncome = tx.type === 'income'

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: index * 0.035 }}
      className="flex items-center gap-3 py-2.5 border-b border-zinc-50 dark:border-zinc-800/70 last:border-0"
    >
      <div className={cn(
        'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0',
        colors.bg
      )}>
        {isIncome
          ? <ArrowDownLeft size={15} className={colors.text} />
          : <ArrowUpRight  size={15} className={colors.text} />
        }
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">
          {tx.description}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-zinc-400 dark:text-zinc-600">
            {format(new Date(tx.date), 'd MMM')}
          </span>
          <span className={cn('text-xs font-medium', colors.text)}>
            {tx.category}
          </span>
        </div>
      </div>

      <p className={cn(
        'text-sm font-semibold tabular-nums flex-shrink-0',
        isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'
      )}>
        {isIncome ? '+' : '−'}{formatCurrency(tx.amount)}
      </p>
    </motion.div>
  )
}

export default function RecentTransactions({ data }) {
  const recent = data?.slice(0, 7) ?? []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.25 }}
      className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-800"
    >
      <div className="flex items-center justify-between mb-1">
        <div>
          <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Recent Transactions</h2>
          <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5">Latest activity</p>
        </div>
        <Link
          to="/transactions"
          className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors whitespace-nowrap"
        >
          View all <MoveRight size={12} />
        </Link>
      </div>

      {recent.length === 0 ? (
        <EmptyState
          type="transactions"
          title="No transactions"
          description="Your recent activity will appear here."
        />
      ) : (
        <div className="mt-3">
          {recent.map((tx, i) => <TxRow key={tx.id} tx={tx} index={i} />)}
        </div>
      )}
    </motion.div>
  )
}
