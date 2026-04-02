import { mockDelay } from './client'
import { mutableTransactions } from '../data/transactions.data'
import { parseISO, isWithinInterval, startOfMonth, endOfMonth, subMonths, startOfYear, endOfYear } from 'date-fns'

function getDateRange(dateRange, customStart, customEnd) {
  const now = new Date()
  switch (dateRange) {
    case 'thisMonth':
      return { start: startOfMonth(now), end: endOfMonth(now) }
    case 'last3':
      return { start: startOfMonth(subMonths(now, 2)), end: endOfMonth(now) }
    case 'thisYear':
      return { start: startOfYear(now), end: endOfYear(now) }
    case 'last6':
      return { start: startOfMonth(subMonths(now, 5)), end: endOfMonth(now) }
    case 'custom':
      return {
        start: customStart ? parseISO(customStart) : startOfMonth(now),
        end: customEnd ? parseISO(customEnd) : endOfMonth(now),
      }
    default:
      return { start: startOfMonth(subMonths(now, 5)), end: endOfMonth(now) }
  }
}

export async function getTransactions(filters = {}) {
  await mockDelay()

  const {
    dateRange = 'last6',
    customStart = null,
    customEnd = null,
    category = [],
    type = 'all',
    search = '',
    sortBy = 'date',
    sortDir = 'desc',
  } = filters

  const { start, end } = getDateRange(dateRange, customStart, customEnd)

  let results = mutableTransactions.filter((tx) => {
    const txDate = parseISO(tx.date)

    // Date range filter
    if (!isWithinInterval(txDate, { start, end })) return false

    // Category filter
    if (category.length > 0 && !category.includes(tx.category)) return false

    // Type filter
    if (type !== 'all' && tx.type !== type) return false

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase()
      const match =
        tx.description.toLowerCase().includes(q) ||
        tx.merchant.toLowerCase().includes(q) ||
        tx.category.toLowerCase().includes(q)
      if (!match) return false
    }

    return true
  })

  // Sort
  results = results.sort((a, b) => {
    let aVal, bVal
    if (sortBy === 'date') {
      aVal = new Date(a.date).getTime()
      bVal = new Date(b.date).getTime()
    } else if (sortBy === 'amount') {
      aVal = a.amount
      bVal = b.amount
    } else {
      aVal = a[sortBy]
      bVal = b[sortBy]
    }
    if (sortDir === 'asc') return aVal > bVal ? 1 : -1
    return aVal < bVal ? 1 : -1
  })

  return results
}

export async function addTransaction(data) {
  await mockDelay(400, 800)
  const newTx = {
    ...data,
    id: `txn_${Date.now()}`,
    note: data.note || '',
  }
  mutableTransactions.unshift(newTx)
  return newTx
}

export async function updateTransaction(id, data) {
  await mockDelay(400, 800)
  const idx = mutableTransactions.findIndex((tx) => tx.id === id)
  if (idx === -1) throw new Error('Transaction not found')
  mutableTransactions[idx] = { ...mutableTransactions[idx], ...data }
  return mutableTransactions[idx]
}

export async function deleteTransaction(id) {
  await mockDelay(300, 600)
  const idx = mutableTransactions.findIndex((tx) => tx.id === id)
  if (idx === -1) throw new Error('Transaction not found')
  mutableTransactions.splice(idx, 1)
  return { id }
}
