import { useQuery } from '@tanstack/react-query'
import { getInsights } from '../api/insights.api'
import { QUERY_KEYS } from '../constants/queryKeys'

export function useInsights() {
  return useQuery({
    queryKey: QUERY_KEYS.insights(),
    queryFn: getInsights,
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  })
}
