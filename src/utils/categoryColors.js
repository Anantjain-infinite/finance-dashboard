
export const CATEGORY_COLORS = {
  Food: {
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    text: 'text-amber-800 dark:text-amber-300',
    dot: '#f59e0b',
    hex: '#f59e0b',
  },
  Travel: {
    bg: 'bg-violet-100 dark:bg-violet-900/30',
    text: 'text-violet-800 dark:text-violet-300',
    dot: '#8b5cf6',
    hex: '#8b5cf6',
  },
  Bills: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-800 dark:text-red-300',
    dot: '#ef4444',
    hex: '#ef4444',
  },
  Shopping: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    text: 'text-emerald-800 dark:text-emerald-300',
    dot: '#10b981',
    hex: '#10b981',
  },
  Health: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-800 dark:text-blue-300',
    dot: '#3b82f6',
    hex: '#3b82f6',
  },
  Entertainment: {
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    text: 'text-orange-800 dark:text-orange-300',
    dot: '#f97316',
    hex: '#f97316',
  },
  Education: {
    bg: 'bg-cyan-100 dark:bg-cyan-900/30',
    text: 'text-cyan-800 dark:text-cyan-300',
    dot: '#06b6d4',
    hex: '#06b6d4',
  },
  Salary: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-800 dark:text-green-300',
    dot: '#22c55e',
    hex: '#22c55e',
  },
  Freelance: {
    bg: 'bg-lime-100 dark:bg-lime-900/30',
    text: 'text-lime-800 dark:text-lime-300',
    dot: '#84cc16',
    hex: '#84cc16',
  },
  Other: {
    bg: 'bg-zinc-100 dark:bg-zinc-800',
    text: 'text-zinc-700 dark:text-zinc-300',
    dot: '#6b7280',
    hex: '#6b7280',
  },
}

export function getCategoryColor(category) {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS.Other
}

// Returns array of hex colours in the same order as categories
export function getCategoryHexList(categories) {
  return categories.map((c) => getCategoryColor(c).hex)
}
