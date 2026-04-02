import Papa from 'papaparse'

const ALL_COLUMNS = [
  { key: 'date', label: 'Date' },
  { key: 'description', label: 'Description' },
  { key: 'merchant', label: 'Merchant' },
  { key: 'category', label: 'Category' },
  { key: 'type', label: 'Type' },
  { key: 'amount', label: 'Amount (₹)' },
]

export { ALL_COLUMNS }

export function exportToCsv(transactions, selectedColumns = ALL_COLUMNS, filename = 'transactions') {
  const cols = selectedColumns.length > 0 ? selectedColumns : ALL_COLUMNS

  const data = transactions.map((tx) => {
    const row = {}
    cols.forEach(({ key, label }) => {
      if (key === 'amount') {
        row[label] = tx.type === 'expense' ? -Math.abs(tx.amount) : tx.amount
      } else if (key === 'date') {
        row[label] = new Date(tx.date).toLocaleDateString('en-IN')
      } else {
        row[label] = tx[key] ?? ''
      }
    })
    return row
  })

  const csv = Papa.unparse(data)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
