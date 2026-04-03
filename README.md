# FinanceOS — Finance Dashboard

A clean, interactive personal finance dashboard built with React 18, Tailwind CSS v4, Zustand, TanStack React Query, Recharts, and Framer Motion. Tracks income, expenses, and spending patterns with role-based UI, dark mode, CSV export, pagination, and smooth animations throughout.

🔗 **Live Demo:** [finance-dashboard-seven-tau.vercel.app](https://finance-dashboard-seven-tau.vercel.app/)

---

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Tech stack

| Layer | Library |
|---|---|
| Framework | React 18 + Vite 5 |
| Styling | Tailwind CSS v4 |
| State management | Zustand 5 |
| Data fetching | TanStack React Query v5 |
| Charts | Recharts 2 | 
| Animation | Framer Motion 11 |
| Icons | Lucide React | 
| CSV export | PapaParse | 
| Date utilities | date-fns 4 |
| Routing | React Router v6 | 

---

## Folder structure

```
src/
├── api/                         # Mock API layer — simulates real network calls
│   ├── client.js                # mockDelay() — random 300–700ms latency
│   ├── transactions.api.js      # getTransactions (filter/sort/search), add, update, delete
│   ├── summary.api.js           # getSummary — balance, income, expenses, sparklines
│   └── insights.api.js          # getInsights — category breakdown, MoM comparison
│
├── data/
│   └── transactions.data.js     # Single source of truth — 81 mock Indian transactions
│
├── store/                       # Zustand store (slice pattern)
│   ├── useAppStore.js           # Combines all slices into one store
│   └── slices/
│       ├── roleSlice.js         # Current role: ADMIN | VIEWER
│       ├── themeSlice.js        # dark | light, persisted to localStorage
│       ├── filterSlice.js       # dateRange, category, type, search, sort
│       └── sidebarSlice.js      # Collapsed state + mobile drawer open state
│
├── hooks/                       # React Query hooks — components never import API directly
│   ├── useTransactions.js       # useTransactions() query + add/update/delete mutations
│   ├── useSummary.js            # useSummary() — KPI totals + sparkline arrays
│   ├── useInsights.js           # useInsights() — patterns, MoM, category breakdown
│   └── useCountUp.js            # Custom RAF-based number animation hook
│
├── components/
│   ├── layout/
│   │   ├── AppShell.jsx         # Root layout — sidebar + topbar + main area
│   │   ├── Sidebar.jsx          # Collapsible desktop nav + mobile drawer
│   │   ├── Topbar.jsx           # Sticky header with page title + role badge
│   │   └── PageWrapper.jsx      # Framer Motion fade/slide wrapper per page
│   │
│   ├── ui/                      # Shared primitives
│   │   ├── Skeleton.jsx         # Shimmer loading placeholder
│   │   ├── PageSkeleton.jsx     # Full-page skeleton for Suspense fallback
│   │   ├── EmptyState.jsx       # Contextual empty state with SVG illustration
│   │   ├── Badge.jsx            # Category + type pill badge
│   │   └── MiniSparkline.jsx    # Tiny inline SVG sparkline for KPI cards
│   │
│   ├── dashboard/
│   │   ├── SummaryCards.jsx          # 3 KPI cards + savings rate arc
│   │   ├── BalanceTrendChart.jsx     # Recharts AreaChart — income vs expense
│   │   ├── SpendingDonut.jsx         # Recharts PieChart — spending by category
│   │   └── RecentTransactions.jsx   # Last 7 transactions with "View all" link
│   │
│   ├── transactions/
│   │   ├── TransactionTable.jsx     # Paginated table (10 rows/page)
│   │   ├── TransactionRow.jsx       # Single row — hover reveals Admin actions
│   │   ├── TransactionFilters.jsx   # Search + collapsible filters (mobile-aware)
│   │   ├── TransactionModal.jsx     # Add / Edit modal with validation
│   │   └── ExportButton.jsx         # CSV export with column selector popover
│   │
│   └── insights/
│       ├── InsightCards.jsx              # 6 insight metric cards
│       ├── MonthlyComparisonChart.jsx    # Recharts BarChart — income vs expense per month
│       └── CategoryBreakdown.jsx         # Animated horizontal progress bars
│
├── pages/                       # Route-level components (all lazy-loaded)
│   ├── DashboardPage.jsx
│   ├── TransactionsPage.jsx
│   └── InsightsPage.jsx
│
├── guards/
│   └── RoleGuard.jsx            # Renders children only if role is in allowedRoles[]
│
├── utils/
│   ├── cn.js                    # clsx + tailwind-merge helper
│   ├── formatCurrency.js        # INR formatting via Intl.NumberFormat('en-IN')
│   ├── categoryColors.js        # Fixed category → colour token map
│   └── exportCsv.js             # PapaParse-based CSV download
│
└── constants/
    ├── roles.js                 # ROLES.ADMIN, ROLES.VIEWER
    └── queryKeys.js             # React Query cache key factories
```

---

## Features

### Dashboard overview
- **3 KPI summary cards** — Total Balance, Income, and Expenses. Each card shows an animated count-up number on load, a 7-day mini sparkline in the bottom corner, and a percentage change badge with an up/down arrow
- **Savings rate arc** — an animated circular arc beneath the cards that fills from green → amber → red depending on how much of your income is being saved. Communicates financial health before you read a single number
- **Balance trend chart** — Recharts `AreaChart` with gradient fills showing 6 months of income vs expense. Custom tooltip displays both values in INR. Dark-mode aware grid and axis colours
- **Spending donut** — Recharts `PieChart` with an active shape that enlarges on hover. Top 6 categories shown individually, remaining bucketed as "Other". Inline legend synced to hover state
- **Recent transactions** — last 7 transactions with category colour coding, merchant name, and a "View all →" link to the transactions page

### Transactions
- **Paginated table** — 10 rows per page with a smart pagination bar. Shows "Showing 1–10 of 81", prev/next arrows, and numbered page buttons with `…` ellipsis for large datasets. Resets to page 1 automatically when filters change
- **Sticky filter bar** — stays at the top of the viewport on scroll with backdrop blur so the table content slides beneath it cleanly
- **Responsive filter panel** — on desktop all filters show inline. On mobile, a "Filters" button with an active-count badge collapses/expands the full filter panel with a smooth height animation
- **Debounced search** — uses `useDeferredValue` to avoid querying on every keystroke while keeping the input instant
- **Date range picker** — quick-select: This month, Last 3 months, Last 6 months, This year
- **Category multi-select** — coloured checkboxes, selected categories shown as removable pills below the bar
- **Type toggle** — All / Income / Expense segmented control
- **Sort** — by Date or Amount, with direction toggle (ascending/descending)
- **Hover action strip** — on desktop, hovering a row slides in Edit and Delete icon buttons from the right. Visible only to Admins. Viewers always see just the amount
- **Add/Edit modal** — Income/Expense type toggle that changes the submit button colour. Full form validation with per-field error messages. Pre-populated when editing. Closes on Escape key. Scrollable on small screens
- **CSV export** — column selector popover lets you pick which fields to include. Exports only the currently filtered and searched dataset, not all 81 transactions

### Insights
- **6 insight cards** — Top spending category (with that category's own colour scheme), this month's expenses with MoM change badge, this month's income with MoM change badge, savings rate with contextual label (Excellent / Moderate / Watch out), average daily spend, and the single largest expense this month
- **Monthly comparison chart** — grouped `BarChart` showing income and expense bars side-by-side for each of the last 6 months. Tooltip shows both values plus a net savings/deficit calculation highlighted in green or red
- **Category breakdown** — horizontal progress bars animated from 0% on mount. Sorted by total spend descending. Each row shows category dot, name, INR amount, and percentage of total spend

### Role-based UI
- **Admin** — Add transaction button visible, Edit and Delete actions appear on row hover, full modal access
- **Viewer** — read-only table, no add/edit/delete, export still available. Action buttons hidden via `RoleGuard`
- **Role switcher** — segmented control at the bottom of the sidebar. Switches instantly via Zustand, no page reload. The topbar badge updates to reflect the current role

### UX & polish
- **Dark mode** — Tailwind `@variant dark` class strategy. Synced to OS preference (`prefers-color-scheme`) on first load, then persisted to `localStorage`. Toggle in the sidebar with an animated sun/moon icon swap. `color-scheme` property set on root so browser-native controls (date pickers, scrollbars) also adopt the correct theme
- **Skeleton loading** — every section has a dedicated shimmer skeleton that exactly matches the dimensions of the loaded component, preventing layout shift when data arrives
- **Empty states** — four contextual SVG illustrations with appropriate messages: no transactions, no search results, no chart data, no insights. Each has a fade-in entrance animation
- **Lazy loading** — all three pages are `React.lazy()` chunks. Only downloaded when first navigated to, keeping the initial bundle small
- **Page transitions** — Framer Motion fade + slide-up on every route change via `AnimatePresence`. Skipped entirely for users with `prefers-reduced-motion` enabled
- **Sidebar collapse** — spring-animated width transition (240px ↔ 72px) on desktop. In collapsed mode only icons show, with tooltip labels on hover. On mobile the sidebar becomes a full-height overlay drawer with a backdrop
- **`keepPreviousData` on queries** — filter and search changes never flash a blank table. Previous data stays visible until the new result set arrives
- **Category colour consistency** — `categoryColors.js` is the single source for every colour token. Food is always amber, Travel always violet, Bills always red — across the donut chart, transaction pills, breakdown bars, and insight cards

---

## Mock data

All 81 transactions live in `src/data/transactions.data.js`, covering **November 2024 – April 2025**. They include realistic Indian merchants and amounts:

| Category | Merchants |
|---|---|
| Salary / Income | Infosys (₹85,000/month), Upwork, Fiverr, Toptal, Contra |
| Food | Swiggy, Zomato, BigBasket, Zepto, Domino's, Barbeque Nation, Starbucks, Haldirams |
| Travel | Ola, Uber, Rapido, IRCTC, IndiGo, SpiceJet, MakeMyTrip, OYO |
| Bills | BESCOM electricity, Airtel broadband, Jio recharge, HDFC credit card, Tata Play |
| Shopping | Amazon, Flipkart, Myntra, Nykaa, Meesho, Zara, D-Mart |
| Health | Apollo Pharmacy, Cult Fit, Star Health Insurance, Manipal Hospital, Clove Dental |
| Entertainment | Netflix, Spotify, Amazon Prime, YouTube Premium, PVR, BookMyShow |
| Education | Udemy, Coursera, LinkedIn Premium, O'Reilly books |

Mutations (add/edit/delete) work in-memory for the session. Refreshing the page resets to the original 81 transactions.

---



## Built by

**Anant Jain**

- 🔗 LinkedIn: [linkedin.com/in/anantjain2208](https://linkedin.com/in/anantjain2208)
- 🐙 GitHub: [github.com/Anantjain-infinite](https://github.com/Anantjain-infinite)
- 📧 Email: [anantjain.works@gmail.com](mailto:anantjain.works@gmail.com)