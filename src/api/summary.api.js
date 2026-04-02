import { mockDelay } from './client'
import { mutableTransactions } from '../data/transactions.data'
import {
  parseISO, isWithinInterval, startOfMonth, endOfMonth,
  subMonths, startOfYear, endOfYear, format,
} from 'date-fns'

function getDateRange(dateRange) {
  const now = new Date()
  switch (dateRange) {
    case 'thisMonth':
      return { start: startOfMonth(now), end: endOfMonth(now) }
    case 'last3':
      return { start: startOfMonth(subMonths(now, 2)), end: endOfMonth(now) }
    case 'thisYear':
      return { start: startOfYear(now), end: endOfYear(now) }
    case 'last6':
    default:
      return { start: startOfMonth(subMonths(now, 5)), end: endOfMonth(now) }
  }
}

export async function getSummary(dateRange = 'last6') {
  await mockDelay()

  const { start, end } = getDateRange(dateRange)

  const filtered = mutableTransactions.filter((tx) =>
    isWithinInterval(parseISO(tx.date), { start, end })
  )

  const totalIncome = filtered
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0)

  const totalExpenses = filtered
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0)

  const balance = totalIncome - totalExpenses
  const savingsRate = totalIncome > 0
    ? Math.round((balance / totalIncome) * 100)
    : 0

  const sparklineMonths = Array.from({ length: 6 }, (_, i) => {
    const monthDate = subMonths(new Date(), 5 - i)
    const mStart = startOfMonth(monthDate)
    const mEnd = endOfMonth(monthDate)
    const monthTxs = mutableTransactions.filter((tx) =>
      isWithinInterval(parseISO(tx.date), { start: mStart, end: mEnd })
    )
    const income = monthTxs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const expense = monthTxs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    return {
      month: format(monthDate, 'MMM'),
      income,
      expense,
      balance: income - expense,
    }
  })

  // 7-day sparklines for each KPI card
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return format(d, 'yyyy-MM-dd')
  })

  const incomeSparkline = last7.map((day) =>
    mutableTransactions
      .filter((tx) => tx.date === day && tx.type === 'income')
      .reduce((s, tx) => s + tx.amount, 0)
  )

  const expenseSparkline = last7.map((day) =>
    mutableTransactions
      .filter((tx) => tx.date === day && tx.type === 'expense')
      .reduce((s, tx) => s + tx.amount, 0)
  )

  return {
    totalIncome,
    totalExpenses,
    balance,
    savingsRate,
    sparklineMonths,
    incomeSparkline,
    expenseSparkline,
    transactionCount: filtered.length,
  }
}
