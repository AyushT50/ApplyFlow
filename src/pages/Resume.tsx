import { useState, useEffect, useRef } from "react"
import { 
  FileUp, 
  FileText, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Sparkles
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { supabaseService } from "../services/supabase"

interface ResumeFile {
  id: string
  name: string
  size: string
  dateUploaded: string
  status: "Active" | "Inactive"
}

export default function Resume() {
  const [resumes, setResumes] = useState<ResumeFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [dragError, setDragError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function loadResumes() {
      const { data } = await supabaseService.db.resumes.select()
      if (data) setResumes(data as ResumeFile[])
    }
    loadResumes()
  }, [])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const simulateUpload = (fileName: string, fileSize: string) => {
    setDragError(null)
    setUploadProgress(0)
    
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null) return 0
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(async () => {
            // Save to mock database
            const { data } = await supabaseService.db.resumes.insert({
              name: fileName,
              size: fileSize,
              status: "Active"
            })
            
            if (data) {
              // Update local state, setting others to Inactive
              setResumes((prevResumes) => {
                const deactivated = prevResumes.map(r => ({ ...r, status: "Inactive" as const }))
                return [data as ResumeFile, ...deactivated]
              })
            }
            setUploadProgress(null)
          }, 400)
          return 100
        }
        return prev + 20
      })
    }, 150)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (!file) return

    if (file.type !== "application/pdf") {
      setDragError("Only PDF resumes are supported.")
      return
    }

    const sizeMB = (file.size / (1024 * 1024)).toFixed(1)
    const sizeStr = file.size > 1024 * 1024 ? `${sizeMB} MB` : `${(file.size / 1024).toFixed(0)} KB`
    simulateUpload(file.name, sizeStr)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== "application/pdf") {
      setDragError("Only PDF resumes are supported.")
      return
    }

    const sizeMB = (file.size / (1024 * 1024)).toFixed(1)
    const sizeStr = file.size > 1024 * 1024 ? `${sizeMB} MB` : `${(file.size / 1024).toFixed(0)} KB`
    simulateUpload(file.name, sizeStr)
  }

  const handleActivate = (id: string) => {
    const updated = resumes.map((r) => ({
      ...r,
      status: (r.id === id ? "Active" : "Inactive") as "Active" | "Inactive"
    }))
    setResumes(updated)
    localStorage.setItem("applyflow_resumes", JSON.stringify(updated))
  }

  const handleDelete = (id: string) => {
    const updated = resumes.filter(r => r.id !== id)
    // If we deleted the active one, activate the next available
    if (updated.length > 0 && !updated.some(r => r.status === "Active")) {
      updated[0].status = "Active"
    }
    setResumes(updated)
    localStorage.setItem("applyflow_resumes", JSON.stringify(updated))
  }

  const activeResume = resumes.find(r => r.status === "Active")

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-950 dark:text-white">Resume Repository</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Upload your latest CV in PDF format. ApplyFlow extracts keywords and attaches this file to outreach campaigns.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Drag & Drop Zone */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">Upload Resume</CardTitle>
              <CardDescription className="text-xs">Drag and drop your PDF resume, or browse local files.</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-10 text-center flex flex-col items-center justify-center transition-all ${
                  isDragging 
                    ? "border-blue-500 bg-blue-50/25 dark:bg-blue-950/10" 
                    : uploadProgress !== null 
                    ? "border-blue-300"
                    : "border-gray-250 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-700"
                }`}
              >
                {uploadProgress !== null ? (
                  <div className="space-y-4">
                    <div className="relative h-16 w-16 mx-auto flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-4 border-gray-150 dark:border-gray-800" />
                      <div 
                        className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"
                        style={{ animationDuration: "0.8s" }}
                      />
                      <span className="text-xs font-bold text-gray-950 dark:text-white">{uploadProgress}%</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-950 dark:text-white">Processing PDF Resume...</p>
                      <p className="text-[10px] text-gray-450 dark:text-gray-400 mt-1">Parsing profile, tags, and indexing contact metadata</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="h-12 w-12 bg-blue-50 dark:bg-blue-950/30 text-blue-650 dark:text-blue-400 rounded-lg flex items-center justify-center mb-4">
                      <FileUp className="h-6 w-6 animate-pulse" />
                    </div>
                    <p className="text-sm font-semibold text-gray-950 dark:text-white">Drag & Drop file here</p>
                    <p className="text-xs text-gray-450 dark:text-gray-450 mt-1 mb-4">or select PDF from your machine (max 5MB)</p>
                    
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => fileInputRef.current?.click()}
                      className="cursor-pointer"
                    >
                      Select PDF Document
                    </Button>

                    {dragError && (
                      <p className="text-xs text-red-500 font-medium mt-3 flex items-center justify-center">
                        <AlertCircle className="h-4 w-4 mr-1 shrink-0" />
                        <span>{dragError}</span>
                      </p>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upload History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">Resume Versions History</CardTitle>
              <CardDescription className="text-xs">Manage uploaded versions and toggle active sending file.</CardDescription>
            </CardHeader>
            <CardContent>
              {resumes.length === 0 ? (
                <div className="text-center py-6 text-xs text-gray-400">No resumes uploaded yet.</div>
              ) : (
                <div className="space-y-3">
                  {resumes.map((resume) => (
                    <div 
                      key={resume.id} 
                      className={`flex items-center justify-between p-3.5 rounded-lg border text-xs transition-all ${
                        resume.status === "Active" 
                          ? "border-blue-150 bg-blue-50/15 dark:border-blue-900/30 dark:bg-blue-950/10" 
                          : "border-gray-150 dark:border-gray-850 hover:bg-gray-50/50 dark:hover:bg-gray-850/20"
                      }`}
                    >
                      <div className="flex items-center space-x-3.5 min-w-0">
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                          resume.status === "Active" ? "bg-blue-100/60 text-blue-650" : "bg-gray-100 text-gray-500 dark:bg-gray-800"
                        }`}>
                          <FileText className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-950 dark:text-white truncate">{resume.name}</p>
                          <p className="text-[10px] text-gray-450 dark:text-gray-400 mt-0.5">{resume.size} • Uploaded on {resume.dateUploaded}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Badge variant={resume.status === "Active" ? "success" : "secondary"}>
                          {resume.status}
                        </Badge>
                        {resume.status === "Inactive" && (
                          <button 
                            onClick={() => handleActivate(resume.id)}
                            className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                          >
                            Activate
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(resume.id)}
                          className="p-1 text-gray-400 hover:text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 rounded cursor-pointer"
                          title="Delete Resume"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Resume Preview Card & Status */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">Active Resume Profile</CardTitle>
              <CardDescription className="text-xs">Extracted data from active PDF file</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeResume ? (
                <>
                  {/* File card */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-850 rounded-xl border border-gray-150 dark:border-gray-800 flex items-start space-x-3">
                    <FileText className="h-8 w-8 text-blue-600 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-950 dark:text-white truncate">{activeResume.name}</p>
                      <p className="text-[10px] text-gray-450 dark:text-gray-400 mt-0.5">PDF Document • {activeResume.size}</p>
                      <span className="inline-flex items-center text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-2">
                        <CheckCircle className="h-3 w-3 mr-1 fill-emerald-500 text-white dark:fill-transparent" /> Ready for campaigns
                      </span>
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="space-y-2.5">
                    <h4 className="text-[11px] font-semibold text-gray-450 uppercase tracking-wider">Identified Skills</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {["React", "TypeScript", "Tailwind CSS", "Node.js", "Python", "REST APIs", "Git", "SaaS Dashboard Architecture"].map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 bg-blue-50/50 dark:bg-blue-900/10 text-blue-650 dark:text-blue-400 text-[10px] rounded border border-blue-100/35 dark:border-blue-900/20">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Keywords optimization helper */}
                  <div className="p-3.5 bg-gradient-to-r from-purple-50/50 to-indigo-50/30 dark:from-purple-950/15 dark:to-indigo-950/10 border border-purple-100 dark:border-purple-900/30 rounded-lg text-xs text-purple-900 dark:text-purple-400 space-y-1.5">
                    <div className="flex items-center space-x-1 font-bold">
                      <Sparkles className="h-3.5 w-3.5 text-purple-600 dark:text-purple-450" />
                      <span>Resume Analysis</span>
                    </div>
                    <p className="leading-relaxed text-[11px]">
                      Your resume has an 87% matches score for standard Software Engineering outreach campaigns. Consider injecting dynamic variables in email templates to complete the setup.
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-xs text-gray-400">
                  <AlertCircle className="h-8 w-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                  No active resume configured. Please upload a CV.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>

    </div>
  )
}
