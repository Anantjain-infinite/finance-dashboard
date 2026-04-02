import React, { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AnimatePresence } from 'framer-motion'
import AppShell from './components/layout/AppShell'
import PageSkeleton from './components/ui/PageSkeleton'
import useAppStore from './store/useAppStore'

const DashboardPage    = lazy(() => import('./pages/DashboardPage'))
const TransactionsPage = lazy(() => import('./pages/TransactionsPage'))
const InsightsPage     = lazy(() => import('./pages/InsightsPage'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
})

function ThemeInitializer() {
  const initTheme = useAppStore((s) => s.initTheme)
  useEffect(() => { initTheme() }, [initTheme])
  return null
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Suspense fallback={<PageSkeleton />} key={location.pathname}>
        <Routes location={location}>
          <Route path="/"             element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard"    element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/insights"     element={<InsightsPage />} />
          <Route path="*"             element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeInitializer />
        <AppShell>
          <AnimatedRoutes />
        </AppShell>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
