// src/components/transactions/TransactionFilters.jsx
import { useState, useRef, useEffect, useDeferredValue } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, X, ChevronDown, SlidersHorizontal,
  ArrowUpDown, ArrowUp, ArrowDown, Filter,
} from 'lucide-react'
import { cn } from '../../utils/cn'
import useAppStore from '../../store/useAppStore'
import { CATEGORY_COLORS } from '../../utils/categoryColors'

const DATE_RANGES = [
  { value: 'thisMonth', label: 'This month' },
  { value: 'last3',     label: 'Last 3 months' },
  { value: 'last6',     label: 'Last 6 months' },
  { value: 'thisYear',  label: 'This year' },
]

const TYPES = [
  { value: 'all',     label: 'All' },
  { value: 'income',  label: 'Income' },
  { value: 'expense', label: 'Expense' },
]

const SORT_OPTIONS = [
  { value: 'date',   label: 'Date' },
  { value: 'amount', label: 'Amount' },
]

const ALL_CATEGORIES = Object.keys(CATEGORY_COLORS)

// ── Dropdown wrapper ──────────────────────────────────────────────────────────
function Dropdown({ trigger, children, align = 'left' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen((o) => !o)}>{trigger(open)}</div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.14 }}
            className={cn(
              'absolute top-full mt-1.5 z-50 bg-white dark:bg-zinc-900',
              'border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-lg',
              'min-w-[180px] py-1.5',
              align === 'right' ? 'right-0' : 'left-0'
            )}
          >
            {children({ close: () => setOpen(false) })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Pill button ───────────────────────────────────────────────────────────────
function PillBtn({ active, children, className }) {
  return (
    <button
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium',
        'border transition-all duration-150 whitespace-nowrap',
        active
          ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white'
          : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600',
        className
      )}
    >
      {children}
    </button>
  )
}

