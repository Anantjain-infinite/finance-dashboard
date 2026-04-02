import { useState } from 'react'
import { Plus } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import TransactionFilters from '../components/transactions/TransactionFilters'
import TransactionTable, { TransactionTableSkeleton } from '../components/transactions/TransactionTable'
import TransactionModal from '../components/transactions/TransactionModal'
import ExportButton from '../components/transactions/ExportButton'
import RoleGuard from '../guards/RoleGuard'
import {
  useTransactions, useAddTransaction,
  useUpdateTransaction, useDeleteTransaction,
} from '../hooks/useTransactions'
import { ROLES } from '../constants/roles'

export default function TransactionsPage() {
  const { data, isLoading } = useTransactions()
  const addMutation    = useAddTransaction()
  const updateMutation = useUpdateTransaction()
  const deleteMutation = useDeleteTransaction()

  const [modalOpen, setModalOpen]   = useState(false)
  const [editTarget, setEditTarget] = useState(null)

  function openAdd()    { setEditTarget(null); setModalOpen(true) }
  function openEdit(tx) { setEditTarget(tx);   setModalOpen(true) }
  function closeModal() { setModalOpen(false);  setEditTarget(null) }

  async function handleSubmit(formData) {
    if (editTarget) {
      await updateMutation.mutateAsync({ id: editTarget.id, data: formData })
    } else {
      await addMutation.mutateAsync(formData)
    }
    closeModal()
  }

  async function handleDelete(id) {
    await deleteMutation.mutateAsync(id)
  }

  const isMutating = addMutation.isPending || updateMutation.isPending

  return (
    <PageWrapper>
      <div className="p-4 sm:p-6 space-y-4 max-w-7xl mx-auto">

        {/* Sticky filter + action bar */}
        <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 bg-zinc-50/90 dark:bg-zinc-950/90 backdrop-blur-sm border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-start gap-3 flex-wrap">
            {/* Filters take available space */}
            <div className="flex-1 min-w-0">
              <TransactionFilters totalCount={data?.length ?? 0} />
            </div>

            {/* Action buttons — always right-aligned */}
            <div className="flex items-center gap-2 flex-shrink-0 pt-0.5">
              <ExportButton data={data} />
              <RoleGuard allowedRoles={[ROLES.ADMIN]}>
                <button
                  onClick={openAdd}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200"
                >
                  <Plus size={14} />
                  <span className="hidden sm:inline">Add</span>
                  <span className="sm:hidden">+</span>
                </button>
              </RoleGuard>
            </div>
          </div>
        </div>

        {/* Table */}
        {isLoading || !data
          ? <TransactionTableSkeleton />
          : <TransactionTable data={data} onEdit={openEdit} onDelete={handleDelete} />
        }

        {/* Add/Edit modal — Admin only */}
        <RoleGuard allowedRoles={[ROLES.ADMIN]}>
          <TransactionModal
            open={modalOpen}
            onClose={closeModal}
            onSubmit={handleSubmit}
            initialData={editTarget}
            isLoading={isMutating}
          />
        </RoleGuard>

      </div>
    </PageWrapper>
  )
}
