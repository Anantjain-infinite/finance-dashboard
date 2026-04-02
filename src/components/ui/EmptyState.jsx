import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

const ICONS = {
  transactions: (
    <svg viewBox="0 0 80 80" fill="none" className="w-16 h-16 mx-auto mb-4">
      <rect x="12" y="16" width="56" height="48" rx="8" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M24 32h32M24 40h24M24 48h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 80 80" fill="none" className="w-16 h-16 mx-auto mb-4">
      <rect x="8" y="8" width="64" height="64" rx="8" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M20 56l12-18 10 8 16-22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="20" cy="56" r="2.5" fill="currentColor"/>
      <circle cx="32" cy="38" r="2.5" fill="currentColor"/>
      <circle cx="42" cy="46" r="2.5" fill="currentColor"/>
      <circle cx="58" cy="24" r="2.5" fill="currentColor"/>
    </svg>
  ),
  insights: (
    <svg viewBox="0 0 80 80" fill="none" className="w-16 h-16 mx-auto mb-4">
      <circle cx="40" cy="40" r="26" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M40 28v14l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="40" cy="28" r="2" fill="currentColor"/>
    </svg>
  ),
  search: (
    <svg viewBox="0 0 80 80" fill="none" className="w-16 h-16 mx-auto mb-4">
      <circle cx="34" cy="34" r="18" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M47 47l14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M28 34h12M34 28v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M54 66l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.4"/>
    </svg>
  ),
}

export default function EmptyState({
  type = 'transactions',
  title = 'No data found',
  description = 'Try adjusting your filters or add some transactions.',
  action,
  className,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex flex-col items-center justify-center py-16 px-6 text-center',
        'text-zinc-300 dark:text-zinc-700',
        className
      )}
    >
      {ICONS[type] || ICONS.transactions}
      <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-500 mb-1.5">
        {title}
      </h3>
      <p className="text-xs text-zinc-400 dark:text-zinc-600 max-w-xs leading-relaxed">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  )
}