// ── The actual filter controls (shared between desktop inline & mobile panel) ─
function FilterControls({ filters, setFilter, resetFilters, setLocalSearch, localSearch, hasActiveFilters }) {
  function toggleCategory(cat) {
    const next = filters.category.includes(cat)
      ? filters.category.filter((c) => c !== cat)
      : [...filters.category, cat]
    setFilter('category', next)
  }

  function toggleSort(field) {
    if (filters.sortBy === field) {
      setFilter('sortDir', filters.sortDir === 'desc' ? 'asc' : 'desc')
    } else {
      setFilter('sortBy', field)
      setFilter('sortDir', 'desc')
    }
  }

  function SortIcon({ field }) {
    if (filters.sortBy !== field) return <ArrowUpDown size={12} className="opacity-40" />
    return filters.sortDir === 'desc' ? <ArrowDown size={12} /> : <ArrowUp size={12} />
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Date range */}
      <Dropdown
        trigger={(open) => (
          <PillBtn active={filters.dateRange !== 'last6'}>
            {DATE_RANGES.find((d) => d.value === filters.dateRange)?.label || 'Date range'}
            <ChevronDown size={12} className={cn('transition-transform', open && 'rotate-180')} />
          </PillBtn>
        )}
      >
        {({ close }) => DATE_RANGES.map((d) => (
          <button
            key={d.value}
            onClick={() => { setFilter('dateRange', d.value); close() }}
            className={cn(
              'w-full text-left px-3.5 py-2 text-xs transition-colors',
              'hover:bg-zinc-50 dark:hover:bg-zinc-800',
              filters.dateRange === d.value
                ? 'text-zinc-900 dark:text-zinc-100 font-semibold'
                : 'text-zinc-600 dark:text-zinc-400'
            )}
          >
            {d.label}
          </button>
        ))}
      </Dropdown>

      {/* Category multi-select */}
      <Dropdown
        trigger={(open) => (
          <PillBtn active={filters.category.length > 0}>
            <SlidersHorizontal size={12} />
            {filters.category.length > 0
              ? `${filters.category.length} categories`
              : 'Category'}
            <ChevronDown size={12} className={cn('transition-transform', open && 'rotate-180')} />
          </PillBtn>
        )}
      >
        {() => (
          <div className="max-h-60 overflow-y-auto">
            {ALL_CATEGORIES.map((cat) => {
              const colors = CATEGORY_COLORS[cat]
              const checked = filters.category.includes(cat)
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-3.5 py-2 text-xs transition-colors',
                    'hover:bg-zinc-50 dark:hover:bg-zinc-800',
                    checked ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400'
                  )}
                >
                  <span
                    className={cn(
                      'w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 transition-colors',
                      checked ? 'border-transparent' : 'border-zinc-300 dark:border-zinc-600'
                    )}
                    style={checked ? { background: colors.hex } : {}}
                  >
                    {checked && (
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M1 4l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </span>
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: colors.hex }} />
                  {cat}
                </button>
              )
            })}
          </div>
        )}
      </Dropdown>

      {/* Type toggle */}
      <div className="flex items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg p-0.5 gap-0.5">
        {TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => setFilter('type', t.value)}
            className={cn(
              'px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-150',
              filters.type === t.value
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Sort */}
      <Dropdown
        align="right"
        trigger={(open) => (
          <PillBtn active={false}>
            <ArrowUpDown size={12} />
            Sort
            <ChevronDown size={12} className={cn('transition-transform', open && 'rotate-180')} />
          </PillBtn>
        )}
      >
        {({ close }) => SORT_OPTIONS.map((s) => (
          <button
            key={s.value}
            onClick={() => { toggleSort(s.value); close() }}
            className={cn(
              'w-full flex items-center justify-between px-3.5 py-2 text-xs transition-colors',
              'hover:bg-zinc-50 dark:hover:bg-zinc-800',
              filters.sortBy === s.value
                ? 'text-zinc-900 dark:text-zinc-100 font-semibold'
                : 'text-zinc-600 dark:text-zinc-400'
            )}
          >
            {s.label}
            <SortIcon field={s.value} />
          </button>
        ))}
      </Dropdown>

      {/* Reset */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={() => { resetFilters(); setLocalSearch('') }}
            className="flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-600 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          >
            <X size={12} /> Reset
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function TransactionFilters({ totalCount }) {
  const filters      = useAppStore((s) => s.filters)
  const setFilter    = useAppStore((s) => s.setFilter)
  const resetFilters = useAppStore((s) => s.resetFilters)

  const [localSearch, setLocalSearch] = useState(filters.search)
  const [mobileOpen, setMobileOpen]   = useState(false)
  const deferredSearch = useDeferredValue(localSearch)

  useEffect(() => {
    setFilter('search', deferredSearch)
  }, [deferredSearch]) // eslint-disable-line

  const hasActiveFilters =
    filters.dateRange !== 'last6' ||
    filters.category.length > 0 ||
    filters.type !== 'all' ||
    filters.search !== ''

  // Active filter count (excluding search — shown in search bar itself)
  const activeFilterCount = [
    filters.dateRange !== 'last6',
    filters.category.length > 0,
    filters.type !== 'all',
  ].filter(Boolean).length

  const sharedProps = { filters, setFilter, resetFilters, setLocalSearch, localSearch, hasActiveFilters }

  return (
    <div className="space-y-2">
      {/* ── Row 1: always visible ─────────────────────────────────── */}
      <div className="flex items-center gap-2">
        {/* Search — always visible */}
        <div className="relative flex-1 min-w-0 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search transactions…"
            className={cn(
              'w-full pl-8 pr-8 py-1.5 rounded-lg text-xs',
              'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700',
              'text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400',
              'focus:outline-none focus:ring-1 focus:ring-zinc-300 dark:focus:ring-zinc-600',
            )}
          />
          {localSearch && (
            <button
              onClick={() => { setLocalSearch(''); setFilter('search', '') }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Mobile: Filter toggle button */}
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className={cn(
            'sm:hidden relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium',
            'border transition-all duration-150',
            mobileOpen || activeFilterCount > 0
              ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white'
              : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'
          )}
        >
          <Filter size={12} />
          Filters
          {/* Active badge */}
          {activeFilterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center leading-none">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Desktop: filter controls inline */}
        <div className="hidden sm:flex">
          <FilterControls {...sharedProps} />
        </div>
      </div>

      {/* ── Mobile collapsible panel ──────────────────────────────── */}
      <AnimatePresence initial={false}>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="sm:hidden overflow-hidden"
          >
            <div className="pt-2 pb-1">
              <FilterControls {...sharedProps} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Active category pills — always visible when set ──────── */}
      <AnimatePresence>
        {filters.category.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-1.5 overflow-hidden"
          >
            {filters.category.map((cat) => (
              <motion.button
                key={cat}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                onClick={() => {
                  const next = filters.category.filter((c) => c !== cat)
                  setFilter('category', next)
                }}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
                  CATEGORY_COLORS[cat]?.bg,
                  CATEGORY_COLORS[cat]?.text
                )}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: CATEGORY_COLORS[cat]?.hex }} />
                {cat}
                <X size={10} />
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Result count ──────────────────────────────────────────── */}
      <p className="text-xs text-zinc-400 dark:text-zinc-600">
        {totalCount} transaction{totalCount !== 1 ? 's' : ''} found
      </p>
    </div>
  )
}