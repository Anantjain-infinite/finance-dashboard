import { useState } from 'react'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector } from 'recharts'
import { formatCurrency } from '../../utils/formatCurrency'
import { getCategoryColor } from '../../utils/categoryColors'
import Skeleton from '../ui/Skeleton'
import EmptyState from '../ui/EmptyState'

export function SpendingDonutSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-800 h-full">
      <Skeleton className="h-4 w-36 mb-1.5" />
      <Skeleton className="h-3 w-44 mb-5" />
      <div className="flex justify-center mb-5">
        <Skeleton className="w-[152px] h-[152px] rounded-full" />
      </div>
      <div className="space-y-2.5">
        {[1,2,3,4,5].map((i) => (
          <div key={i} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Skeleton className="w-2.5 h-2.5 rounded-full flex-shrink-0" />
              <Skeleton className="h-3 w-16" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-8" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ActiveShape(props) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props
  return (
    <g>
      <Sector
        cx={cx} cy={cy}
        innerRadius={innerRadius - 2}
        outerRadius={outerRadius + 7}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.9}
      />
    </g>
  )
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const item = payload[0]
  return (
    <div className="bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl px-3 py-2.5 shadow-lg text-xs pointer-events-none">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-2 h-2 rounded-full" style={{ background: item.payload.fill }} />
        <span className="font-semibold text-zinc-800 dark:text-zinc-200">{item.name}</span>
      </div>
      <p className="text-zinc-600 dark:text-zinc-300 font-medium">{formatCurrency(item.value)}</p>
      <p className="text-zinc-400 dark:text-zinc-500 mt-0.5">{item.payload.percent}% of total</p>
    </div>
  )
}

export default function SpendingDonut({ data }) {
  const [activeIdx, setActiveIdx] = useState(null)
  const isEmpty  = !data?.length
  const total    = data?.reduce((s, d) => s + d.total, 0) ?? 0

  // Top 6 + "Other" bucket
  const top6      = data?.slice(0, 6) ?? []
  const otherSum  = data?.slice(6).reduce((s, d) => s + d.total, 0) ?? 0

  const chartData = [
    ...top6.map((d) => ({
      name:    d.category,
      value:   d.total,
      fill:    getCategoryColor(d.category).hex,
      percent: total > 0 ? Math.round((d.total / total) * 100) : 0,
    })),
    ...(otherSum > 0 ? [{
      name:    'Other',
      value:   otherSum,
      fill:    getCategoryColor('Other').hex,
      percent: total > 0 ? Math.round((otherSum / total) * 100) : 0,
    }] : []),
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-800 h-full flex flex-col"
    >
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Spending Breakdown</h2>
        <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5">By category · last 6 months</p>
      </div>

      {isEmpty ? (
        <EmptyState
          type="chart"
          title="No expenses yet"
          description="Your spending breakdown will appear here."
          className="flex-1"
        />
      ) : (
        <>
          <ResponsiveContainer width="100%" height={176}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%" cy="50%"
                innerRadius={52}
                outerRadius={76}
                dataKey="value"
                paddingAngle={2}
                activeIndex={activeIdx ?? undefined}
                activeShape={<ActiveShape />}
                onMouseEnter={(_, i) => setActiveIdx(i)}
                onMouseLeave={() => setActiveIdx(null)}
              >
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} opacity={0.85} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="space-y-1.5 mt-2 flex-1">
            {chartData.map((item, i) => (
              <button
                key={i}
                className="w-full flex items-center justify-between gap-2 rounded-lg px-1 py-0.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                onMouseEnter={() => setActiveIdx(i)}
                onMouseLeave={() => setActiveIdx(null)}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.fill }} />
                  <span className="text-xs text-zinc-600 dark:text-zinc-400 truncate">{item.name}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 tabular-nums">
                    {formatCurrency(item.value)}
                  </span>
                  <span className="text-xs text-zinc-400 dark:text-zinc-600 w-7 text-right tabular-nums">
                    {item.percent}%
                  </span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </motion.div>
  )
}
