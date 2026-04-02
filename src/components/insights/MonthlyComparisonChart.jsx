import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { formatCompact, formatCurrency } from '../../utils/formatCurrency'
import Skeleton from '../ui/Skeleton'
import EmptyState from '../ui/EmptyState'

export function MonthlyComparisonSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-800 h-full">
      <Skeleton className="h-4 w-52 mb-1.5" />
      <Skeleton className="h-3 w-64 mb-5" />
      <Skeleton className="h-[240px] w-full rounded-xl" />
    </div>
  )
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const income  = payload.find((p) => p.dataKey === 'income')
  const expense = payload.find((p) => p.dataKey === 'expense')
  const net     = (income?.value ?? 0) - (expense?.value ?? 0)

  return (
    <div className="bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl px-3.5 py-3 shadow-lg text-xs min-w-[170px] pointer-events-none">
      <p className="font-semibold text-zinc-700 dark:text-zinc-300 mb-2">{label}</p>
      {income && (
        <div className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-emerald-500 flex-shrink-0" />
            <span className="text-zinc-500 dark:text-zinc-400">Income</span>
          </div>
          <span className="font-semibold text-zinc-800 dark:text-zinc-200">{formatCurrency(income.value)}</span>
        </div>
      )}
      {expense && (
        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-red-500 flex-shrink-0" />
            <span className="text-zinc-500 dark:text-zinc-400">Expense</span>
          </div>
          <span className="font-semibold text-zinc-800 dark:text-zinc-200">{formatCurrency(expense.value)}</span>
        </div>
      )}
      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-700 flex items-center justify-between">
        <span className="text-zinc-500 dark:text-zinc-400">Net</span>
        <span className={`font-bold ${net >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
          {net >= 0 ? '+' : '−'}{formatCurrency(Math.abs(net))}
        </span>
      </div>
    </div>
  )
}



function CustomLegend({ payload }) {
  if (!payload) return null
  return (
    <div className="flex items-center gap-4 justify-end pr-2 pb-1">
      {payload.map((entry) => (
        <div key={entry.value} className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: entry.color }} />
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 capitalize">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}


export default function MonthlyComparisonChart({ data }) {
  const isEmpty = !data?.length || data.every((d) => d.income === 0 && d.expense === 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.2 }}
      className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-800 h-full"
    >
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          Monthly Income vs Expenses
        </h2>
        <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5">
          Side-by-side comparison · last 6 months
        </p>
      </div>

      {isEmpty ? (
        <EmptyState
          type="chart"
          title="No data available"
          description="Monthly comparison will appear once transactions are added."
        />
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }} barCategoryGap="28%" barGap={3}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              className="text-zinc-100 dark:text-zinc-800"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: 'currentColor' }}
              className="text-zinc-400 dark:text-zinc-600"
              axisLine={false} tickLine={false} dy={6}
            />
            <YAxis
              tickFormatter={formatCompact}
              tick={{ fontSize: 11, fill: 'currentColor' }}
              className="text-zinc-400 dark:text-zinc-600"
              axisLine={false} tickLine={false} dx={-4}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'currentColor', className: 'text-zinc-100 dark:text-zinc-800', opacity: 0.5 }}
            />
            <Legend content={<CustomLegend />} />
            <Bar dataKey="income"  fill="#22c55e" radius={[4,4,0,0]} maxBarSize={32} />
            <Bar dataKey="expense" fill="#ef4444" radius={[4,4,0,0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  )
}
