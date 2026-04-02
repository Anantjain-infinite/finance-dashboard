import { AnimatePresence } from 'framer-motion'
import TransactionRow from './TransactionRow'
import Skeleton from '../ui/Skeleton'
import EmptyState from '../ui/EmptyState'
import { cn } from '../../utils/cn'

const HEADERS = [
  { label: 'Date',     className: 'w-24 pl-5' },
  { label: 'Details',  className: '' },
  { label: 'Category', className: 'hidden sm:table-cell' },
  { label: 'Type',     className: 'hidden md:table-cell' },
  { label: 'Amount',   className: 'text-right pr-5' },
]

export function TransactionTableSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-100 dark:border-zinc-800">
            {HEADERS.map((h) => (
              <th key={h.label} className={cn('py-3 px-3 text-left', h.className)}>
                <Skeleton className="h-3 w-16" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 8 }).map((_, i) => (
            <tr key={i} className="border-b border-zinc-50 dark:border-zinc-800/60">
              <td className="py-3.5 pl-5 pr-3"><Skeleton className="h-3 w-20" /></td>
              <td className="py-3.5 px-3">
                <Skeleton className="h-3 w-40 mb-2" />
                <Skeleton className="h-2.5 w-24" />
              </td>
              <td className="py-3.5 px-3 hidden sm:table-cell">
                <Skeleton className="h-5 w-20 rounded-full" />
              </td>
              <td className="py-3.5 px-3 hidden md:table-cell">
                <Skeleton className="h-5 w-16 rounded-full" />
              </td>
              <td className="py-3.5 pl-3 pr-5 text-right">
                <Skeleton className="h-3 w-20 ml-auto" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function TransactionTable({ data, onEdit, onDelete }) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
      {data.length === 0 ? (
        <EmptyState
          type="search"
          title="No transactions match"
          description="Try adjusting your search or filters to find what you're looking for."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                {HEADERS.map((h) => (
                  <th
                    key={h.label}
                    className={cn(
                      'py-3 px-3 text-left text-xs font-semibold',
                      'text-zinc-400 dark:text-zinc-600 uppercase tracking-wider',
                      h.className
                    )}
                  >
                    {h.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {data.map((tx, i) => (
                  <TransactionRow
                    key={tx.id}
                    tx={tx}
                    index={i}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
