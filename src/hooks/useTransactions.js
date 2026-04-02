import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTransactions, addTransaction, updateTransaction, deleteTransaction } from '../api/transactions.api'
import { QUERY_KEYS } from '../constants/queryKeys'
import useAppStore from '../store/useAppStore'

export function useTransactions() {
  const filters = useAppStore((s) => s.filters)

  return useQuery({
    queryKey: QUERY_KEYS.transactions(filters),
    queryFn: () => getTransactions(filters),
    staleTime: 2 * 60 * 1000,        
    placeholderData: (prev) => prev,  
  })
}

export function useAddTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['summary'] })
      queryClient.invalidateQueries({ queryKey: ['insights'] })
    },
  })
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => updateTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['summary'] })
      queryClient.invalidateQueries({ queryKey: ['insights'] })
    },
  })
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['summary'] })
      queryClient.invalidateQueries({ queryKey: ['insights'] })
    },
  })
}
