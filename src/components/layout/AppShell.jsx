import { DesktopSidebar, MobileSidebar } from './Sidebar'
import Topbar from './Topbar'

export default function AppShell({ children }) {
  return (
    <div className="flex min-h-[100dvh] bg-zinc-50 dark:bg-zinc-950">
      <DesktopSidebar />
      <MobileSidebar />

      <div className="flex flex-col flex-1 min-w-0 h-[100dvh]">
        <Topbar />

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
