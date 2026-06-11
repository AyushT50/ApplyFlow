import { useState, useEffect } from "react"
import { 
  Globe, 
  CheckCircle, 
  AlertCircle, 
  Save, 
  User, 
  Laptop,
  HelpCircle
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input, Label } from "../components/ui/input"
import { gmailService } from "../services/gmail"

interface SettingsProps {
  darkMode: boolean
  onToggleDarkMode: () => void
}

export default function Settings({ darkMode, onToggleDarkMode }: SettingsProps) {
  // Profile settings
  const [name, setName] = useState("Alex Jobseeker")
  const [email, setEmail] = useState("alex.jobseeker@gmail.com")
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false)

  // Gmail integration states
  const [gmailConnected, setGmailConnected] = useState(false)
  const [gmailEmail, setGmailEmail] = useState("")
  const [integrationSuccess, setIntegrationSuccess] = useState(false)

  useEffect(() => {
    async function loadGmailStatus() {
      const status = await gmailService.getAuthStatus()
      setGmailConnected(status.authorized)
      if (status.email) setGmailEmail(status.email)
    }
    loadGmailStatus()
  }, [])

  const handleProfileSave = () => {
    setProfileSaveSuccess(true)
    setTimeout(() => setProfileSaveSuccess(false), 2000)
  }

  const handleConnectGmail = async () => {
    if (gmailConnected) {
      // Disconnect
      await gmailService.disconnectAccount()
      setGmailConnected(false)
      setGmailEmail("")
    } else {
      // Connect
      const targetEmail = email || "alex.jobseeker@gmail.com"
      await gmailService.connectAccount(targetEmail)
      setGmailConnected(true)
      setGmailEmail(targetEmail)
      setIntegrationSuccess(true)
      setTimeout(() => setIntegrationSuccess(false), 2000)
    }
  }

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-950 dark:text-white">Account Configuration Board</h2>
        <p className="text-xs text-gray-550 dark:text-gray-400 mt-1">
          Configure API integrations, manage Google OAuth connections, customize profile data, and set theme parameters.
        </p>
        {integrationSuccess && (
          <p className="mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            Gmail placeholder connection authorized.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left pane: Profile and Theme settings */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center space-x-2">
                <User className="h-5 w-5 text-blue-600" />
                <span>Personal Profile Settings</span>
              </CardTitle>
              <CardDescription className="text-xs">Update your professional details to personalize outbound mail signatures</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Avatar upload mockup */}
              <div className="flex items-center space-x-4">
                <div className="relative h-14 w-14 rounded-full overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-100 shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&h=256&fit=crop" 
                    alt="Avatar" 
                    className="object-cover h-full w-full"
                  />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-950 dark:text-white">Profile Photo</p>
                  <p className="text-[10px] text-gray-450 dark:text-gray-400 mt-0.5">JPG or PNG. Max size 800KB.</p>
                  <button className="text-[10px] font-bold text-blue-600 hover:underline mt-1.5 cursor-pointer">Change Avatar</button>
                </div>
              </div>

              {/* Name & Contact Email inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="prof-name">Full Name</Label>
                  <Input 
                    id="prof-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="prof-email">Contact Email Address</Label>
                  <Input 
                    id="prof-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-end p-4 border-t border-gray-100 dark:border-gray-850 bg-gray-50/50 dark:bg-gray-900/30 rounded-b-lg">
              <Button onClick={handleProfileSave} className="flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>{profileSaveSuccess ? "Profile Updated!" : "Update Profile"}</span>
              </Button>
            </CardFooter>
          </Card>

          {/* Theme Settings Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center space-x-2">
                <Laptop className="h-5 w-5 text-purple-650" />
                <span>Application Theme Settings</span>
              </CardTitle>
              <CardDescription className="text-xs">Adjust interface light and dark mode preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-850 border border-gray-150 dark:border-gray-800 rounded-xl">
                <div>
                  <p className="text-xs font-bold text-gray-950 dark:text-white">Dark Mode Theme Toggle</p>
                  <p className="text-[10px] text-gray-450 dark:text-gray-450 mt-0.5">Toggle interface design palettes dynamically</p>
                </div>

                {/* Switch button */}
                <button
                  onClick={onToggleDarkMode}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer focus:outline-none ${
                    darkMode ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-800"
                  }`}
                >
                  <span 
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      darkMode ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right pane: Google Gmail API OAuth settings */}
        <div className="space-y-6">
          <Card className="min-h-[380px] flex flex-col justify-between">
            <div>
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-red-500" />
                  <span>Google Gmail API</span>
                </CardTitle>
                <CardDescription className="text-xs">Manage secure OAuth2 connections for email automation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Integration status header banner */}
                <div className={`p-4 border rounded-xl flex items-start space-x-3.5 ${
                  gmailConnected 
                    ? "bg-emerald-50/50 border-emerald-150 dark:bg-emerald-950/20 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-400" 
                    : "bg-amber-50/55 border-amber-100 dark:bg-amber-950/20 dark:border-amber-905/30 text-amber-850 dark:text-amber-400"
                }`}>
                  {gmailConnected ? (
                    <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="text-xs font-bold">
                      {gmailConnected ? "OAuth Connection Approved" : "OAuth Connection Required"}
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                      {gmailConnected 
                        ? `Authorizing outbound mail dispatch via: ${gmailEmail}`
                        : "Outreach dispatch campaigns will fail until Google Gmail account connection is authorized."
                      }
                    </p>
                  </div>
                </div>

                {/* Explanation text */}
                <div className="text-[11px] leading-relaxed text-gray-500 dark:text-gray-400 space-y-2.5">
                  <div className="flex items-center space-x-1 font-semibold text-gray-700 dark:text-gray-300">
                    <HelpCircle className="h-4 w-4 shrink-0" />
                    <span>OAuth Permissions Granted:</span>
                  </div>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Send job application drafts (as your email identity)</li>
                    <li>Read response classification subjects (inbox monitoring)</li>
                  </ul>
                </div>
              </CardContent>
            </div>

            {/* Connection trigger button */}
            <div className="p-6 border-t border-gray-100 dark:border-gray-850 mt-4">
              <Button 
                variant={gmailConnected ? "outline" : "default"}
                onClick={handleConnectGmail}
                className="w-full flex items-center justify-center space-x-2 py-5 shadow-md hover:shadow-lg cursor-pointer"
              >
                <Globe className={`h-4 w-4 ${gmailConnected ? "text-gray-500" : "text-red-500 fill-red-500"}`} />
                <span>{gmailConnected ? "Disconnect Gmail API" : "Authorize Google Gmail Connection"}</span>
              </Button>
            </div>
          </Card>
        </div>

      </div>

    </div>
  )
}
