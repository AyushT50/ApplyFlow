import { useNavigate } from "react-router-dom"
import { Briefcase, Check } from "lucide-react"
import { supabaseService } from "../services/supabase"
import { Button } from "../components/ui/button"

export default function Login() {
  const navigate = useNavigate()

  const handleGoogleSignIn = async () => {
    const { data } = await supabaseService.auth.signInWithGoogle()
    if (data.user) {
      navigate("/dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-gray-55 dark:bg-gray-950 flex flex-col justify-center items-center py-12 px-6 font-sans">
      <div className="bg-white dark:bg-gray-905 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* Left pane: Marketing and value proposition */}
        <div className="bg-blue-600 p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle design circles */}
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-blue-500 blur-2xl opacity-50 -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-indigo-500 blur-3xl opacity-30 -ml-24 -mb-24" />

          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center space-x-2.5 mb-8">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-blue-600 shadow-md">
                <Briefcase className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">ApplyFlow</span>
            </div>

            {/* Header */}
            <h2 className="text-3xl font-extrabold leading-tight mb-6">
              Skip the manual application grind.
            </h2>

            {/* Features check list */}
            <ul className="space-y-4 text-sm font-medium">
              {[
                "Personalized email drafting with smart variables",
                "Direct API sending through your Gmail account",
                "Automatic classification of recruiter replies",
                "Comprehensive analytics and response monitoring",
              ].map((text, i) => (
                <li key={i} className="flex items-start space-x-3">
                  <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative z-10 mt-8 pt-6 border-t border-white/20">
            <p className="text-xs text-blue-100 font-medium">
              "ApplyFlow doubled my response rate by personalizing and automating my recruiter cold emails."
            </p>
            <p className="text-xs font-bold mt-2 text-white">— Senior React Dev, Berlin</p>
          </div>
        </div>

        {/* Right pane: Auth Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center bg-white dark:bg-gray-900">
          <div className="w-full max-w-sm mx-auto space-y-6">
            <div className="text-center md:text-left space-y-2">
              <h3 className="text-2xl font-bold text-gray-950 dark:text-white">Create your account</h3>
              <p className="text-xs text-gray-450 dark:text-gray-400">
                Get started today. Sign in using your Google account to authorize outreach campaigns.
              </p>
            </div>

            {/* Google Sign In Button */}
            <Button 
              onClick={handleGoogleSignIn}
              variant="outline" 
              className="w-full py-6 flex items-center justify-center space-x-3 border-gray-200 dark:border-gray-850 hover:bg-gray-50 dark:hover:bg-gray-805 cursor-pointer text-gray-700 dark:text-gray-200"
            >
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
              </svg>
              <span className="font-semibold text-sm">Sign in with Google</span>
            </Button>

            <div className="relative flex py-2 items-center text-xs text-gray-400">
              <div className="flex-grow border-t border-gray-150 dark:border-gray-800" />
              <span className="flex-shrink mx-4 text-[10px] uppercase font-bold tracking-wider">Secured via OAuth2</span>
              <div className="flex-grow border-t border-gray-150 dark:border-gray-800" />
            </div>

            {/* Explanatory disclaimer */}
            <p className="text-[10px] text-gray-450 dark:text-gray-400 leading-relaxed text-center md:text-left">
              By signing in, you connect your account details and grant access to configure your sending preferences. We use industry-standard encryption to protect your data. See our Privacy Policy.
            </p>

            <div className="text-center pt-2">
              <button 
                onClick={() => navigate("/")}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                ← Back to landing page
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
