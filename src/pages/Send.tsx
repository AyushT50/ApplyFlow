import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { 
  FileText, 
  Mail, 
  Building2, 
  Play, 
  CheckCircle2, 
  AlertTriangle,
  Loader2,
  CheckCircle,
  Megaphone
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Progress } from "../components/ui/progress"
import { Label } from "../components/ui/input"

interface Resume {
  id: string
  name: string
  status: string
}

interface Template {
  id: string
  name: string
  subject: string
}

interface Company {
  id: string
  name: string
  email: string
  status: string
  dateSent: string
}

interface Campaign {
  id: string
  name: string
  status?: string
  sent?: number
  replies?: number
  dateCreated?: string
}

export default function Send() {
  const navigate = useNavigate()
  
  // Selections
  const [resumes, setResumes] = useState<Resume[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  
  const [activeCampaign, setActiveCampaign] = useState("")
  const [campaigns, setCampaigns] = useState<Campaign[]>([])

  const [selectedResumeId, setSelectedResumeId] = useState("")
  const [selectedTemplateId, setSelectedTemplateId] = useState("")
  const [targetScope, setTargetScope] = useState("unsent") // "unsent" | "all"

  // Campaign running state
  const [isSending, setIsSending] = useState(false)
  const [progress, setProgress] = useState(0)
  const [sendLogs, setSendLogs] = useState<string[]>([])
  const [sendSummary, setSendSummary] = useState<{ total: number; sent: number; errors: number } | null>(null)

  useEffect(() => {
    // Load from local storage
    const storedResumes = JSON.parse(localStorage.getItem("applyflow_resumes") || "[]")
    const storedTemplates = JSON.parse(localStorage.getItem("applyflow_templates") || "[]")
    const storedCompanies = JSON.parse(localStorage.getItem("applyflow_companies") || "[]")
    const storedCampaigns = JSON.parse(localStorage.getItem("applyflow_campaigns") || "[]")

    setResumes(storedResumes)
    setTemplates(storedTemplates)
    setCompanies(storedCompanies)
    setCampaigns(storedCampaigns)

    // Set defaults
    if (storedResumes.length > 0) {
      const active = (storedResumes as Resume[]).find((r) => r.status === "Active") || storedResumes[0]
      setSelectedResumeId(active.id)
    }
    if (storedTemplates.length > 0) {
      setSelectedTemplateId(storedTemplates[0].id)
    }
    if (storedCampaigns.length > 0) {
      setActiveCampaign(storedCampaigns[0].id)
    }
  }, [])

  // Calculate target recipient count
  const getRecipients = () => {
    if (targetScope === "unsent") {
      return companies.filter(c => c.status !== "Sent")
    }
    return companies
  }

  const recipients = getRecipients()

  // Dispatch outreach sequence
  const handleStartOutreach = () => {
    if (recipients.length === 0 || isSending) return

    setIsSending(true)
    setProgress(0)
    setSendLogs([])
    setSendSummary(null)

    let index = 0
    const totalRecipients = recipients.length
    const updateLogs: string[] = []

    const interval = setInterval(() => {
      if (index >= totalRecipients) {
        clearInterval(interval)
        setIsSending(false)
        setSendSummary({ total: totalRecipients, sent: totalRecipients, errors: 0 })
        
        // Update local storage status
        const dateStr = new Date().toISOString().split("T")[0]
        const updatedCompanies = companies.map((comp) => {
          const isTarget = targetScope === "all" || comp.status !== "Sent"
          if (isTarget) {
            return { 
              ...comp, 
              status: "Sent" as const, 
              dateSent: dateStr, 
              responseStatus: "Pending" as const 
            }
          }
          return comp
        })
        
        localStorage.setItem("applyflow_companies", JSON.stringify(updatedCompanies))

        // Update campaign statistics
        const updatedCampaigns = campaigns.map((camp) => {
          if (camp.id === activeCampaign) {
            return {
              ...camp,
              status: "Running" as const,
              sent: (camp.sent || 0) + totalRecipients,
              dateCreated: dateStr
            }
          }
          return camp
        })
        localStorage.setItem("applyflow_campaigns", JSON.stringify(updatedCampaigns))

        return
      }

      const currentCompany = recipients[index]
      const logMessage = `Sending application to ${currentCompany.name} (${currentCompany.email})... Success!`
      
      updateLogs.push(logMessage)
      setSendLogs([...updateLogs])
      
      index++
      setProgress(Math.round((index / totalRecipients) * 100))
    }, 900)
  }

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-950 dark:text-white">Dispatch Engine</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Review outreach parameter checklists, attach active items, and fire automated email outreach campaigns.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left pane: Options config & summary review */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">Campaign Dispatch Config</CardTitle>
              <CardDescription className="text-xs">Select assets to include in this send job</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Campaign Picker */}
              <div className="space-y-1.5">
                <Label htmlFor="send-campaign">Select Campaign scope</Label>
                <select 
                  id="send-campaign"
                  className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white"
                  value={activeCampaign}
                  onChange={(e) => setActiveCampaign(e.target.value)}
                  disabled={isSending}
                >
                  {campaigns.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Resume Picker */}
                <div className="space-y-1.5">
                  <Label htmlFor="send-resume">Attach PDF CV</Label>
                  <select 
                    id="send-resume"
                    className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white"
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
                    disabled={isSending}
                  >
                    {resumes.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>

                {/* Template Picker */}
                <div className="space-y-1.5">
                  <Label htmlFor="send-template">Email Template</Label>
                  <select 
                    id="send-template"
                    className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white"
                    value={selectedTemplateId}
                    onChange={(e) => setSelectedTemplateId(e.target.value)}
                    disabled={isSending}
                  >
                    {templates.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Target scope filter */}
              <div className="space-y-1.5">
                <Label>Recipient Target Filter</Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "unsent", label: "Unsent Leads Only", desc: `Exclude companies already contacted` },
                    { id: "all", label: "Force Re-Send All", desc: `Mail entire company database list` }
                  ].map((scope) => (
                    <button
                      key={scope.id}
                      onClick={() => setTargetScope(scope.id)}
                      disabled={isSending}
                      className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                        targetScope === scope.id
                          ? "border-blue-600 bg-blue-50/15 dark:border-blue-900/35 dark:bg-blue-950/20"
                          : "border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-850/60"
                      }`}
                    >
                      <p className="text-xs font-bold text-gray-950 dark:text-white">{scope.label}</p>
                      <p className="text-[10px] text-gray-450 dark:text-gray-450 mt-0.5">{scope.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Summary review Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">Parameters Review Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 border border-gray-150 dark:border-gray-800 rounded-lg flex items-start space-x-2">
                <Building2 className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-450 font-semibold uppercase tracking-wider text-[10px]">Recipients</p>
                  <p className="font-bold text-gray-900 dark:text-white mt-0.5">{recipients.length} companies</p>
                </div>
              </div>
              <div className="p-3 border border-gray-150 dark:border-gray-800 rounded-lg flex items-start space-x-2">
                <FileText className="h-5 w-5 text-blue-650 shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-450 font-semibold uppercase tracking-wider text-[10px]">Resume Attached</p>
                  <p className="font-bold text-gray-900 dark:text-white mt-0.5 truncate max-w-[120px]">
                    {resumes.find(r => r.id === selectedResumeId)?.name || "None Selected"}
                  </p>
                </div>
              </div>
              <div className="p-3 border border-gray-150 dark:border-gray-800 rounded-lg flex items-start space-x-2">
                <Mail className="h-5 w-5 text-purple-650 shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-450 font-semibold uppercase tracking-wider text-[10px]">Subject Draft</p>
                  <p className="font-bold text-gray-900 dark:text-white mt-0.5 truncate max-w-[120px]">
                    {templates.find(t => t.id === selectedTemplateId)?.subject || "None Selected"}
                  </p>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/30 p-4 border-t border-gray-100 dark:border-gray-850">
              <span className="text-[10px] text-gray-400 flex items-center">
                <CheckCircle className="h-3.5 w-3.5 mr-1 text-emerald-500 fill-emerald-500 text-white dark:fill-transparent" /> Google OAuth Active Connection
              </span>
              <Button 
                onClick={handleStartOutreach}
                disabled={recipients.length === 0 || isSending}
                className="w-full sm:w-auto px-6 font-bold py-5 cursor-pointer shadow-lg shadow-blue-500/20"
              >
                {isSending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    <span>Dispatching...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2 fill-white" />
                    <span>Send Applications ({recipients.length})</span>
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right pane: Real-time progress terminal logger & stats */}
        <div className="space-y-6">
          <Card className="flex flex-col min-h-[400px] justify-between">
            <CardHeader className="border-b border-gray-100 dark:border-gray-850">
              <CardTitle className="text-base font-bold">Outreach Dispatcher Log</CardTitle>
              <CardDescription className="text-xs">Real-time status updates of Gmail dispatch loops</CardDescription>
            </CardHeader>
            
            {/* Terminal console */}
            <CardContent className="flex-1 bg-gray-950 dark:bg-black font-mono text-[10px] p-4 text-emerald-450 overflow-y-auto space-y-2.5 h-64 mt-4 rounded-lg mx-6">
              {sendLogs.length === 0 ? (
                <div className="text-gray-500 h-full flex flex-col items-center justify-center text-center">
                  <Megaphone className="h-7 w-7 text-gray-700 animate-pulse mb-2" />
                  <span>Terminal console idle.</span>
                  <span className="text-[9px] mt-0.5">Click 'Send Applications' to initiate outreach dispatch.</span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <p className="text-gray-450">Console initialized. Accessing Gmail OAuth token...</p>
                  <p className="text-gray-450">Attachment file parsed successfully: {resumes.find(r => r.id === selectedResumeId)?.name}</p>
                  {sendLogs.map((log, i) => (
                    <p key={i} className="text-emerald-400 font-semibold">{log}</p>
                  ))}
                  {isSending && (
                    <div className="flex items-center space-x-1.5 text-blue-400 mt-1">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Sending to next recipient...</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>

            {/* Bottom Progress Bar area */}
            <div className="p-6 border-t border-gray-100 dark:border-gray-850 mt-4 space-y-4">
              {isSending && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-950 dark:text-white">Batch outreach progress</span>
                    <span className="text-blue-600">{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}

              {sendSummary && (
                <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/25 border border-emerald-100 dark:border-emerald-900/35 rounded-lg flex items-start space-x-2.5 text-xs text-emerald-800 dark:text-emerald-400">
                  <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Dispatch job completed successfully!</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                      Successfully processed {sendSummary.sent} applications. Recruiter response metrics will sync in the inbox tracker.
                    </p>
                    <button 
                      onClick={() => navigate("/dashboard")}
                      className="text-[10px] font-bold text-emerald-700 dark:text-emerald-350 hover:underline mt-2 flex items-center cursor-pointer"
                    >
                      <span>Return to Dashboard</span>
                      <span className="ml-1">→</span>
                    </button>
                  </div>
                </div>
              )}

              {recipients.length === 0 && !isSending && !sendSummary && (
                <div className="p-3 bg-amber-50/55 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-lg flex items-start space-x-2.5 text-xs text-amber-850 dark:text-amber-400">
                  <AlertTriangle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">No unsent leads: </span>
                    All companies in your database have been contacted. Modify scope to "Force Re-Send All" to repeat, or add new leads.
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

      </div>

    </div>
  )
}
