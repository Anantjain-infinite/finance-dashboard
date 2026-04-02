const inrFull = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})


const inrCompact = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 1,
  notation: 'compact',
})



/** Full INR format: ₹1,23,456 */
export function formatCurrency(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0'
  return inrFull.format(amount)
}

/** Compact INR format: ₹1.2L, ₹45K */
export function formatCompact(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0'
  if (Math.abs(amount) >= 100_000) return inrCompact.format(amount)
  return inrFull.format(amount)
}




/** Plain number string without ₹ symbol, for animated counters */
export function formatAmount(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '0'
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(amount)
}
