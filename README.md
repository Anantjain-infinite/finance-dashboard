# FinanceOS — Finance Dashboard

A clean, interactive finance dashboard built with React 18, Tailwind CSS v4, Zustand, React Query, Recharts, and Framer Motion. Tracks income, expenses, and spending patterns with role-based UI, dark mode, CSV export, and smooth animations throughout.

---

## Quick start

```bash
npm install
npm run dev
```

Open [https://finance-dashboard-seven-tau.vercel.app/](https://finance-dashboard-seven-tau.vercel.app/).

---

## Tech stack

| Layer | Library |
|---|---|
| Framework | React  + Vite  |
| Styling | Tailwind CSS |
| State | Zustand  (slice pattern) |
| Data fetching | TanStack React Query  |
| Charts | Recharts |
| Animation | Framer Motion  |
| Icons | Lucide React |
| CSV export | PapaParse |
| Date utils | date-fns  |
| Routing | React Router  |

---

## Folder structure

```
src/
├── api/                    # Mock API layer (simulated delay, CRUD)
│   ├── client.js           # mockDelay helper
│   ├── transactions.api.js # getTransactions, add, update, delete
│   ├── summary.api.js      # getSummary — KPIs + sparklines
│   └── insights.api.js     # getInsights — patterns + MoM
│
├── data/
│   └── transactions.data.js  # Single source of truth (81 transactions)
│
├── store/
│   ├── useAppStore.js        # Combined Zustand store
│   └── slices/
│       ├── roleSlice.js      # ADMIN / VIEWER
│       ├── themeSlice.js     # dark / light (persisted)
│       ├── filterSlice.js    # All transaction filters
│       └── sidebarSlice.js   # Collapsed + mobile state
│
├── hooks/
│   ├── useTransactions.js  # Query + mutations
│   ├── useSummary.js       # Summary KPIs
│   ├── useInsights.js      # Insights data
│   └── useCountUp.js       # Number animation hook
│
├── components/
│   ├── layout/             # AppShell, Sidebar, Topbar, PageWrapper
│   ├── ui/                 # Skeleton, EmptyState, Badge, MiniSparkline
│   ├── dashboard/          # SummaryCards, BalanceTrendChart, SpendingDonut, RecentTransactions
│   ├── transactions/       # TransactionTable, TransactionRow, TransactionFilters, TransactionModal, ExportButton
│   └── insights/           # InsightCards, MonthlyComparisonChart, CategoryBreakdown
│
├── pages/                  # Lazy-loaded route pages
├── guards/                 # RoleGuard component
├── utils/                  # cn, formatCurrency, categoryColors, exportCsv
└── constants/              # roles.js, queryKeys.js
```

---

## Features

### Dashboard overview
- **3 KPI summary cards** — Balance, Income, Expenses with animated count-up numbers, 7-day sparklines, and percentage change badges
- **Spend health arc** — animated circular arc that fills green/amber/red based on savings rate
- **Balance trend chart** — Recharts AreaChart showing 6-month income vs expense with custom tooltip and legend
- **Spending donut** — Recharts PieChart with active shape on hover, category colour coding, and inline legend
- **Recent transactions** — last 7 transactions with category colour coding and "View all" link

### Transactions
- **Filter bar** — debounced search, date range picker, category multi-select with coloured checkboxes, type toggle, sort by date/amount with direction
- **Active filter pills** — selected categories shown as removable pills below the filter bar
- **Sortable table** — responsive (category hidden on mobile, type hidden on tablet), animated row entrance/exit
- **Hover action strip** — on row hover, amount fades out and Edit/Delete icons slide in (Admin only)
- **Add/Edit modal** — form with validation, income/expense type toggle, all fields pre-populated when editing
- **CSV export** — column selector popover, exports only the current filtered dataset

### Insights
- **6 insight cards** — top spending category, this month's income/expenses with MoM change badges, savings rate, average daily spend, largest single expense
- **Monthly comparison chart** — grouped bar chart (income vs expense) for last 6 months with net calculation in tooltip
- **Category breakdown** — animated horizontal progress bars with amounts and percentages, sorted by total

### Role-based UI
- **Admin** — sees Add button, Edit/Delete row actions, full access
- **Viewer** — read-only table, no add/edit/delete, export still available
- **Role switcher** — segmented control at the bottom of the sidebar, Zustand only (no backend)

### UX & polish
- **Dark mode** — Tailwind `dark:` class strategy, synced to OS preference on first load, persisted to localStorage
- **Skeleton loading** — every section has a dedicated shimmer skeleton shown while React Query fetches
- **Empty states** — contextual SVG illustrations with helpful messages for no-data cases
- **Lazy loading** — all three pages are `React.lazy()` chunks, loaded on first navigation
- **Page transitions** — Framer Motion fade + slide-up on every route change

---

## Mock data

All 81 transactions live in `src/data/transactions.data.js` covering November 2024 – April 2025. They include realistic Indian merchants (Swiggy, Infosys salary, IRCTC, BESCOM, etc.) across 10 categories. Mutations (add/edit/delete) work in-memory for the duration of the session — refreshing the page resets to the original dataset.

---





## Thoughtful design choices

1. **Animated count-up numbers** — KPI values count from 0 on load using RAF + ease-out cubic, not a library


2. **keepPreviousData on queries** — filter changes never flash a blank table; previous data stays visible until the new results arrive
3. **Debounced search** — `useDeferredValue` prevents a query per keystroke while keeping the input instant


## Built By

**Anant Jain**



- LinkedIn: [linkedin.com/in/anantjain2208](https://linkedin.com/in/anantjain2208)
- GitHub: [github.com/Anantjain-infinite](https://github.com/Anantjain-infinite)
- Email: [anantjain.works@gmail.com](mailto:anantjain.works@gmail.com)