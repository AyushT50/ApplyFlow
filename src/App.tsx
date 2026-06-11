import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom"
import Sidebar from "./components/Sidebar"
import Navbar from "./components/Navbar"
import Landing from "./pages/Landing"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Campaigns from "./pages/Campaigns"
import Resume from "./pages/Resume"
import Templates from "./pages/Templates"
import Companies from "./pages/Companies"
import Send from "./pages/Send"
import Replies from "./pages/Replies"
import Notifications from "./pages/Notifications"
import Settings from "./pages/Settings"

// Protected Layout Wrapper Component
function DashboardLayout({ 
  darkMode, 
  onToggleDarkMode 
}: { 
  darkMode: boolean
  onToggleDarkMode: () => void 
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  
  // Check login status
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"

  if (!isLoggedIn) {
    // Redirect to login but save current location
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Pane */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <Navbar 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          darkMode={darkMode}
          onToggleDarkMode={onToggleDarkMode}
        />
        
        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto px-6 py-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  const [darkMode, setDarkMode] = useState(false)

  // Initialize Dark Mode setting from system preferences or localstorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    
    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      setDarkMode(true)
      document.documentElement.classList.add("dark")
    } else {
      setDarkMode(false)
      document.documentElement.classList.remove("dark")
    }
  }, [])

  const handleToggleDarkMode = () => {
    if (darkMode) {
      setDarkMode(false)
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    } else {
      setDarkMode(true)
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    }
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard Pages */}
        <Route path="/dashboard" element={<DashboardLayout darkMode={darkMode} onToggleDarkMode={handleToggleDarkMode} />}>
          <Route index element={<Dashboard />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="resume" element={<Resume />} />
          <Route path="templates" element={<Templates />} />
          <Route path="companies" element={<Companies />} />
          <Route path="send" element={<Send />} />
          <Route path="replies" element={<Replies />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings darkMode={darkMode} onToggleDarkMode={handleToggleDarkMode} />} />
        </Route>

        {/* Catch-all redirect to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
