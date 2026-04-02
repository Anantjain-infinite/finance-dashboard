import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, ChevronDown, FileText } from 'lucide-react'
import { cn } from '../../utils/cn'
import { exportToCsv, ALL_COLUMNS } from '../../utils/exportCsv'

export default function ExportButton({ data }) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(ALL_COLUMNS.map((c) => c.key))
  const ref = useRef(null)

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function toggleCol(key) {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  function handleExport() {
    const cols = ALL_COLUMNS.filter((c) => selected.includes(c.key))
    exportToCsv(data, cols)
    setOpen(false)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium',
          'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700',
          'text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600',
          'transition-all duration-150'
        )}
      >
        <Download size={13} />
        Export CSV
        <ChevronDown size={11} className={cn('transition-transform', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.14 }}
            className="absolute right-0 top-full mt-1.5 z-50 w-56 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-lg py-2"
          >
            <div className="px-3.5 pb-2 border-b border-zinc-100 dark:border-zinc-800 mb-1">
              <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Select columns</p>
              <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5">
                {data?.length || 0} rows will be exported
              </p>
            </div>

            {ALL_COLUMNS.map((col) => (
              <button
                key={col.key}
                onClick={() => toggleCol(col.key)}
                className="w-full flex items-center gap-2.5 px-3.5 py-1.5 text-xs hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <span
                  className={cn(
                    'w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 transition-colors',
                    selected.includes(col.key)
                      ? 'bg-zinc-900 dark:bg-white border-zinc-900 dark:border-white'
                      : 'border-zinc-300 dark:border-zinc-600'
                  )}
                >
                  {selected.includes(col.key) && (
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1 4l2 2 4-4" stroke={
                        typeof window !== 'undefined' && document.documentElement.classList.contains('dark')
                          ? '#18181b' : 'white'
                      } strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
                <FileText size={11} className="text-zinc-400 flex-shrink-0" />
                <span className="text-zinc-700 dark:text-zinc-300">{col.label}</span>
              </button>
            ))}

            <div className="px-3 pt-2 border-t border-zinc-100 dark:border-zinc-800 mt-1">
              <button
                onClick={handleExport}
                disabled={selected.length === 0 || !data?.length}
                className={cn(
                  'w-full py-2 rounded-lg text-xs font-semibold',
                  'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900',
                  'hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors',
                  (selected.length === 0 || !data?.length) && 'opacity-40 cursor-not-allowed'
                )}
              >
                Download CSV
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
