import { useState, useRef, useEffect } from "react"
import { 
  Save, 
  HelpCircle, 
  Sparkles, 
  Variable,
  FileText
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input, Label } from "../components/ui/input"

interface Template {
  id: string
  name: string
  subject: string
  body: string
}

const defaultTemplates: Template[] = [
  {
    id: "t1",
    name: "Software Engineer Application",
    subject: "Application: {{position}} - Alex Jobseeker",
    body: "Hi {{name}},\n\nI hope you are having a great week.\n\nI'm reaching out because I'm very interested in the {{position}} position at {{company}}. Given my experience with React, TypeScript, and building responsive dashboards, I believe I could contribute significantly to your team.\n\nI have attached my resume for your review. Would you be open to a brief conversation this week to discuss how my skill set matches your current goals?\n\nBest regards,\nAlex Jobseeker"
  },
  {
    id: "t2",
    name: "Cold Recruiter Outreach",
    subject: "Inquiry: Developer Openings at {{company}}",
    body: "Hello {{name}},\n\nI notice that {{company}} is expanding your frontend development squad. I'm a software engineer specialized in SaaS dashboard engineering and modern components.\n\nI've worked extensively on UI components following shadcn style and Tailwind. Would you have 5 minutes for a quick chat regarding active hires for {{position}}?\n\nWarmly,\nAlex Jobseeker"
  }
]

