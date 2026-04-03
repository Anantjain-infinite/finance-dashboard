// src/components/transactions/TransactionTable.jsx
import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
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

const PAGE_SIZE = 10

// ── Skeleton ──────────────────────────────────────────────────────────────────
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
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
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

// ── Pagination controls ───────────────────────────────────────────────────────
function Pagination({ page, totalPages, from, to, total, onChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  // Show at most 5 page numbers: always first, last, current ± 1
  function getVisible() {
    if (totalPages <= 5) return pages
    const set = new Set([1, totalPages, page, page - 1, page + 1].filter((p) => p >= 1 && p <= totalPages))
    return [...set].sort((a, b) => a - b)
  }

  const visible = getVisible()

  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-100 dark:border-zinc-800">
      {/* Count */}
      <p className="text-xs text-zinc-400 dark:text-zinc-600 hidden sm:block">
        Showing <span className="font-medium text-zinc-600 dark:text-zinc-400">{from}–{to}</span> of{' '}
        <span className="font-medium text-zinc-600 dark:text-zinc-400">{total}</span>
      </p>
      <p className="text-xs text-zinc-400 dark:text-zinc-600 sm:hidden">
        {from}–{to} / {total}
      </p>

      {/* Page buttons */}
      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className={cn(
            'p-1.5 rounded-lg transition-colors',
            page === 1
              ? 'text-zinc-300 dark:text-zinc-700 cursor-not-allowed'
              : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          )}
        >
          <ChevronLeft size={15} />
        </button>

        {/* Page numbers */}
        {visible.map((p, i) => {
          const prev = visible[i - 1]
          const showEllipsis = prev && p - prev > 1
          return (
            <span key={p} className="flex items-center gap-1">
              {showEllipsis && (
                <span className="px-1 text-xs text-zinc-300 dark:text-zinc-700">…</span>
              )}
              <button
                onClick={() => onChange(p)}
                className={cn(
                  'min-w-[28px] h-7 px-2 rounded-lg text-xs font-medium transition-all duration-150',
                  p === page
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                    : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                )}
              >
                {p}
              </button>
            </span>
          )
        })}

        {/* Next */}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className={cn(
            'p-1.5 rounded-lg transition-colors',
            page === totalPages
              ? 'text-zinc-300 dark:text-zinc-700 cursor-not-allowed'
              : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          )}
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  )
}

// ── Main table ────────────────────────────────────────────────────────────────
export default function TransactionTable({ data, onEdit, onDelete }) {
  const [page, setPage] = useState(1)

  // Reset to page 1 whenever the data set changes (filter applied)
  useEffect(() => { setPage(1) }, [data])

  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE))
  const safePage   = Math.min(page, totalPages)
  const from       = data.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1
  const to         = Math.min(safePage * PAGE_SIZE, data.length)
  const pageData   = data.slice(from - 1, to)

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
      {data.length === 0 ? (
        <EmptyState
          type="search"
          title="No transactions match"
          description="Try adjusting your search or filters to find what you're looking for."
        />
      ) : (
        <>
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
                  {pageData.map((tx, i) => (
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

          {totalPages > 1 && (
            <Pagination
              page={safePage}
              totalPages={totalPages}
              from={from}
              to={to}
              total={data.length}
              onChange={setPage}
            />
          )}
        </>
      )}
    </div>
  )
}