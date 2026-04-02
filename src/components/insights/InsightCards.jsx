import { motion } from 'framer-motion'
import {
  Flame, TrendingUp, TrendingDown, PiggyBank,
  Receipt, CalendarDays,
} from 'lucide-react'
import { formatCurrency } from '../../utils/formatCurrency'
import { getCategoryColor } from '../../utils/categoryColors'
import { format } from 'date-fns'
import Skeleton from '../ui/Skeleton'

export function InsightCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-800">
          <div className="flex items-start justify-between mb-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="w-8 h-8 rounded-xl" />
          </div>
          <Skeleton className="h-7 w-36 mb-1.5" />
          <Skeleton className="h-3 w-28" />
        </div>
      ))}
    </div>
  )
}

function InsightCard({ title, value, sub, icon: Icon, iconBg, iconColor, accent, index, extra }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 transition-colors"
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-zinc-400 dark:text-zinc-600 uppercase tracking-wider">
          {title}
        </p>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
          <Icon size={15} className={iconColor} />
        </div>
      </div>

      <p className={`text-2xl font-bold mb-1 tabular-nums ${accent || 'text-zinc-900 dark:text-zinc-100'}`}>
        {value}
      </p>
      <p className="text-xs text-zinc-400 dark:text-zinc-600">{sub}</p>
      {extra}
    </motion.div>
  )
}

function ChangeBadge({ pct }) {
  const up = pct >= 0
  const Icon = up ? TrendingUp : TrendingDown
  return (
    <div className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs font-semibold
      ${up
        ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
        : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
      }`}
    >
      <Icon size={11} />
      {Math.abs(pct)}% vs last month
    </div>
  )
}

export default function InsightCards({ data }) {
  const {
    topCategory, expenseChange, incomeChange,
    savingsRate, largestExpense, avgDailySpend,
    thisMonthExpenses, thisMonthIncome,
  } = data

  const topColors = topCategory ? getCategoryColor(topCategory.category) : null

  const cards = [
    {
      title: 'Top spending category',
      value: topCategory?.category || '—',
      sub: topCategory ? `${formatCurrency(topCategory.total)} this period` : 'No expenses yet',
      icon: Flame,
      iconBg: topColors ? topColors.bg : 'bg-zinc-100 dark:bg-zinc-800',
      iconColor: topColors ? topColors.text : 'text-zinc-400',
      accent: topColors ? topColors.text : '',
    },
    {
      title: 'This month expenses',
      value: formatCurrency(thisMonthExpenses),
      sub: 'Total spending this month',
      icon: TrendingDown,
      iconBg: 'bg-red-50 dark:bg-red-900/30',
      iconColor: 'text-red-500 dark:text-red-400',
      accent: 'text-red-600 dark:text-red-400',
      extra: <ChangeBadge pct={expenseChange} />,
    },
    {
      title: 'This month income',
      value: formatCurrency(thisMonthIncome),
      sub: 'Total income this month',
      icon: TrendingUp,
      iconBg: 'bg-emerald-50 dark:bg-emerald-900/30',
      iconColor: 'text-emerald-500 dark:text-emerald-400',
      accent: 'text-emerald-600 dark:text-emerald-400',
      extra: <ChangeBadge pct={-incomeChange} />,
    },
    {
      title: 'Savings rate',
      value: `${savingsRate}%`,
      sub: savingsRate >= 50 ? 'Excellent — keep it up!' : savingsRate >= 25 ? 'Moderate — room to improve' : 'Low — review your expenses',
      icon: PiggyBank,
      iconBg: 'bg-blue-50 dark:bg-blue-900/30',
      iconColor: 'text-blue-500 dark:text-blue-400',
      accent: savingsRate >= 50
        ? 'text-emerald-600 dark:text-emerald-400'
        : savingsRate >= 25
          ? 'text-amber-600 dark:text-amber-400'
          : 'text-red-600 dark:text-red-400',
    },
    {
      title: 'Avg daily spend',
      value: formatCurrency(avgDailySpend),
      sub: 'Per day this month',
      icon: CalendarDays,
      iconBg: 'bg-violet-50 dark:bg-violet-900/30',
      iconColor: 'text-violet-500 dark:text-violet-400',
    },
    {
      title: 'Largest expense',
      value: largestExpense ? formatCurrency(largestExpense.amount) : '—',
      sub: largestExpense
        ? `${largestExpense.description} · ${format(new Date(largestExpense.date), 'd MMM')}`
        : 'No expenses this month',
      icon: Receipt,
      iconBg: 'bg-orange-50 dark:bg-orange-900/30',
      iconColor: 'text-orange-500 dark:text-orange-400',
      accent: 'text-orange-600 dark:text-orange-400',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card, i) => (
        <InsightCard key={card.title} {...card} index={i} />
      ))}
    </div>
  )
}
