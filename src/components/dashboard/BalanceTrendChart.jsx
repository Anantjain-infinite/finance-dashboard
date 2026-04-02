import { motion } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { formatCompact, formatCurrency } from '../../utils/formatCurrency'
import Skeleton from '../ui/Skeleton'
import EmptyState from '../ui/EmptyState'

export function BalanceTrendSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-800">
      <Skeleton className="h-4 w-36 mb-1.5" />
      <Skeleton className="h-3 w-52 mb-5" />
      <Skeleton className="h-[210px] w-full rounded-xl" />
    </div>
  )
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl px-3.5 py-3 shadow-lg text-xs pointer-events-none">
      <p className="font-semibold text-zinc-700 dark:text-zinc-300 mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 mb-1 last:mb-0">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: entry.color }} />
          <span className="text-zinc-500 dark:text-zinc-400 capitalize">{entry.name}</span>
          <span className="font-semibold text-zinc-800 dark:text-zinc-200 ml-auto pl-4">
            {formatCurrency(entry.value)}
          </span>
        </div>
      ))}
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
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 capitalize">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  )
}

const CURSOR_STYLE = {
  fill: 'currentColor',
  className: 'text-zinc-100 dark:text-zinc-800',
  opacity: 0.5,
}

export default function BalanceTrendChart({ data }) {
  const isEmpty = !data?.length || data.every((d) => d.income === 0 && d.expense === 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-800 h-full"
    >
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Balance Trend</h2>
        <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5">
          Income vs expenses · last 6 months
        </p>
      </div>

      {isEmpty ? (
        <EmptyState
          type="chart"
          title="No data yet"
          description="Transactions will appear here once added."
        />
      ) : (
        <ResponsiveContainer width="100%" height={210}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="gIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0.01} />
              </linearGradient>
              <linearGradient id="gExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.01} />
              </linearGradient>
            </defs>

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
              axisLine={false}
              tickLine={false}
              dy={6}
            />
            <YAxis
              tickFormatter={formatCompact}
              tick={{ fontSize: 11, fill: 'currentColor' }}
              className="text-zinc-400 dark:text-zinc-600"
              axisLine={false}
              tickLine={false}
              dx={-4}
            />
            <Tooltip content={<CustomTooltip />} cursor={CURSOR_STYLE} />
            <Legend content={<CustomLegend />} />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#22c55e"
              strokeWidth={2}
              fill="url(#gIncome)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0, fill: '#22c55e' }}
            />
            <Area
              type="monotone"
              dataKey="expense"
              stroke="#ef4444"
              strokeWidth={2}
              fill="url(#gExpense)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0, fill: '#ef4444' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  )
}
