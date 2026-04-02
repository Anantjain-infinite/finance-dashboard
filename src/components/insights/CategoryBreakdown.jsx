import { motion } from 'framer-motion'
import { formatCurrency } from '../../utils/formatCurrency'
import { getCategoryColor } from '../../utils/categoryColors'
import Skeleton from '../ui/Skeleton'
import EmptyState from '../ui/EmptyState'

export function CategoryBreakdownSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-800">
      <Skeleton className="h-4 w-40 mb-1" />
      <Skeleton className="h-3 w-48 mb-5" />
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <div className="flex justify-between mb-1.5">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

function CategoryBar({ item, maxTotal, index }) {
  const colors = getCategoryColor(item.category)
  const pct = maxTotal > 0 ? (item.total / maxTotal) * 100 : 0

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.28, delay: index * 0.05 }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ background: colors.hex }}
          />
          <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            {item.category}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 tabular-nums">
            {formatCurrency(item.total)}
          </span>
          <span className="text-xs text-zinc-400 dark:text-zinc-600 w-8 text-right tabular-nums">
            {Math.round(pct)}%
          </span>
        </div>
      </div>

      {/* Track */}
      <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: colors.hex }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, delay: index * 0.05 + 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </div>
    </motion.div>
  )
}

export default function CategoryBreakdown({ data }) {
  const isEmpty = !data || data.length === 0
  const maxTotal = data?.reduce((sum, tx) => sum + tx.total, 0) || 0   

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.25 }}
      className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-800"
    >
      <div className="mb-5">
        <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          Spending by Category
        </h2>
        <p className="text-xs text-zinc-400 dark:text-zinc-600">
          Cumulative expenses · last 6 months
        </p>
      </div>

      {isEmpty ? (
        <EmptyState
          type="insights"
          title="No category data"
          description="Category breakdown will appear once you have expense transactions."
        />
      ) : (
        <div className="space-y-4">
          {data.map((item, i) => (
            <CategoryBar
              key={item.category}
              item={item}
              maxTotal={maxTotal}
              index={i}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}
