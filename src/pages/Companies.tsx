import { useState, useEffect, useMemo } from "react"
import { 
  Building2, 
  Search, 
  Plus, 
  FileSpreadsheet, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Check,
  AlertCircle
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input, Label } from "../components/ui/input"
import { Badge } from "../components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog"

interface Company {
  id: string
  name: string
  email: string
  status: "Not Sent" | "Sending" | "Sent"
  dateSent: string
  responseStatus: "No Reply" | "Replied" | "Pending"
}

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showCsvModal, setShowCsvModal] = useState(false)

  // New manual company fields
  const [newName, setNewName] = useState("")
  const [newEmail, setNewEmail] = useState("")

  // CSV content field
  const [csvText, setCsvText] = useState("")
  const [csvError, setCsvError] = useState<string | null>(null)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const defaultCompanies = useMemo<Company[]>(() => [
    { id: "1", name: "Google", email: "tech-recruiting@google.com", status: "Sent", dateSent: "2026-06-08", responseStatus: "Pending" },
    { id: "2", name: "Microsoft", email: "talent-acquisition@microsoft.com", status: "Sent", dateSent: "2026-06-09", responseStatus: "Replied" },
    { id: "3", name: "Stripe", email: "careers@stripe.com", status: "Sent", dateSent: "2026-06-10", responseStatus: "Replied" },
    { id: "4", name: "Vercel", email: "jobs@vercel.com", status: "Sent", dateSent: "2026-06-11", responseStatus: "Pending" },
    { id: "5", name: "Netflix", email: "studio-jobs@netflix.com", status: "Not Sent", dateSent: "—", responseStatus: "No Reply" },
    { id: "6", name: "Linear", email: "hiring@linear.app", status: "Sent", dateSent: "2026-06-05", responseStatus: "Replied" },
    { id: "7", name: "Airbnb", email: "host-careers@airbnb.com", status: "Not Sent", dateSent: "—", responseStatus: "No Reply" },
    { id: "8", name: "Figma", email: "figma-careers@figma.com", status: "Not Sent", dateSent: "—", responseStatus: "No Reply" },
    { id: "9", name: "Uber", email: "driver-recruitment@uber.com", status: "Not Sent", dateSent: "—", responseStatus: "No Reply" },
    { id: "10", name: "Meta", email: "meta-careers@fb.com", status: "Not Sent", dateSent: "—", responseStatus: "No Reply" },
  ], [])

  useEffect(() => {
    const stored = localStorage.getItem("applyflow_companies")
    if (stored) {
      setCompanies(JSON.parse(stored))
    } else {
      setCompanies(defaultCompanies)
      localStorage.setItem("applyflow_companies", JSON.stringify(defaultCompanies))
    }
  }, [defaultCompanies])

  const saveCompanies = (list: Company[]) => {
    setCompanies(list)
    localStorage.setItem("applyflow_companies", JSON.stringify(list))
  }

  const handleAddManual = () => {
    if (!newName.trim() || !newEmail.trim()) return

    const newCompany: Company = {
      id: Math.random().toString(36).substring(2, 9),
      name: newName,
      email: newEmail,
      status: "Not Sent",
      dateSent: "—",
      responseStatus: "No Reply"
    }

    saveCompanies([newCompany, ...companies])
    setNewName("")
    setNewEmail("")
    setShowAddModal(false)
  }

  const handleImportCsv = () => {
    if (!csvText.trim()) return
    setCsvError(null)

    try {
      const rows = csvText.split("\n").map(r => r.trim()).filter(r => r.length > 0)
      const parsed: Company[] = []

      rows.forEach((row, i) => {
        // Simple comma split
        const parts = row.split(",")
        if (parts.length < 2) {
          throw new Error(`Row ${i + 1} has insufficient columns (expected Name, Email)`)
        }
        const name = parts[0].trim()
        const email = parts[1].trim()

        if (!email.includes("@")) {
          throw new Error(`Row ${i + 1} has an invalid email format: '${email}'`)
        }

        parsed.push({
          id: Math.random().toString(36).substring(2, 9) + i,
          name,
          email,
          status: "Not Sent",
          dateSent: "—",
          responseStatus: "No Reply"
        })
      })

      saveCompanies([...parsed, ...companies])
      setCsvText("")
      setShowCsvModal(false)
    } catch (err: unknown) {
      setCsvError(err instanceof Error ? err.message : "Parsing failed. Please verify format.")
    }
  }

  const handleDelete = (id: string) => {
    const updated = companies.filter(c => c.id !== id)
    saveCompanies(updated)
  }

  // Filtered list
  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Pagination Logic
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredCompanies.slice(indexOfFirstItem, indexOfLastItem)

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-950 dark:text-white">Recruiter Company Database</h2>
          <p className="text-xs text-gray-550 dark:text-gray-400 mt-1">
            Build and manage list directories of tech recruiters. Import data from spreadsheets or append leads manually.
          </p>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <Button variant="outline" onClick={() => setShowCsvModal(true)} className="flex items-center space-x-1.5 cursor-pointer">
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            <span>Import CSV</span>
          </Button>
          <Button onClick={() => setShowAddModal(true)} className="flex items-center space-x-1.5 cursor-pointer">
            <Plus className="h-4 w-4" />
            <span>Add Lead</span>
          </Button>
        </div>
      </div>

      {/* Main Database Table Card */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base font-bold">Company Leads Directory</CardTitle>
            <CardDescription className="text-xs">Database list containing recruiter metadata</CardDescription>
          </div>
          
          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute top-2.5 left-3 h-4.5 w-4.5 text-gray-405" />
            <Input 
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-10 h-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          {currentItems.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">No company contacts found</p>
              <p className="text-xs text-gray-500 mt-1">Add recruiter leads manually or upload a CSV file.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-150 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-850/30">
                      <th className="p-4 font-semibold text-gray-500 dark:text-gray-405">Company Name</th>
                      <th className="p-4 font-semibold text-gray-500 dark:text-gray-405">Recruiter Email</th>
                      <th className="p-4 font-semibold text-gray-500 dark:text-gray-405">Outreach status</th>
                      <th className="p-4 font-semibold text-gray-500 dark:text-gray-405">Date Dispatched</th>
                      <th className="p-4 font-semibold text-gray-500 dark:text-gray-405">Response Status</th>
                      <th className="p-4 font-semibold text-gray-500 text-center dark:text-gray-405">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((company) => (
                      <tr key={company.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-805/30 transition-colors">
                        <td className="p-4 font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                          <div className="h-7 w-7 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-650 flex items-center justify-center text-xs font-bold">
                            {company.name.charAt(0)}
                          </div>
                          <span>{company.name}</span>
                        </td>
                        <td className="p-4 text-gray-650 dark:text-gray-300 font-mono text-xs">{company.email}</td>
                        <td className="p-4">
                          <Badge 
                            variant={
                              company.status === "Sent" 
                                ? "success" 
                                : company.status === "Sending" 
                                ? "warning" 
                                : "secondary"
                            }
                          >
                            {company.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-gray-500 dark:text-gray-450 text-xs">{company.dateSent}</td>
                        <td className="p-4">
                          <Badge 
                            variant={
                              company.responseStatus === "Replied" 
                                ? "success" 
                                : company.responseStatus === "Pending" 
                                ? "info"
                                : "secondary"
                            }
                          >
                            {company.responseStatus}
                          </Badge>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleDelete(company.id)}
                            className="p-1.5 text-gray-400 hover:text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 rounded cursor-pointer"
                            title="Delete Lead"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-105 dark:border-gray-850 pt-4 text-xs">
                  <span className="text-gray-500">
                    Showing <span className="font-semibold text-gray-900 dark:text-white">{indexOfFirstItem + 1}</span> to{" "}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {Math.min(indexOfLastItem, filteredCompanies.length)}
                    </span>{" "}
                    of <span className="font-semibold text-gray-900 dark:text-white">{filteredCompanies.length}</span> leads
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="font-semibold">Page {currentPage} of {totalPages}</span>
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 cursor-pointer"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Lead manually Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent onClose={() => setShowAddModal(false)}>
          <DialogHeader>
            <DialogTitle>Add Recruiter Lead</DialogTitle>
            <DialogDescription>Input new company details manually into the active campaign scope.</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="lead-name">Company Name</Label>
              <Input 
                id="lead-name" 
                placeholder="e.g. Stripe" 
                value={newName} 
                onChange={(e) => setNewName(e.target.value)} 
              />
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="lead-email">Recruiter Email Address</Label>
              <Input 
                id="lead-email" 
                placeholder="e.g. recruit@stripe.com" 
                type="email"
                value={newEmail} 
                onChange={(e) => setNewEmail(e.target.value)} 
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button onClick={handleAddManual}>Save Lead</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CSV Import Modal */}
      <Dialog open={showCsvModal} onOpenChange={setShowCsvModal}>
        <DialogContent onClose={() => setShowCsvModal(false)}>
          <DialogHeader>
            <DialogTitle>Import Leads via CSV</DialogTitle>
            <DialogDescription>Paste comma-separated rows. Structure format: CompanyName, EmailAddress</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="csv-textarea">CSV Content (Headerless)</Label>
              <textarea
                id="csv-textarea"
                placeholder={`Google, tech-hiring@google.com\nMicrosoft, careers@microsoft.com\nNetflix, jobs@netflix.com`}
                rows={6}
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                className="flex w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-xs font-mono text-gray-950 dark:text-white"
              />
            </div>

            {csvError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-150 dark:border-red-900/30 text-red-700 dark:text-red-400 text-xs rounded-lg flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{csvError}</span>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCsvModal(false)}>Cancel</Button>
            <Button onClick={handleImportCsv} className="flex items-center space-x-1">
              <Check className="h-4 w-4" />
              <span>Parse & Add</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
