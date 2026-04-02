import { mockDelay } from './client'
import { mutableTransactions } from '../data/transactions.data'
import {
  parseISO, isWithinInterval, startOfMonth, endOfMonth,
  subMonths, format,
} from 'date-fns'

export async function getInsights() {
  await mockDelay()

  const now = new Date()
  const thisMonthStart = startOfMonth(now)
  const thisMonthEnd = endOfMonth(now)
  const lastMonthStart = startOfMonth(subMonths(now, 1))
  const lastMonthEnd = endOfMonth(subMonths(now, 1))

  const thisMonth = mutableTransactions.filter((tx) =>
    isWithinInterval(parseISO(tx.date), { start: thisMonthStart, end: thisMonthEnd })
  )
  const lastMonth = mutableTransactions.filter((tx) =>
    isWithinInterval(parseISO(tx.date), { start: lastMonthStart, end: lastMonthEnd })
  )

  // category spending breakdown (last 6 months, expenses only)
  const sixMonthsAgo = startOfMonth(subMonths(now, 5))
  const recentExpenses = mutableTransactions.filter(
    (tx) => tx.type === 'expense' &&
      isWithinInterval(parseISO(tx.date), { start: sixMonthsAgo, end: endOfMonth(now) })
  )

  const categoryTotals = recentExpenses.reduce((acc, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + tx.amount
    return acc
  }, {})

  const categoryBreakdown = Object.entries(categoryTotals)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total)

  const topCategory = categoryBreakdown[0] || null

  // month-over-month
  const thisMonthExpenses = thisMonth
    .filter((tx) => tx.type === 'expense')
    .reduce((s, tx) => s + tx.amount, 0)
  const lastMonthExpenses = lastMonth
    .filter((tx) => tx.type === 'expense')
    .reduce((s, tx) => s + tx.amount, 0)

  const thisMonthIncome = thisMonth
    .filter((tx) => tx.type === 'income')
    .reduce((s, tx) => s + tx.amount, 0)
  const lastMonthIncome = lastMonth
    .filter((tx) => tx.type === 'income')
    .reduce((s, tx) => s + tx.amount, 0)

  const expenseChange = lastMonthExpenses > 0
    ? Math.round(((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100)
    : 0

  const incomeChange = lastMonthIncome > 0
    ? Math.round(((thisMonthIncome - lastMonthIncome) / lastMonthIncome) * 100)
    : 0

  // monthly comparison chart data (last 6 months)
  const monthlyComparison = Array.from({ length: 6 }, (_, i) => {
    const monthDate = subMonths(now, 5 - i)
    const mStart = startOfMonth(monthDate)
    const mEnd = endOfMonth(monthDate)
    const monthTxs = mutableTransactions.filter((tx) =>
      isWithinInterval(parseISO(tx.date), { start: mStart, end: mEnd })
    )
    return {
      month: format(monthDate, 'MMM yy'),
      income: monthTxs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0),
      expense: monthTxs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    }
  })

  // Savings rate this month
  const savingsRate = thisMonthIncome > 0
    ? Math.round(((thisMonthIncome - thisMonthExpenses) / thisMonthIncome) * 100)
    : 0

  // Largest single transaction this month
  const largestExpense = thisMonth
    .filter((tx) => tx.type === 'expense')
    .sort((a, b) => b.amount - a.amount)[0] || null

  // Average daily spend (this month)
  const daysInMonth = now.getDate()
  const avgDailySpend = Math.round(thisMonthExpenses / daysInMonth)

  return {
    topCategory,
    categoryBreakdown,
    thisMonthExpenses,
    lastMonthExpenses,
    thisMonthIncome,
    lastMonthIncome,
    expenseChange,
    incomeChange,
    monthlyComparison,
    savingsRate,
    largestExpense,
    avgDailySpend,
  }
}
