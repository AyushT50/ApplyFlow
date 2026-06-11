import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { 
  Bell, 
  Search, 
  Sun, 
  Moon, 
  Menu, 
  User, 
  LogOut, 
  Settings as SettingsIcon,
  Circle
} from "lucide-react"
import { cn } from "../lib/utils"

interface NavbarProps {
  onToggleSidebar: () => void
  darkMode: boolean
  onToggleDarkMode: () => void
}

export default function Navbar({ onToggleSidebar, darkMode, onToggleDarkMode }: NavbarProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Get readable page name from route
  const getPageTitle = () => {
    const path = location.pathname
    if (path.endsWith("/dashboard")) return "Dashboard"
    if (path.includes("/campaigns")) return "Campaigns"
    if (path.includes("/resume")) return "Resume Upload"
    if (path.includes("/templates")) return "Email Templates"
    if (path.includes("/companies")) return "Companies Database"
    if (path.includes("/send")) return "Send Applications"
    if (path.includes("/replies")) return "Reply Inbox"
    if (path.includes("/notifications")) return "Notification Settings"
    if (path.includes("/settings")) return "Settings"
    return "ApplyFlow"
  }

  // Handle Logout
  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false")
    navigate("/")
  }

  const notifications = [
    { id: 1, title: "Reply from Microsoft Recruiter", desc: "Response status changed to 'Replied'", time: "5 mins ago", unread: true },
    { id: 2, title: "Campaign Dispatched", desc: "Sent outreach to 12 companies successfully", time: "2 hours ago", unread: false },
    { id: 3, title: "Resume Parsed", desc: "Skills: React, TypeScript, Tailwind parsed successfully", time: "1 day ago", unread: false },
  ]

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-6 shadow-sm">
      {/* Left items: menu toggle & breadcrumbs */}
      <div className="flex items-center space-x-4">
        <button 
          onClick={onToggleSidebar}
          className="p-1 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white md:hidden cursor-pointer"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Page title / Breadcrumbs */}
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Right items: search, theme, notifications, user profile */}
      <div className="flex items-center space-x-3.5">
        {/* Search Input (Desktop) */}
        <div className="relative hidden sm:block w-48 lg:w-64">
          <Search className="absolute top-2.5 left-3 h-4.5 w-4.5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search dashboard..."
            className="w-full h-9 rounded-md border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-950 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-800 dark:bg-gray-905 dark:text-gray-50 dark:placeholder:text-gray-400"
          />
        </div>

        {/* Dark Mode Switcher */}
        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          aria-label="Toggle Dark Mode"
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Notifications Icon & Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications)
              setShowProfileMenu(false)
            }}
            className="relative p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-gray-900" />
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-2.5 w-80 z-40 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-2 shadow-lg">
                <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 mb-1 flex items-center justify-between">
                  <span className="font-semibold text-sm text-gray-900 dark:text-white">Recent Alerts</span>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">Mark all read</span>
                </div>
                <div className="space-y-1">
                  {notifications.map((item) => (
                    <div 
                      key={item.id} 
                      className={cn(
                        "p-2.5 rounded-md text-xs cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/60 flex items-start space-x-2",
                        item.unread && "bg-blue-50/45 dark:bg-blue-900/10"
                      )}
                    >
                      {item.unread && <Circle className="h-2 w-2 text-blue-600 fill-blue-600 mt-1.5 flex-shrink-0" />}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-950 dark:text-white">{item.title}</p>
                        <p className="text-gray-500 dark:text-gray-400 mt-0.5">{item.desc}</p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu)
              setShowNotifications(false)
            }}
            className="flex items-center space-x-2 cursor-pointer focus:outline-none"
          >
            <div className="h-8.5 w-8.5 rounded-full overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm bg-gray-150">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&h=256&fit=crop" 
                alt="Avatar" 
                className="h-full w-full object-cover"
              />
            </div>
          </button>

          {showProfileMenu && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowProfileMenu(false)} />
              <div className="absolute right-0 mt-2.5 w-52 z-40 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-1.5 shadow-lg">
                <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-805 mb-1">
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">Alex Jobseeker</p>
                  <p className="text-[11px] text-gray-550 dark:text-gray-400 truncate">alex.jobseeker@gmail.com</p>
                </div>
                <button
                  onClick={() => {
                    setShowProfileMenu(false)
                    navigate("/dashboard/settings")
                  }}
                  className="flex w-full items-center space-x-2.5 rounded-md px-3 py-2 text-left text-xs hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  <User className="h-4 w-4" />
                  <span>My Profile</span>
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false)
                    navigate("/dashboard/settings")
                  }}
                  className="flex w-full items-center space-x-2.5 rounded-md px-3 py-2 text-left text-xs hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  <SettingsIcon className="h-4 w-4" />
                  <span>Account Settings</span>
                </button>
                <div className="border-t border-gray-100 dark:border-gray-805 my-1" />
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center space-x-2.5 rounded-md px-3 py-2 text-left text-xs text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
