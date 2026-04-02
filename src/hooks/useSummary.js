import { useQuery } from '@tanstack/react-query'
import { getSummary } from '../api/summary.api'
import { QUERY_KEYS } from '../constants/queryKeys'
import useAppStore from '../store/useAppStore'

export function useSummary() {
  const dateRange = useAppStore((s) => s.filters.dateRange)

  return useQuery({
    queryKey: QUERY_KEYS.summary(dateRange),
    queryFn: () => getSummary(dateRange),
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  })
}
