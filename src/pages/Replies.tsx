import { useState } from "react"
import { 
  Search, 
  Mail, 
  Clock, 
  ExternalLink,
  HelpCircle,
  Briefcase
} from "lucide-react"
import { Card, CardContent } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"

interface ReplyMessage {
  id: string
  company: string
  senderName: string
  senderEmail: string
  subject: string
  date: string
  snippet: string
  body: string
  classification: "Interview Request" | "Followup Inquiry" | "Not Interested" | "General"
}

export default function Replies() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedReplyId, setSelectedReplyId] = useState("1")
  const [filterType, setFilterType] = useState<"All" | "Interviews" | "Pending" | "Rejections">("All")

  const replies: ReplyMessage[] = [
    {
      id: "1",
      company: "Stripe",
      senderName: "Sarah Jenkins",
      senderEmail: "sjenkins@stripe.com",
      subject: "Re: Senior Frontend Engineer Application - Alex Jobseeker",
      date: "Today, 2:14 PM",
      snippet: "Hi Alex, thank you for reaching out. Your background in React and dashboard design looks like a great fit...",
      body: "Hi Alex,\n\nThank you for reaching out directly. I reviewed your attached resume and your experience with responsive dashboard design and component systems caught our attention.\n\nWe are currently expanding our dashboard and platform engineering squad. Would you be open to a 20-minute introductory phone screen this week?\n\nHere is my calendar link to book a slot:\nhttps://calendly.com/sjenkins-stripe/intro\n\nLooking forward to speaking,\nSarah Jenkins\nPrincipal Talent Specialist @ Stripe",
      classification: "Interview Request"
    },
    {
      id: "2",
      company: "Vercel",
      senderName: "Marcus Vance",
      senderEmail: "marcus.vance@vercel.com",
      subject: "Re: Open Developer Positions at Vercel",
      date: "Yesterday, 10:45 AM",
      snippet: "Hello Alex, I'm checking with the design systems team lead to see if they have openings matching your React skill set...",
      body: "Hello Alex,\n\nThanks for sending over your resume and notes. I'm checking with our Design Systems team lead to see if they have openings matching your React and TypeScript skill set for Q2.\n\nI will follow up with you as soon as I hear back from them, likely by Thursday.\n\nBest,\nMarcus Vance\nTechnical Recruiter @ Vercel",
      classification: "Followup Inquiry"
    },
    {
      id: "3",
      company: "Linear",
      senderName: "Elena Rostova",
      senderEmail: "elena@linear.app",
      subject: "Application: Software Engineer",
      date: "June 9",
      snippet: "Hi Alex, thanks for your interest. Unfortunately, we are not hiring for remote frontend roles in your region at the moment...",
      body: "Hi Alex,\n\nThank you for your interest in Linear. We reviewed your resume and portfolio details.\n\nUnfortunately, we are not hiring for remote frontend roles in your region at the moment. We will keep your CV on file and reach out if a matching opening pops up in the future.\n\nGood luck with your search,\nElena Rostova\nHR Operations @ Linear",
      classification: "Not Interested"
    }
  ]

  // Filter logic
  const getFilteredReplies = () => {
    let list = replies
    if (filterType === "Interviews") {
      list = list.filter(r => r.classification === "Interview Request")
    } else if (filterType === "Pending") {
      list = list.filter(r => r.classification === "Followup Inquiry")
    } else if (filterType === "Rejections") {
      list = list.filter(r => r.classification === "Not Interested")
    }

    if (searchQuery.trim()) {
      list = list.filter(r => 
        r.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.senderEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.subject.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return list
  }

  const filteredReplies = getFilteredReplies()
  const activeReply = replies.find(r => r.id === selectedReplyId)

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-950 dark:text-white">Reply Tracker Inbox</h2>
        <p className="text-xs text-gray-550 dark:text-gray-400 mt-1">
          Review incoming recruiter responses. Our platform parses emails and automatically classifies sentiment outcomes.
        </p>
      </div>

      {/* Tabs / Filter Row */}
      <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-800 pb-3">
        {(["All", "Interviews", "Pending", "Rejections"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setFilterType(tab)
              // Auto select first item in filtered list if available
              const first = replies.find(r => {
                if (tab === "All") return true
                if (tab === "Interviews") return r.classification === "Interview Request"
                if (tab === "Pending") return r.classification === "Followup Inquiry"
                return r.classification === "Not Interested"
              })
              if (first) setSelectedReplyId(first.id)
            }}
            className={`px-4.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
              filterType === tab
                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-650 dark:text-blue-400 border border-blue-150/40 dark:border-blue-800/40"
                : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-850 border border-transparent"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Split screen Inbox */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Pane: Mail scroll list */}
        <div className="space-y-4 lg:col-span-1">
          {/* Search */}
          <div className="relative">
            <Search className="absolute top-2.5 left-3 h-4.5 w-4.5 text-gray-405" />
            <Input 
              placeholder="Search replies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-9"
            />
          </div>

          {/* Cards List */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredReplies.length === 0 ? (
              <div className="text-center py-10 bg-white dark:bg-gray-905 rounded-xl border border-gray-150 dark:border-gray-800">
                <Mail className="h-8 w-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-xs text-gray-500">No replies matched filters.</p>
              </div>
            ) : (
              filteredReplies.map((reply) => (
                <div
                  key={reply.id}
                  onClick={() => setSelectedReplyId(reply.id)}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer text-left transition-all ${
                    reply.id === selectedReplyId
                      ? "border-blue-600 bg-blue-55/10 dark:border-blue-800 dark:bg-blue-950/15"
                      : "border-gray-150 dark:border-gray-850 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-850/45"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      <div className="h-7 w-7 rounded bg-blue-50 dark:bg-blue-950/30 text-blue-650 flex items-center justify-center font-bold text-[10px]">
                        {reply.company.charAt(0)}
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white">{reply.company}</span>
                    </div>
                    <span className="text-[10px] text-gray-400">{reply.date}</span>
                  </div>

                  <p className="font-semibold text-gray-800 dark:text-gray-200 mt-2.5 truncate">{reply.subject}</p>
                  <p className="text-gray-450 dark:text-gray-450 mt-1 line-clamp-2 leading-relaxed">{reply.snippet}</p>
                  
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-[10px] text-gray-400 font-mono">{reply.senderName}</span>
                    <Badge 
                      variant={
                        reply.classification === "Interview Request" 
                          ? "success" 
                          : reply.classification === "Followup Inquiry" 
                          ? "warning" 
                          : reply.classification === "Not Interested" 
                          ? "destructive"
                          : "secondary"
                      }
                      className="text-[9px] px-2"
                    >
                      {reply.classification}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Pane: Mail detailed preview */}
        <div className="lg:col-span-2">
          {activeReply ? (
            <Card className="min-h-[480px] flex flex-col justify-between">
              <div>
                {/* Header info */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-850">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3.5">
                      <div className="h-10 w-10 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/20 rounded-xl flex items-center justify-center font-bold text-blue-600">
                        {activeReply.company.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-base text-gray-950 dark:text-white">{activeReply.company}</h3>
                        <p className="text-xs text-gray-450 dark:text-gray-400">
                          {activeReply.senderName} • <span className="font-mono text-[10px]">{activeReply.senderEmail}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={
                          activeReply.classification === "Interview Request" 
                            ? "success" 
                            : activeReply.classification === "Followup Inquiry" 
                            ? "warning" 
                            : "destructive"
                        }
                        className="py-1 px-3"
                      >
                        {activeReply.classification}
                      </Badge>
                      <span className="text-[10px] text-gray-400 font-mono flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1" /> {activeReply.date}
                      </span>
                    </div>
                  </div>

                  <h4 className="font-bold text-sm text-gray-900 dark:text-white mt-5">
                    {activeReply.subject}
                  </h4>
                </div>

                {/* Email Body text content */}
                <div className="p-6 text-xs text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap font-sans">
                  {activeReply.body}
                </div>
              </div>

              {/* Quick Action Footer */}
              <CardContent className="pt-0 p-6 border-t border-gray-100 dark:border-gray-850 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 dark:bg-gray-900/30">
                <span className="text-[10px] text-gray-400 flex items-center">
                  <HelpCircle className="h-3.5 w-3.5 mr-1" /> Use Gmail interface directly to reply.
                </span>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" className="text-xs flex items-center space-x-1.5 cursor-pointer">
                    <ExternalLink className="h-4 w-4" />
                    <span>Open in Gmail</span>
                  </Button>
                  {activeReply.classification === "Interview Request" && (
                    <Button className="text-xs cursor-pointer shadow-md shadow-blue-500/15">
                      <Briefcase className="h-4 w-4 mr-1.5" />
                      <span>Book Interview Calendar</span>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="min-h-[480px] flex flex-col items-center justify-center text-center">
              <Mail className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3 animate-pulse" />
              <p className="text-sm font-semibold text-gray-950 dark:text-white">No Message Selected</p>
              <p className="text-xs text-gray-500 mt-1">Select an email reply from the list directory to review contents.</p>
            </Card>
          )}
        </div>

      </div>

    </div>
  )
}
