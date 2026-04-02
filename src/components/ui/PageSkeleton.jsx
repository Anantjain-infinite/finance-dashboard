import Skeleton from './Skeleton'

export default function PageSkeleton() {
  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-7xl mx-auto animate-pulse">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[0,1,2].map((i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-800">
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-2.5">
                <Skeleton className="h-2.5 w-20" />
                <Skeleton className="h-7 w-32" />
              </div>
              <Skeleton className="h-9 w-9 rounded-xl" />
            </div>
            <div className="flex items-end justify-between">
              <Skeleton className="h-2.5 w-24" />
              <Skeleton className="h-9 w-[72px] rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      {/* Health arc */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-800 flex items-center gap-4">
        <Skeleton className="w-16 h-16 rounded-full flex-shrink-0" />
        <div className="space-y-2"><Skeleton className="h-3 w-20" /><Skeleton className="h-4 w-28" /></div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-800">
          <Skeleton className="h-4 w-32 mb-1.5" />
          <Skeleton className="h-3 w-48 mb-5" />
          <Skeleton className="h-[210px] w-full rounded-xl" />
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-800">
          <Skeleton className="h-4 w-28 mb-1.5" />
          <Skeleton className="h-3 w-40 mb-5" />
          <Skeleton className="h-[176px] w-full rounded-full mx-auto max-w-[176px]" />
        </div>
      </div>
    </div>
  )
}
