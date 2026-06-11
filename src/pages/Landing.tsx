import { useNavigate } from "react-router-dom"
import { 
  ArrowRight, 
  Send, 
  Layers, 
  Zap, 
  Mail, 
  Bot, 
  Sparkles,
  Globe
} from "lucide-react"
import { Button } from "../components/ui/button"

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-900 bg-white/75 dark:bg-gray-950/75 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md shadow-blue-500/25">
              <Send className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-950 dark:text-white">
              Apply<span className="text-blue-600">Flow</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-650 dark:text-gray-400">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#workflow" className="hover:text-blue-600 transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate("/login")}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 cursor-pointer"
            >
              Sign In
            </button>
            <Button onClick={() => navigate("/login")} className="shadow-lg shadow-blue-600/15">
              Get Started Free
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden border-b border-gray-150 dark:border-gray-900">
        <div className="max-w-7xl mx-auto px-6 relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column */}
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-950/40 border border-blue-150/40 dark:border-blue-900/40 rounded-full px-3 py-1.5 text-xs text-blue-650 dark:text-blue-400 font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Next-gen outreach automation for job seekers</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-gray-950 dark:text-white">
              Automate your job hunt, <br className="hidden sm:inline"/>
              <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">land more interviews.</span>
            </h1>

            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl">
              ApplyFlow drafts tailored, high-converting outreach emails using your resume metadata, automates sending via Gmail API, and classifies recruiter replies in one seamless SaaS platform.
            </p>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Button size="lg" onClick={() => navigate("/login")} className="flex items-center justify-center space-x-2 shadow-xl shadow-blue-600/25">
                <span>Start Automation Campaign</span>
                <ArrowRight className="h-4.5 w-4.5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/login")}>
                View Demo Dashboard
              </Button>
            </div>

            <div className="flex items-center space-x-8 pt-4">
              <div className="flex -space-x-2.5">
                {[
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=64&h=64&fit=crop",
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=64&h=64&fit=crop",
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=64&h=64&fit=crop",
                ].map((src, i) => (
                  <img key={i} src={src} className="h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-950 object-cover" alt="User" />
                ))}
              </div>
              <p className="text-xs text-gray-550 dark:text-gray-400 font-medium">
                Join <span className="font-bold text-gray-900 dark:text-white">1,500+ developers</span> currently tracking application replies.
              </p>
            </div>
          </div>

          {/* Right Column: App Mockup Preview */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-2xl blur-lg opacity-20 dark:opacity-30" />
            <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl p-4 w-full max-w-lg">
              
              {/* Mock App Window Header */}
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3 mb-4">
                <div className="flex space-x-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div className="bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-850 px-6 py-0.5 rounded-md text-[10px] text-gray-400">
                  applyflow.io/dashboard
                </div>
                <div className="w-6" />
              </div>

              {/* Mock App Content */}
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-blue-50/50 dark:bg-blue-950/15 border border-blue-100/30 dark:border-blue-900/20 p-3 rounded-lg">
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">Spring Software Engineer Campaign</h4>
                    <p className="text-[10px] text-gray-450 dark:text-gray-400 mt-0.5">Dispatched via Gmail OAuth</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 font-bold">Active</span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Emails Sent", val: "148" },
                    { label: "Replies", val: "42" },
                    { label: "Response Rate", val: "28.3%" },
                  ].map((stat, i) => (
                    <div key={i} className="border border-gray-100 dark:border-gray-800 p-2.5 rounded-lg text-center">
                      <p className="text-[10px] text-gray-450 dark:text-gray-400">{stat.label}</p>
                      <p className="text-base font-bold text-gray-950 dark:text-white mt-0.5">{stat.val}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2.5">
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">Recent Activities</p>
                  {[
                    { company: "Stripe", status: "Replied", time: "10 mins ago", color: "bg-emerald-100 text-emerald-800" },
                    { company: "Vercel", status: "Pending", time: "1 hour ago", color: "bg-amber-100 text-amber-800" },
                    { company: "Airbnb", status: "Sent", time: "3 hours ago", color: "bg-blue-105 text-blue-800" },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-xs border-b border-gray-50 dark:border-gray-850 pb-2">
                      <div className="flex items-center space-x-2">
                        <div className="h-6.5 w-6.5 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-750 flex items-center justify-center font-bold text-[10px] text-blue-600">
                          {item.company.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-gray-200">{item.company}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${item.color}`}>
                          {item.status}
                        </span>
                        <span className="text-[10px] text-gray-400">{item.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
          <div className="space-y-3 max-w-xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600">Built for Smart Job Seekers</h2>
            <p className="text-3xl font-bold text-gray-950 dark:text-white">Supercharge your application workflows</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Everything you need to bypass recruiter portals and reach direct hiring managers at scale.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Gmail Integration", desc: "Connect your custom professional email directly via secure Google OAuth2 API to avoid spam filters.", icon: Mail },
              { title: "Dynamic Variable Fields", desc: "Inject specific values like {{company}}, {{position}}, and {{name}} automatically for high personalization.", icon: Layers },
              { title: "Inbox Tracking", desc: "Our platform processes incoming email replies, categorizes recruiter feedback, and updates dashboards.", icon: Bot },
              { title: "Campaign Scheduling", desc: "Select template configurations and trigger custom intervals to send application batches smoothly.", icon: Zap },
            ].map((feature, i) => (
              <div key={i} className="border border-gray-200 dark:border-gray-800/80 p-6 rounded-xl text-left bg-gray-50/50 dark:bg-gray-900 hover:shadow-lg transition-all duration-300">
                <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 text-blue-650 dark:text-blue-400 flex items-center justify-center rounded-lg mb-4">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base text-gray-950 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-200 dark:border-gray-900 bg-white dark:bg-gray-950 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-blue-600 text-white font-bold text-xs">A</div>
            <span className="text-sm font-bold text-gray-950 dark:text-white">ApplyFlow UI v1.0</span>
          </div>
          <p className="text-xs text-gray-450 dark:text-gray-500 mt-4 md:mt-0">
            © 2026 ApplyFlow. Built with React, TypeScript, and Tailwind CSS v4. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-450 hover:text-gray-900 dark:hover:text-white"><Globe className="h-4.5 w-4.5" /></a>
          </div>
        </div>
      </footer>

    </div>
  )
}
