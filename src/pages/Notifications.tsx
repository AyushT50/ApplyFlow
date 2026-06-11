import { useState } from "react"
import { 
  Mail, 
  Bot, 
  History, 
  Save
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input, Label } from "../components/ui/input"
import { Badge } from "../components/ui/badge"

export default function Notifications() {
  const [telegramEnabled, setTelegramEnabled] = useState(false)
  const [telegramChatId, setTelegramChatId] = useState("")
  const [telegramBotToken, setTelegramBotToken] = useState("")
  
  const [emailDigestEnabled, setEmailDigestEnabled] = useState(true)
  const [emailDigestFreq, setEmailDigestFreq] = useState("daily") // "daily" | "weekly" | "instantly"

  const [saveSuccess, setSaveSuccess] = useState(false)

  const historyLogs = [
    { id: 1, type: "Success", event: "Telegram Webhook Active ping successful", time: "Today, 1:05 PM" },
    { id: 2, type: "Info", event: "Sent email digest to alex.jobseeker@gmail.com", time: "Today, 9:00 AM" },
    { id: 3, type: "Warning", event: "Outreach paused: 1 company email bounced (Netflix)", time: "June 9, 3:14 PM" },
  ]

  const handleSave = () => {
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2000)
  }

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-950 dark:text-white">Alert Notifications Settings</h2>
        <p className="text-xs text-gray-550 dark:text-gray-400 mt-1">
          Stay updated on recruiter replies. Configure instant alerts to Telegram or set daily email digest schedules.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Telegram and Email Toggles */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Telegram Settings */}
          <Card>
            <CardHeader className="flex flex-row items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-base font-bold flex items-center space-x-2">
                  <Bot className="h-5 w-5 text-blue-500" />
                  <span>Telegram Alert Bot</span>
                </CardTitle>
                <CardDescription className="text-xs">Receive instant notifications when a company responds to your CV outreach</CardDescription>
              </div>
              
              {/* Toggle Switch */}
              <button 
                onClick={() => setTelegramEnabled(!telegramEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer focus:outline-none ${
                  telegramEnabled ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-800"
                }`}
              >
                <span 
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    telegramEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </CardHeader>
            <CardContent className={`space-y-4 transition-opacity duration-200 ${telegramEnabled ? "opacity-100" : "opacity-50 pointer-events-none"}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="tg-bot-token">Telegram Bot Token</Label>
                  <Input 
                    id="tg-bot-token"
                    type="password"
                    placeholder="Enter Telegram bot token"
                    value={telegramBotToken}
                    onChange={(e) => setTelegramBotToken(e.target.value)}
                    disabled={!telegramEnabled}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tg-chat-id">Telegram Chat ID</Label>
                  <Input 
                    id="tg-chat-id"
                    placeholder="e.g. 12345678"
                    value={telegramChatId}
                    onChange={(e) => setTelegramChatId(e.target.value)}
                    disabled={!telegramEnabled}
                  />
                </div>
              </div>
              
              <div className="p-3.5 bg-blue-50/45 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-900/30 rounded-lg text-[11px] leading-relaxed text-blue-700 dark:text-blue-400">
                <span className="font-bold">Instructions: </span>
                To get a Telegram Chat ID, start a conversation with your custom bot or use <span className="font-bold">@userinfobot</span>. Add the credentials above and click save to verify integration.
              </div>
            </CardContent>
          </Card>

          {/* Email Digest Settings */}
          <Card>
            <CardHeader className="flex flex-row items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-base font-bold flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-purple-650" />
                  <span>Email Notification Digests</span>
                </CardTitle>
                <CardDescription className="text-xs">Configure how often we email you summary stats of campaigns</CardDescription>
              </div>

              {/* Toggle Switch */}
              <button 
                onClick={() => setEmailDigestEnabled(!emailDigestEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer focus:outline-none ${
                  emailDigestEnabled ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-800"
                }`}
              >
                <span 
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    emailDigestEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </CardHeader>
            <CardContent className={`space-y-4 transition-opacity duration-200 ${emailDigestEnabled ? "opacity-100" : "opacity-50 pointer-events-none"}`}>
              <div className="space-y-1.5">
                <Label>Digest Schedule Frequency</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "instantly", label: "Instantly", desc: "For every incoming reply" },
                    { id: "daily", label: "Daily Summary", desc: "Every evening at 6 PM" },
                    { id: "weekly", label: "Weekly Digest", desc: "Friday afternoon recap" },
                  ].map((freq) => (
                    <button
                      key={freq.id}
                      onClick={() => setEmailDigestFreq(freq.id)}
                      disabled={!emailDigestEnabled}
                      className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                        emailDigestFreq === freq.id
                          ? "border-blue-600 bg-blue-50/15 dark:border-blue-900/30 dark:bg-blue-950/20"
                          : "border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-850/50"
                      }`}
                    >
                      <p className="text-xs font-bold text-gray-950 dark:text-white">{freq.label}</p>
                      <p className="text-[10px] text-gray-450 mt-0.5 leading-snug">{freq.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-end p-4 border-t border-gray-100 dark:border-gray-850 bg-gray-50/50 dark:bg-gray-900/30 rounded-b-lg">
              <Button onClick={handleSave} className="flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>{saveSuccess ? "Settings Saved!" : "Save Alert Settings"}</span>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right Side: Notification Logs History */}
        <div className="space-y-6">
          <Card className="min-h-[400px]">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center space-x-2">
                <History className="h-4.5 w-4.5 text-gray-500" />
                <span>Alert Notification Logs</span>
              </CardTitle>
              <CardDescription className="text-xs">History logs of sent system alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {historyLogs.map((log) => (
                <div key={log.id} className="p-3.5 border border-gray-150 dark:border-gray-800 rounded-lg text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <Badge 
                      variant={
                        log.type === "Success" 
                          ? "success" 
                          : log.type === "Info" 
                          ? "info" 
                          : "warning"
                      }
                    >
                      {log.type}
                    </Badge>
                    <span className="text-[10px] text-gray-450">{log.time}</span>
                  </div>
                  <p className="text-gray-750 dark:text-gray-300 font-medium leading-relaxed">{log.event}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

      </div>

    </div>
  )
}
