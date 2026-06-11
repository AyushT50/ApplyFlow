import { NavLink } from "react-router-dom"
import { 
  LayoutDashboard, 
  FileText, 
  Mail, 
  Building2, 
  Send, 
  MessageSquare, 
  Bell, 
  Settings, 
  Megaphone,
  Briefcase,
  X
} from "lucide-react"
import { cn } from "../lib/utils"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard, exact: true },
    { name: "Campaigns", path: "/dashboard/campaigns", icon: Megaphone },
    { name: "Resume", path: "/dashboard/resume", icon: FileText },
    { name: "Templates", path: "/dashboard/templates", icon: Mail },
    { name: "Companies", path: "/dashboard/companies", icon: Building2 },
    { name: "Send Applications", path: "/dashboard/send", icon: Send },
    { name: "Replies", path: "/dashboard/replies", icon: MessageSquare },
    { name: "Notifications", path: "/dashboard/notifications", icon: Bell },
    { name: "Settings", path: "/dashboard/settings", icon: Settings },
  ]

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/45 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={cn(
          "fixed top-0 bottom-0 left-0 z-45 w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-transform duration-300 md:static md:translate-x-0 flex flex-col justify-between",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div>
          {/* Header Branding */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-gray-100 dark:border-gray-850">
            <div className="flex items-center space-x-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md shadow-blue-500/20">
                <Briefcase className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Apply<span className="text-blue-600">Flow</span>
              </span>
            </div>
            {/* Close button for mobile */}
            <button 
              onClick={onClose}
              className="p-1 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white md:hidden cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 px-4 py-6">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.exact}
                onClick={onClose}
                className={({ isActive }) => 
                  cn(
                    "flex items-center space-x-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all duration-205 cursor-pointer group",
                    isActive 
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm border border-blue-100/50 dark:border-blue-900/30" 
                      : "text-gray-650 hover:bg-gray-50 dark:text-gray-405 dark:hover:bg-gray-800/60 border border-transparent hover:border-gray-100 dark:hover:border-gray-800/80"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={cn(
                      "h-5 w-5 transition-transform duration-200 group-hover:scale-110",
                      isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                    )} />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer info / Sign out */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-850">
          <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/40">
            <div className="relative h-9 w-9 rounded-full overflow-hidden bg-gray-200">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&h=256&fit=crop" 
                alt="Profile" 
                className="object-cover h-full w-full"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-950 dark:text-white truncate">Alex Jobseeker</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">Free Plan</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
