import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { 
  Megaphone, 
  Plus, 
  Play, 
  Pause, 
  Calendar,
  AlertCircle,
  MoreVertical
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog"
import { Input, Label } from "../components/ui/input"
import { supabaseService } from "../services/supabase"

interface Campaign {
  id: string
  name: string
  status: "Running" | "Paused" | "Completed" | "Draft"
  sent: number
  replies: number
  responseRate: string
  dateCreated: string
}

interface SelectOption {
  id: string
  name: string
  status?: string
}

const isCampaignStatus = (status: string): status is Campaign["status"] =>
  ["Running", "Paused", "Completed", "Draft"].includes(status)

const toCampaign = (campaign: {
  id: string
  name: string
  status: string
  sent: number
  replies: number
  responseRate: string
  dateCreated: string
}): Campaign => ({
  ...campaign,
  status: isCampaignStatus(campaign.status) ? campaign.status : "Draft"
})

export default function Campaigns() {
  const navigate = useNavigate()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [newCampaignName, setNewCampaignName] = useState("")
  
  // Selection options (mocks)
  const [resumes, setResumes] = useState<SelectOption[]>([])
  const [templates, setTemplates] = useState<SelectOption[]>([])
  const [selectedResume, setSelectedResume] = useState("1")
  const [selectedTemplate, setSelectedTemplate] = useState("t1")

  // Load from Supabase mock database
  useEffect(() => {
    async function loadCampaigns() {
      const { data } = await supabaseService.db.campaigns.select()
      if (data) setCampaigns(data.map(toCampaign))
    }
    loadCampaigns()

    const storedResumes = JSON.parse(localStorage.getItem('applyflow_resumes') || '[]');
    if (storedResumes.length > 0) setResumes(storedResumes);
    else setResumes([{ id: "1", name: "Alex_Jobseeker_CV.pdf" }]);

    const storedTemplates = JSON.parse(localStorage.getItem('applyflow_templates') || '[]');
    if (storedTemplates.length > 0) setTemplates(storedTemplates);
    else setTemplates([{ id: "t1", name: "Software Engineer Application" }]);
  }, [])

  const handleToggleStatus = (id: string) => {
    const updated: Campaign[] = campaigns.map((campaign) => {
      if (campaign.id === id) {
        const nextStatus: Campaign["status"] = campaign.status === "Running" ? "Paused" : "Running"
        return { ...campaign, status: nextStatus }
      }
      return campaign
    })
    setCampaigns(updated)
    localStorage.setItem("applyflow_campaigns", JSON.stringify(updated))
  }

  const handleCreateCampaign = async () => {
    if (!newCampaignName.trim()) return

    const { data } = await supabaseService.db.campaigns.insert({
      name: newCampaignName,
      status: "Draft",
      sent: 0,
      replies: 0
    })

    if (data) {
      setCampaigns([toCampaign(data), ...campaigns])
    }
    
    setNewCampaignName("")
    setShowAddModal(false)
  }

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-950 dark:text-white">Email Outreach Campaigns</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Build, dispatch, and track automated email campaigns targeting specific company groups.
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="flex items-center space-x-2 shrink-0">
          <Plus className="h-4 w-4" />
          <span>New Campaign</span>
        </Button>
      </div>

      {/* Campaigns Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Campaigns", val: campaigns.length, sub: "All time creations", color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40" },
          { label: "Active", val: campaigns.filter(c => c.status === "Running").length, sub: "Running automation loops", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40" },
          { label: "Paused / Drafts", val: campaigns.filter(c => c.status === "Paused" || c.status === "Draft").length, sub: "Requiring configuration/activation", color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40" },
          { label: "Completed", val: campaigns.filter(c => c.status === "Completed").length, sub: "All recipients processed", color: "text-purple-650 bg-purple-50 dark:bg-purple-950/40" },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-450 dark:text-gray-405 uppercase">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-950 dark:text-white mt-1">{stat.val}</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">{stat.sub}</p>
              </div>
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center font-bold ${stat.color}`}>
                <Megaphone className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Campaigns List Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold">Manage Campaigns</CardTitle>
          <CardDescription className="text-xs">Start, pause, edit, or check performance metrics of your cold outreach lists</CardDescription>
        </CardHeader>
        <CardContent>
          {campaigns.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
              <Megaphone className="h-10 w-10 text-gray-350 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">No campaigns found</p>
              <p className="text-xs text-gray-550 dark:text-gray-400 mt-1">Create your first automated email campaign to start reaching out.</p>
              <Button onClick={() => setShowAddModal(true)} variant="outline" className="mt-4">
                Create Campaign
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-150 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-850/30">
                    <th className="p-4 font-semibold text-gray-500 dark:text-gray-405">Campaign Name</th>
                    <th className="p-4 font-semibold text-gray-500 dark:text-gray-405">Status</th>
                    <th className="p-4 font-semibold text-gray-550 text-center dark:text-gray-405">Emails Sent</th>
                    <th className="p-4 font-semibold text-gray-550 text-center dark:text-gray-405">Replies</th>
                    <th className="p-4 font-semibold text-gray-550 text-center dark:text-gray-405">Response Rate</th>
                    <th className="p-4 font-semibold text-gray-550 dark:text-gray-405">Date Created</th>
                    <th className="p-4 font-semibold text-gray-500 text-center dark:text-gray-405">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/20">
                      <td className="p-4">
                        <div className="font-semibold text-gray-950 dark:text-white">{campaign.name}</div>
                        <div className="text-[10px] text-gray-450 dark:text-gray-400 mt-0.5">ID: {campaign.id}</div>
                      </td>
                      <td className="p-4">
                        <Badge 
                          variant={
                            campaign.status === "Running" 
                              ? "success" 
                              : campaign.status === "Paused" 
                              ? "warning" 
                              : campaign.status === "Completed"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {campaign.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-center font-bold text-gray-700 dark:text-gray-300">{campaign.sent}</td>
                      <td className="p-4 text-center font-bold text-gray-700 dark:text-gray-300">{campaign.replies}</td>
                      <td className="p-4 text-center font-bold text-gray-700 dark:text-gray-300">{campaign.responseRate}</td>
                      <td className="p-4 text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{campaign.dateCreated}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          {(campaign.status === "Running" || campaign.status === "Paused") && (
                            <button
                              onClick={() => handleToggleStatus(campaign.id)}
                              className="p-1.5 rounded-md border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-900 dark:hover:text-white cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                              title={campaign.status === "Running" ? "Pause Campaign" : "Resume Campaign"}
                            >
                              {campaign.status === "Running" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                            </button>
                          )}
                          {campaign.status === "Draft" && (
                            <Button 
                              size="sm" 
                              className="px-2.5 h-8"
                              onClick={() => navigate("/dashboard/send")}
                            >
                              <Play className="h-3 w-3 mr-1 fill-white" />
                              <span>Dispatch</span>
                            </Button>
                          )}
                          <button 
                            onClick={() => navigate("/dashboard/send")}
                            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-555 cursor-pointer"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Campaign Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent onClose={() => setShowAddModal(false)}>
          <DialogHeader>
            <DialogTitle>Create New Outreach Campaign</DialogTitle>
            <DialogDescription>Setup your target mailing list, resume, and template configurations.</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-3">
            <div className="space-y-1.5">
              <Label htmlFor="camp-name">Campaign Name</Label>
              <Input 
                id="camp-name" 
                placeholder="e.g. Q3 React Roles - Germany" 
                value={newCampaignName}
                onChange={(e) => setNewCampaignName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="camp-resume">Attach Resume</Label>
                <select 
                  id="camp-resume"
                  className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white"
                  value={selectedResume}
                  onChange={(e) => setSelectedResume(e.target.value)}
                >
                  {resumes.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="camp-temp">Select Template</Label>
                <select 
                  id="camp-temp"
                  className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white"
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                >
                  {templates.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-3 bg-blue-50/45 dark:bg-blue-950/15 border border-blue-100/40 dark:border-blue-900/30 rounded-lg flex items-start space-x-2.5 text-xs text-blue-700 dark:text-blue-400">
              <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Awaiting Dispatch: </span>
                This campaign will be saved as a <span className="font-bold">Draft</span>. You can select recipient groups and dispatch it on the "Send Applications" page.
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button onClick={handleCreateCampaign}>Create Draft</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