export default function Templates() {
  const [templates, setTemplates] = useState<Template[]>(defaultTemplates)

  const [activeTemplateId, setActiveTemplateId] = useState("t1")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [saveSuccess, setSaveSuccess] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Load from local storage or set initial values
  useEffect(() => {
    const stored = localStorage.getItem("applyflow_templates")
    let currentTemplates = defaultTemplates
    if (stored) {
      currentTemplates = JSON.parse(stored)
      setTemplates(currentTemplates)
    } else {
      localStorage.setItem("applyflow_templates", JSON.stringify(defaultTemplates))
    }

    const active = currentTemplates.find(t => t.id === activeTemplateId)
    if (active) {
      setSubject(active.subject)
      setBody(active.body)
    }
  }, [activeTemplateId])

  const handleSelectTemplate = (id: string) => {
    setActiveTemplateId(id)
  }

  // Insert variable tag at cursor
  const handleInsertVariable = (variable: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value
    const before = text.substring(0, start)
    const after = text.substring(end, text.length)

    const updatedBody = before + variable + after
    setBody(updatedBody)

    // Reset cursor position after insert
    setTimeout(() => {
      textarea.focus()
      textarea.selectionStart = textarea.selectionEnd = start + variable.length
    }, 50)
  }

  const handleSave = () => {
    const updated = templates.map((t) => {
      if (t.id === activeTemplateId) {
        return { ...t, subject, body }
      }
      return t
    })
    setTemplates(updated)
    localStorage.setItem("applyflow_templates", JSON.stringify(updated))
    
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2000)
  }

  // Compile template for preview box
  const compileTemplate = (text: string) => {
    return text
      .replace(/{{company}}/g, "Stripe")
      .replace(/{{name}}/g, "Sarah Recruiter")
      .replace(/{{position}}/g, "Senior Frontend Engineer")
  }

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-950 dark:text-white">Email Outreach Templates</h2>
          <p className="text-xs text-gray-550 dark:text-gray-400 mt-1">
            Create high-converting outbound email drafts. Insert template variables that compile dynamically per company.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Templates Selector & Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Selector */}
          <div className="flex space-x-2.5 overflow-x-auto pb-1">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => handleSelectTemplate(t.id)}
                className={`px-4 py-2.5 rounded-lg border text-xs font-semibold shrink-0 cursor-pointer transition-all ${
                  t.id === activeTemplateId
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-850"
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>

          {/* Editor Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">Edit Email Content</CardTitle>
              <CardDescription className="text-xs">Customize subject and core body text.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Subject Input */}
              <div className="space-y-1.5">
                <Label htmlFor="tpl-subject">Subject Line</Label>
                <Input 
                  id="tpl-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Application: {{position}} - Alex"
                />
              </div>

              {/* Variable Injection helper panel */}
              <div className="space-y-2">
                <div className="flex items-center space-x-1">
                  <Variable className="h-4 w-4 text-blue-650" />
                  <span className="text-xs font-semibold text-gray-750 dark:text-gray-350">Insert Template Variables:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { tag: "{{company}}", label: "Company Name" },
                    { tag: "{{name}}", label: "Recruiter Name" },
                    { tag: "{{position}}", label: "Job Title" },
                  ].map((item) => (
                    <button
                      key={item.tag}
                      onClick={() => handleInsertVariable(item.tag)}
                      className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-[10px] font-bold rounded-md border border-gray-200 dark:border-gray-750 cursor-pointer flex items-center space-x-1"
                    >
                      <span className="font-mono text-blue-600">{item.tag}</span>
                      <span className="text-[9px] text-gray-400">({item.label})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Body Area */}
              <div className="space-y-1.5">
                <Label htmlFor="tpl-body">Email Body (Text Editor)</Label>
                <textarea
                  id="tpl-body"
                  ref={textareaRef}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={10}
                  className="flex w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 font-sans leading-relaxed"
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/30 p-4 border-t border-gray-100 dark:border-gray-850">
              <span className="text-[10px] text-gray-450 dark:text-gray-400 flex items-center">
                <HelpCircle className="h-3.5 w-3.5 mr-1" /> Always test templates before dispatching.
              </span>
              <Button onClick={handleSave} className="flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>{saveSuccess ? "Saved Successfully!" : "Save Template"}</span>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right Side: Live Compiled Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center space-x-2">
                <Sparkles className="h-4.5 w-4.5 text-purple-650" />
                <span>Live Dynamic Preview</span>
              </CardTitle>
              <CardDescription className="text-xs">Compiled draft rendering for sample recipient Stripe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Sample Recipient Details */}
              <div className="p-3 bg-purple-50/45 dark:bg-purple-950/15 border border-purple-100 dark:border-purple-900/20 rounded-lg text-[10px] space-y-1.5 text-purple-950 dark:text-purple-400">
                <div className="font-bold flex items-center space-x-1.5">
                  <span>Recipient Sample Profile:</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-gray-500 dark:text-gray-400">
                  <div>Company: <span className="font-semibold text-purple-950 dark:text-purple-400">Stripe</span></div>
                  <div>Name: <span className="font-semibold text-purple-950 dark:text-purple-400">Sarah Recruiter</span></div>
                  <div>Job: <span className="font-semibold text-purple-950 dark:text-purple-400">Senior Frontend...</span></div>
                </div>
              </div>

              {/* Preview Window Box */}
              <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-xs">
                {/* Mail header bar */}
                <div className="bg-gray-50 dark:bg-gray-850 p-3 border-b border-gray-200 dark:border-gray-800 text-[11px] space-y-1.5">
                  <div className="text-gray-400">To: <span className="text-gray-700 dark:text-gray-200 font-medium">sarah.recruiter@stripe.com</span></div>
                  <div className="text-gray-400">Subject: <span className="text-gray-800 dark:text-white font-bold">{compileTemplate(subject)}</span></div>
                </div>
                {/* Mail Body */}
                <div className="p-4 bg-white dark:bg-gray-900 text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-sans min-h-60 whitespace-pre-wrap">
                  {compileTemplate(body)}
                </div>
                {/* Mail attachments indicator */}
                <div className="bg-gray-50 dark:bg-gray-850 p-2.5 border-t border-gray-150 dark:border-gray-800 text-[10px] flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold text-gray-750 dark:text-gray-300">Alex_Jobseeker_CV.pdf</span>
                  <span>(245 KB)</span>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

      </div>

    </div>
  )
}
