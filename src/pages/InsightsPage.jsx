import PageWrapper from '../components/layout/PageWrapper'
import InsightCards, { InsightCardsSkeleton } from '../components/insights/InsightCards'
import MonthlyComparisonChart, { MonthlyComparisonSkeleton } from '../components/insights/MonthlyComparisonChart'
import CategoryBreakdown, { CategoryBreakdownSkeleton } from '../components/insights/CategoryBreakdown'
import { useInsights } from '../hooks/useInsights'

function ErrorBanner({ message }) {
  return (
    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-400">
      Failed to load insights: {message}
    </div>
  )
}

export default function InsightsPage() {
  const { data, isLoading, error } = useInsights()

  return (
    <PageWrapper>
      <div className="p-4 sm:p-6 space-y-4 max-w-7xl mx-auto">

        {error && <ErrorBanner message={error.message} />}

        {/* Insight KPI cards */}
        {isLoading || !data
          ? <InsightCardsSkeleton />
          : <InsightCards data={data} />
        }

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Monthly comparison - wider */}
          <div className="lg:col-span-3">
            {isLoading || !data
              ? <MonthlyComparisonSkeleton />
              : <MonthlyComparisonChart data={data.monthlyComparison} />
            }
          </div>

          {/* Category breakdown - narrower */}
          <div className="lg:col-span-2">
            {isLoading || !data
              ? <CategoryBreakdownSkeleton />
              : <CategoryBreakdown data={data.categoryBreakdown} />
            }
          </div>
        </div>

      </div>
    </PageWrapper>
  )
}
