import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { formatAmount, formatCurrency } from '../../utils/formatCurrency'
import { useCountUp } from '../../hooks/useCountUp'
import MiniSparkline from '../ui/MiniSparkline'
import Skeleton from '../ui/Skeleton'

export function SummaryCardsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-800">
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-2.5">
                <Skeleton className="h-2.5 w-20" />
                <Skeleton className="h-7 w-36" />
              </div>
              <Skeleton className="h-9 w-9 rounded-xl flex-shrink-0" />
            </div>
            <div className="flex items-end justify-between">
              <Skeleton className="h-2.5 w-28" />
              <Skeleton className="h-9 w-[72px] rounded-lg" />
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-800 flex items-center gap-4">
        <Skeleton className="w-16 h-16 rounded-full flex-shrink-0" />
        <div className="space-y-2">
          <Skeleton className="h-2.5 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-2.5 w-28" />
        </div>
      </div>
    </div>
  )
}


function SummaryCard({ title, value, change, sparkData, sparkColor, icon: Icon, iconBg, iconColor, index }) {
  const animated  = useCountUp(value, 900, value !== undefined)
  const isPositive = change >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 transition-colors"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-zinc-400 dark:text-zinc-600 uppercase tracking-wider mb-1.5 truncate">
            {title}
          </p>
          {/* ₹ prefix on its own so the counter only animates the number */}
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tabular-nums leading-tight">
            ₹{formatAmount(animated)}
          </p>
        </div>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ml-3 ${iconBg}`}>
          <Icon size={17} className={iconColor} />
        </div>
      </div>

      <div className="flex items-end justify-between gap-2">
        <div className="flex items-center gap-1 min-w-0">
          {isPositive
            ? <ArrowUpRight size={13} className="text-emerald-500 flex-shrink-0" />
            : <ArrowDownRight size={13} className="text-red-500 flex-shrink-0" />
          }
          <span className={`text-xs font-semibold ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
            {Math.abs(change)}%
          </span>
          <span className="text-xs text-zinc-400 dark:text-zinc-600 ml-0.5 truncate hidden sm:inline">
            vs last month
          </span>
        </div>
        <div className="flex-shrink-0">
          <MiniSparkline data={sparkData} color={sparkColor} width={72} height={36} />
        </div>
      </div>
    </motion.div>
  )
}


function SpendHealthArc({ savingsRate }) {
  const pct    = Math.min(Math.max(savingsRate ?? 0, 0), 100)
  const r      = 28
  const arcLen = 2 * Math.PI * r
  // Arc spans 280° of the circle
  const spanFraction = 280 / 360
  const filled = (pct / 100) * spanFraction * arcLen
  // leave the remaining gap + the invisible 80° sector
  const gap    = arcLen - filled

  const color  = pct >= 50 ? '#22c55e' : pct >= 25 ? '#f59e0b' : '#ef4444'
  const label  = pct >= 50 ? 'Excellent' : pct >= 25 ? 'Moderate' : 'Watch out'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.28 }}
      className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-800"
    >
      <div className="flex items-center gap-5">
        {/* Arc SVG */}
        <div className="relative flex-shrink-0" style={{ width: 64, height: 64 }}>
          <svg width="64" height="64" viewBox="0 0 64 64">
            {/* Track */}
            <circle
              cx="32" cy="32" r={r}
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${spanFraction * arcLen} ${arcLen}`}
              className="text-zinc-100 dark:text-zinc-800"
              transform="rotate(130 32 32)"
            />
            <motion.circle
              cx="32" cy="32" r={r}
              fill="none"
              stroke={color}
              strokeWidth="6"
              strokeLinecap="round"
              transform="rotate(130 32 32)"
              initial={{ strokeDasharray: `0 ${arcLen}` }}
              animate={{ strokeDasharray: `${filled} ${gap + arcLen * (80 / 360)}` }}
              transition={{ duration: 1.1, delay: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[11px] font-bold tabular-nums" style={{ color }}>{pct}%</span>
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-zinc-400 dark:text-zinc-600 uppercase tracking-wider mb-1">
            Savings rate
          </p>
          <p className="text-base font-semibold text-zinc-800 dark:text-zinc-200 leading-tight">
            {label}
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5">
            {pct}% of income saved this period
          </p>
        </div>

        {/* Right side: breakdown */}
        <div className="ml-auto hidden sm:flex flex-col gap-2 text-right">
          <div>
            <p className="text-xs text-zinc-400 dark:text-zinc-600">Income</p>
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {formatCurrency(Math.round((pct > 0 ? 1 : 0) * 85000))}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}



export default function SummaryCards({ data }) {
  const {
    totalIncome, totalExpenses, balance,
    savingsRate, incomeSparkline, expenseSparkline, sparklineMonths,
  } = data

  const balanceSpark  = sparklineMonths?.map((m) => m.balance) ?? []
  const incomeSpark   = incomeSparkline  ?? []
  const expenseSpark  = expenseSparkline ?? []

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          index={0}
          title="Total Balance"
          value={balance}
          change={8}
          sparkData={balanceSpark}
          sparkColor="#2563eb"
          icon={Wallet}
          iconBg="bg-blue-50 dark:bg-blue-900/30"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <SummaryCard
          index={1}
          title="Total Income"
          value={totalIncome}
          change={12}
          sparkData={incomeSpark}
          sparkColor="#22c55e"
          icon={TrendingUp}
          iconBg="bg-emerald-50 dark:bg-emerald-900/30"
          iconColor="text-emerald-600 dark:text-emerald-400"
        />
        <SummaryCard
          index={2}
          title="Total Expenses"
          value={totalExpenses}
          change={-5}
          sparkData={expenseSpark}
          sparkColor="#ef4444"
          icon={TrendingDown}
          iconBg="bg-red-50 dark:bg-red-900/30"
          iconColor="text-red-600 dark:text-red-400"
        />
      </div>
      <SpendHealthArc savingsRate={savingsRate} />
    </div>
  )
}
