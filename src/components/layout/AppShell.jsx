import { DesktopSidebar, MobileSidebar } from './Sidebar'
import Topbar from './Topbar'

export default function AppShell({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      <DesktopSidebar />
      <MobileSidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto overscroll-contain">
          {children}
        </main>
      </div>
    </div>
  )
}
