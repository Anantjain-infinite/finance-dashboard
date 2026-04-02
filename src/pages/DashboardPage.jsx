import PageWrapper from '../components/layout/PageWrapper'
import SummaryCards, { SummaryCardsSkeleton } from '../components/dashboard/SummaryCards'
import BalanceTrendChart, { BalanceTrendSkeleton } from '../components/dashboard/BalanceTrendChart'
import SpendingDonut, { SpendingDonutSkeleton } from '../components/dashboard/SpendingDonut'
import RecentTransactions, { RecentTransactionsSkeleton } from '../components/dashboard/RecentTransactions'
import { useSummary } from '../hooks/useSummary'
import { useInsights } from '../hooks/useInsights'
import { useTransactions } from '../hooks/useTransactions'

function ErrorBanner({ message }) {
  return (
    <div className="mx-6 mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-400">
      Failed to load data: {message}
    </div>
  )
}

export default function DashboardPage() {
  const summary = useSummary()
  const insights = useInsights()
  const transactions = useTransactions()

  const isLoading = summary.isLoading || insights.isLoading
  const error = summary.error || insights.error

  return (
    <PageWrapper>
      <div className="p-4 sm:p-6 space-y-4 max-w-7xl mx-auto">
        {error && <ErrorBanner message={error.message} />}

        {isLoading || !summary.data
          ? <SummaryCardsSkeleton />
          : <SummaryCards data={summary.data} />
        }

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            {isLoading || !summary.data
              ? <BalanceTrendSkeleton />
              : <BalanceTrendChart data={summary.data.sparklineMonths} />
            }
          </div>
          <div>
            {isLoading || !insights.data
              ? <SpendingDonutSkeleton />
              : <SpendingDonut data={insights.data.categoryBreakdown} />
            }
          </div>
        </div>

        {transactions.isLoading || !transactions.data
          ? <RecentTransactionsSkeleton />
          : <RecentTransactions data={transactions.data} />
        }
      </div>
    </PageWrapper>
  )
}
