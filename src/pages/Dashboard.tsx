import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { 
  Send, 
  MessageSquare, 
  Clock, 
  Percent, 
  ArrowRight, 
  Megaphone, 
  FileUp, 
  Mail, 
  CheckCircle, 
  TrendingUp 
} from "lucide-react"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"

interface StoredCampaign {
  sent?: number
  replies?: number
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    sent: 172,
    replies: 48,
    pending: 96,
    rate: "27.9%"
  })

  // Load state if modified locally
  useEffect(() => {
    const campaigns = JSON.parse(localStorage.getItem('applyflow_campaigns') || '[]');
    
    let totalSent = 172;
    let totalReplies = 48;
    
    if (campaigns.length > 0) {
      totalSent = (campaigns as StoredCampaign[]).reduce((acc, cur) => acc + (cur.sent || 0), 0);
      totalReplies = (campaigns as StoredCampaign[]).reduce((acc, cur) => acc + (cur.replies || 0), 0);
    }
    
    const pendingCount = Math.max(0, totalSent - totalReplies);
    const rateCalc = totalSent > 0 ? ((totalReplies / totalSent) * 100).toFixed(1) + "%" : "0%";
    
    setStats({
      sent: totalSent,
      replies: totalReplies,
      pending: pendingCount,
      rate: rateCalc
    });
  }, []);

  const weeklyData = [
    { day: "Mon", sent: 12 },
    { day: "Tue", sent: 28 },
    { day: "Wed", sent: 35 },
    { day: "Thu", sent: 20 },
    { day: "Fri: ", sent: 48 },
    { day: "Sat", sent: 15 },
    { day: "Sun", sent: 14 }
  ]

  const pieData = [
    { name: "Replies Received", value: stats.replies, color: "#2563EB" }, // Blue
    { name: "Pending", value: stats.pending, color: "#F59E0B" },         // Orange
    { name: "Rejections", value: 28, color: "#EF4444" }                  // Red
  ]

  const recentReplies = [
    { id: 1, company: "Stripe", sender: "recruiters@stripe.com", date: "Today, 2:14 PM", status: "Interview Requested" },
    { id: 2, company: "Vercel", sender: "careers@vercel.com", date: "Yesterday, 10:45 AM", status: "Followup Required" },
    { id: 3, company: "Linear", sender: "jobs@linear.app", date: "June 9", status: "Rejected" },
  ]

  const recentActivity = [
    { id: 1, msg: "Dispatched Q2 Software Engineer Campaign", time: "2 hours ago" },
    { id: 2, msg: "New resume version Active: Alex_Jobseeker_CV.pdf", time: "1 day ago" },
    { id: 3, msg: "Imported 18 companies from CSV", time: "3 days ago" },
  ]

  return (
    <div className="space-y-6 font-sans">
      
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-xl border border-blue-100 dark:border-blue-900/35 bg-gradient-to-r from-blue-50/50 via-white to-blue-50/20 dark:from-blue-950/20 dark:via-gray-900 dark:to-gray-900 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-gray-950 dark:text-white">Welcome back, Alex!</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Your automations are running smoothly. You have received 3 new replies today.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-2.5">
          <Badge variant="success" className="py-1 px-3">
            <CheckCircle className="h-3 w-3 mr-1 fill-emerald-500 text-white dark:fill-transparent" />
            <span>Gmail Connected</span>
          </Badge>
          <Badge variant="secondary" className="py-1 px-3">
            <span>Free Tier</span>
          </Badge>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Applications Sent", value: stats.sent, icon: Send, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/45 dark:text-blue-400" },
          { label: "Total Replies Received", value: stats.replies, icon: MessageSquare, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/45 dark:text-emerald-400" },
          { label: "Pending Responses", value: stats.pending, icon: Clock, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/45 dark:text-amber-400" },
          { label: "Response Rate %", value: stats.rate, icon: Percent, color: "text-indigo-650 bg-indigo-50 dark:bg-indigo-950/45 dark:text-indigo-400" },
        ].map((item, idx) => (
          <Card key={idx} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-450 dark:text-gray-400 uppercase tracking-wider">{item.label}</p>
                <p className="text-3xl font-black text-gray-950 dark:text-white">{item.value}</p>
              </div>
              <div className={`h-11 w-11 rounded-lg flex items-center justify-center ${item.color}`}>
                <item.icon className="h-5.5 w-5.5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Send Bar Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center space-x-2">
              <TrendingUp className="h-4.5 w-4.5 text-blue-600" />
              <span>Weekly Dispatch Flow</span>
            </CardTitle>
            <CardDescription className="text-xs">Number of job application emails sent daily over the past week</CardDescription>
          </CardHeader>
          <CardContent className="h-[270px] min-h-[270px] min-w-0">
            <ResponsiveContainer width="100%" height={240} minWidth={0}>
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: "rgba(37, 99, 235, 0.05)" }} />
                <Bar dataKey="sent" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Funnel Response Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold">Response Distribution</CardTitle>
            <CardDescription className="text-xs">Outcomes of sent application outreach</CardDescription>
          </CardHeader>
          <CardContent className="h-[270px] min-h-[270px] min-w-0 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={150} minWidth={0}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Pie Legends */}
            <div className="w-full mt-4 space-y-1.5 text-xs">
              {pieData.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center px-4">
                  <div className="flex items-center space-x-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                  </div>
                  <span className="font-bold text-gray-950 dark:text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity, Replies, Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Replies */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">Recruiter Responses Inbox</CardTitle>
              <CardDescription className="text-xs">Latest emails categorized from company contacts</CardDescription>
            </div>
            <button 
              onClick={() => navigate("/dashboard/replies")}
              className="text-xs font-semibold text-blue-650 dark:text-blue-400 hover:underline flex items-center cursor-pointer"
            >
              <span>View Inbox</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentReplies.map((reply) => (
              <div 
                key={reply.id} 
                className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3 last:border-0 last:pb-0 text-xs"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-9 w-9 bg-gray-50 dark:bg-gray-800 border border-gray-150 dark:border-gray-750 flex items-center justify-center rounded-lg font-bold text-blue-600">
                    {reply.company.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-950 dark:text-white">{reply.company}</p>
                    <p className="text-[10px] text-gray-450 dark:text-gray-400">{reply.sender}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge 
                    variant={
                      reply.status.includes("Interview") 
                        ? "success" 
                        : reply.status.includes("Followup") 
                        ? "warning" 
                        : "destructive"
                    }
                  >
                    {reply.status}
                  </Badge>
                  <span className="text-[10px] text-gray-400">{reply.date}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions Panel */}
        <Card className="flex flex-col justify-between">
          <div>
            <CardHeader>
              <CardTitle className="text-base font-bold">Quick Actions</CardTitle>
              <CardDescription className="text-xs">Direct workflow shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <button 
                onClick={() => navigate("/dashboard/campaigns")}
                className="flex w-full items-center space-x-3 rounded-lg border border-gray-150 dark:border-gray-800 p-3 hover:bg-gray-50 dark:hover:bg-gray-850/60 text-left text-xs cursor-pointer group"
              >
                <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                  <Megaphone className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-bold text-gray-950 dark:text-white group-hover:text-blue-600 transition-colors">Start Campaign</p>
                  <p className="text-[10px] text-gray-500">Configure new outreach push</p>
                </div>
              </button>

              <button 
                onClick={() => navigate("/dashboard/resume")}
                className="flex w-full items-center space-x-3 rounded-lg border border-gray-150 dark:border-gray-805 p-3 hover:bg-gray-50 dark:hover:bg-gray-850/60 text-left text-xs cursor-pointer group"
              >
                <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                  <FileUp className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-bold text-gray-950 dark:text-white group-hover:text-emerald-600 transition-colors">Upload Resume</p>
                  <p className="text-[10px] text-gray-500">Add or parse new PDF</p>
                </div>
              </button>

              <button 
                onClick={() => navigate("/dashboard/templates")}
                className="flex w-full items-center space-x-3 rounded-lg border border-gray-150 dark:border-gray-805 p-3 hover:bg-gray-50 dark:hover:bg-gray-850/60 text-left text-xs cursor-pointer group"
              >
                <div className="h-8 w-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-bold text-gray-950 dark:text-white group-hover:text-purple-600 transition-colors">Edit Templates</p>
                  <p className="text-[10px] text-gray-500">Modify email drafting variables</p>
                </div>
              </button>
            </CardContent>
          </div>

          <div className="p-6 pt-0 border-t border-gray-50 dark:border-gray-850 mt-4">
            <h4 className="text-xs font-bold text-gray-950 dark:text-white mb-2">Recent Logs</h4>
            <div className="space-y-2">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex justify-between text-[11px] text-gray-500 dark:text-gray-450">
                  <span className="truncate max-w-[170px]">{activity.msg}</span>
                  <span>{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

    </div>
  )
}
