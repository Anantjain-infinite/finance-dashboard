import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'
import { CATEGORY_COLORS } from '../../utils/categoryColors'

const CATEGORIES = Object.keys(CATEGORY_COLORS)

const EMPTY_FORM = {
  description: '',
  merchant: '',
  amount: '',
  date: new Date().toISOString().slice(0, 10),
  type: 'expense',
  category: 'Food',
  note: '',
}

function FormField({ label, error, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{error}</p>}
    </div>
  )
}

const inputCls = cn(
  'w-full px-3 py-2 rounded-lg text-sm',
  'bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700',
  'text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600',
  'focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:focus:ring-zinc-600',
  // date inputs need explicit color in dark mode (browser renders them oddly)
  '[color-scheme:light] dark:[color-scheme:dark]',
)

export default function TransactionModal({ open, onClose, onSubmit, initialData, isLoading }) {
  const isEdit = !!initialData
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (open) {
      setForm(initialData
        ? { ...initialData, amount: String(initialData.amount) }
        : { ...EMPTY_FORM, date: new Date().toISOString().slice(0, 10) }
      )
      setErrors({})
    }
  }, [open, initialData])

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: '' }))
  }

  function validate() {
    const e = {}
    if (!form.description.trim()) e.description = 'Description is required'
    if (!form.merchant.trim()) e.merchant = 'Merchant is required'
    const amt = parseFloat(form.amount)
    if (!form.amount || isNaN(amt) || amt <= 0) e.amount = 'Enter a valid positive amount'
    if (!form.date) e.date = 'Date is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    onSubmit({ ...form, amount: parseFloat(form.amount) })
  }

  // Close on Escape
  useEffect(() => {
    if (!open) return
    function handler(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

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
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal — centred, scrollable on short screens */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-800 my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
                <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {isEdit ? 'Edit Transaction' : 'Add Transaction'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                {/* Type toggle */}
                <FormField label="Type">
                  <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-0.5 gap-0.5">
                    {['expense', 'income'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => set('type', t)}
                        className={cn(
                          'flex-1 py-1.5 rounded-md text-xs font-semibold capitalize transition-all duration-150',
                          form.type === t
                            ? t === 'expense'
                              ? 'bg-red-500 text-white shadow-sm'
                              : 'bg-emerald-500 text-white shadow-sm'
                            : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </FormField>

                {/* Description */}
                <FormField label="Description" error={errors.description}>
                  <input
                    className={cn(inputCls, errors.description && 'border-red-400 dark:border-red-600 focus:ring-red-300')}
                    placeholder="e.g. Swiggy Order"
                    value={form.description}
                    onChange={(e) => set('description', e.target.value)}
                  />
                </FormField>

                {/* Merchant + Amount */}
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Merchant" error={errors.merchant}>
                    <input
                      className={cn(inputCls, errors.merchant && 'border-red-400 dark:border-red-600')}
                      placeholder="e.g. Swiggy"
                      value={form.merchant}
                      onChange={(e) => set('merchant', e.target.value)}
                    />
                  </FormField>
                  <FormField label="Amount (₹)" error={errors.amount}>
                    <input
                      className={cn(inputCls, errors.amount && 'border-red-400 dark:border-red-600')}
                      placeholder="0"
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.amount}
                      onChange={(e) => set('amount', e.target.value)}
                    />
                  </FormField>
                </div>

                {/* Category + Date */}
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Category">
                    <select
                      className={inputCls}
                      value={form.category}
                      onChange={(e) => set('category', e.target.value)}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </FormField>
                  <FormField label="Date" error={errors.date}>
                    <input
                      type="date"
                      className={cn(inputCls, errors.date && 'border-red-400 dark:border-red-600')}
                      value={form.date}
                      onChange={(e) => set('date', e.target.value)}
                    />
                  </FormField>
                </div>

                {/* Note */}
                <FormField label="Note (optional)">
                  <input
                    className={inputCls}
                    placeholder="Any extra details…"
                    value={form.note}
                    onChange={(e) => set('note', e.target.value)}
                  />
                </FormField>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={cn(
                      'flex-1 py-2.5 rounded-xl text-sm font-semibold text-white',
                      'flex items-center justify-center gap-2',
                      form.type === 'expense'
                        ? 'bg-zinc-900 dark:bg-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200'
                        : 'bg-emerald-600 hover:bg-emerald-700',
                      isLoading && 'opacity-60 cursor-not-allowed'
                    )}
                  >
                    {isLoading && <Loader2 size={14} className="animate-spin" />}
                    {isEdit ? 'Save changes' : 'Add transaction'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
