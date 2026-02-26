"use client"

import { AuroraBackground } from "@/components/ui/aurora-background"
import { Button } from "@/components/ui/liquid-button"
import { ArrowRight, Target, Zap, Users, CheckCircle, Moon, Mic, Star, BookOpen, Bot } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Typewriter } from "react-simple-typewriter"

export default function LandingPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  // Button gradient styles
  const buttonGradient =
    "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 shadow-lg shadow-orange-500/30 hover:from-pink-500 hover:to-purple-500"


  const handleGetStarted = () => {
    window.location.href = "/register"
  }
  const handleDemo = () => {
    // TODO: Add actual demo video link
    window.open("https://youtube.com", "_blank")
  }

  return (
    <AuroraBackground>
      {/* Main content layered on top */}
      <div className="relative z-10 min-h-screen">
        <nav className="flex items-center justify-between p-6 lg:px-8 border-b border-gray-800/50">
          <div className="flex items-center space-x-3">
            {/* Enhanced Logo */}
            <div className="relative flex items-center justify-center">
              <span className="absolute w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-orange-300 blur-md opacity-70 animate-pulse" />
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 via-pink-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25 border-2 border-white dark:border-zinc-900 relative z-10">
                <Bot className="w-7 h-7 text-black dark:text-white" />
              </div>
            </div>
            <span className="ml-2 text-4xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent drop-shadow-lg select-none" style={{ letterSpacing: "-0.03em" }}>
              Job<span className="text-gray-900 dark:text-white">Fynx</span><span className="text-orange-400">AI</span>
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <a href="/dashboard" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-purple-500 dark:hover:text-purple-400 transition-colors">
              Dashboard
            </a>
            <a href="/register" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-purple-500 dark:hover:text-purple-400 transition-colors">
              New Interview
            </a>
            {mounted && (
              <button
                aria-label="Toggle dark mode"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="focus:outline-none"
              >
                <Moon className="w-6 h-6 text-gray-400 hover:text-white dark:text-yellow-400 dark:hover:text-yellow-300 transition-colors duration-200 cursor-pointer" />
              </button>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <div className="text-center px-6 mt-20">
          <h1 className="text-2xl lg:text-7xl font-extrabold mb-8 leading-tight tracking-tight">
            <span className="bg-gradient-to-r font-light from-gray-700 via-white to-gray-700 bg-clip-text text-transparent">
              AI-Powered
            </span>
            <br />
            <span className="bg-gradient-to-r font-light from-purple-600 via-red-300 to-orange-700 bg-clip-text text-transparent">
              <Typewriter
                words={["Technical", "Behavioral", "System Design", "Coding", "HR"]}
                loop={0}
                cursor
                cursorStyle="|"
                typeSpeed={90}
                deleteSpeed={60}
                delaySpeed={1200}
              /> Interviews
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 font-normal mb-12 max-w-3xl mx-auto leading-relaxed tracking-wide">
            Practice real-world interviews with instant feedback anytime, anywhere. Boost your confidence and get ready to ace your next opportunity.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
            <Button
              size="lg"
              className={`text-white font-semibold px-12 py-6 text-lg rounded-full transition-transform transform hover:scale-105 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 shadow-lg`}
              onClick={handleGetStarted}
            >
              Get Started
              <Zap className="ml-3 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-gray-300 text-gray-800 dark:text-gray-200 hover:bg-white hover:text-black dark:hover:bg-zinc-800 dark:hover:text-white px-12 py-6 text-lg rounded-full transition-all duration-300"
              onClick={handleDemo}
            >
              Watch Demo
              <ArrowRight className="ml-3 w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Feature Cards Section */}
        <section className="max-w-6xl mx-auto mt-2 mb-16 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-white dark:bg-zinc-900 shadow-md border border-gray-200 dark:border-zinc-800 transition-shadow duration-300 hover:shadow-[0_0_24px_0_rgba(168,85,247,0.4)] hover:border-purple-400 dark:hover:shadow-[0_0_32px_0_rgba(168,85,247,0.5)] dark:hover:border-purple-400">
              <Mic className="w-12 h-12 text-purple-500 mb-4" />
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Interactive Interviews</h3>
              <p className="text-gray-600 dark:text-gray-300">Talk directly with our AI bot for a near real-time interview experience. Step into a lifelike interview setting that captures the feel and complexity of an in-person interview.</p>
            </div>
            <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-white dark:bg-zinc-900 shadow-md border border-gray-200 dark:border-zinc-800 transition-shadow duration-300 hover:shadow-[0_0_24px_0_rgba(251,146,60,0.4)] hover:border-orange-400 dark:hover:shadow-[0_0_32px_0_rgba(251,146,60,0.5)] dark:hover:border-orange-400">
              <Star className="w-12 h-12 text-orange-400 mb-4" />
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Personalized Feedback</h3>
              <p className="text-gray-600 dark:text-gray-300">Receive detailed, rated feedback on your technical and communication skills. Our AI analyzes every response and provides valuable guidelines to sharpen your interview skills.</p>
            </div>
            <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-white dark:bg-zinc-900 shadow-md border border-gray-200 dark:border-zinc-800 transition-shadow duration-300 hover:shadow-[0_0_24px_0_rgba(236,72,153,0.4)] hover:border-pink-400 dark:hover:shadow-[0_0_32px_0_rgba(236,72,153,0.5)] dark:hover:border-pink-400">
              <BookOpen className="w-12 h-12 text-pink-500 mb-4" />
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Review Your Responses</h3>
              <p className="text-gray-600 dark:text-gray-300">Go through the full transcript of your interview to spot key areas for improvement. Enhance your communication skills by adding structure, fluency, and clarity to your responses.</p>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="max-w-5xl mx-auto mt-10 mb-24 px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white dark:bg-zinc-900 shadow border border-gray-200 dark:border-zinc-800 transition-shadow duration-300 hover:shadow-[0_0_20px_0_rgba(168,85,247,0.4)] hover:border-purple-400 dark:hover:shadow-[0_0_28px_0_rgba(168,85,247,0.5)] dark:hover:border-purple-400">
              <Target className="w-10 h-10 text-purple-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Personalized Interviews</h3>
              <p className="text-gray-600 dark:text-gray-300">Choose your role, experience level, and get tailored questions for your dream job.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white dark:bg-zinc-900 shadow border border-gray-200 dark:border-zinc-800 transition-shadow duration-300 hover:shadow-[0_0_20px_0_rgba(251,146,60,0.4)] hover:border-orange-400 dark:hover:shadow-[0_0_28px_0_rgba(251,146,60,0.5)] dark:hover:border-orange-400">
              <Users className="w-10 h-10 text-orange-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Real-Time Feedback</h3>
              <p className="text-gray-600 dark:text-gray-300">Get instant, actionable feedback to improve your answers and boost your confidence.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white dark:bg-zinc-900 shadow border border-gray-200 dark:border-zinc-800 transition-shadow duration-300 hover:shadow-[0_0_20px_0_rgba(236,72,153,0.4)] hover:border-pink-400 dark:hover:shadow-[0_0_28px_0_rgba(236,72,153,0.5)] dark:hover:border-pink-400">
              <CheckCircle className="w-10 h-10 text-pink-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Track Your Progress</h3>
              <p className="text-gray-600 dark:text-gray-300">Monitor your improvement over time and get tips to ace your next interview.</p>
            </div>
          </div>
        </section>

        {/* Why Choose JobFixAI Section */}
        <section className="max-w-3xl mx-auto mb-16 px-4">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">Why Choose JobFynxAI?</h2>
          <ul className="flex flex-col gap-6 items-start md:items-center">
            <li className="flex items-start gap-3">
              <span className="mt-1"><CheckCircle className="w-6 h-6 text-purple-500" /></span>
              <span className="text-lg text-gray-800 dark:text-gray-200">Realistic, AI-driven mock interviews for any role or experience level.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1"><CheckCircle className="w-6 h-6 text-orange-400" /></span>
              <span className="text-lg text-gray-800 dark:text-gray-200">Instant, actionable feedback to help you improve with every session.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1"><CheckCircle className="w-6 h-6 text-pink-500" /></span>
              <span className="text-lg text-gray-800 dark:text-gray-200">Track your progress and build confidence for your next big opportunity.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1"><CheckCircle className="w-6 h-6 text-cyan-500" /></span>
              <span className="text-lg text-gray-800 dark:text-gray-200">Practice anytime, anywhere—no scheduling, no pressure.</span>
            </li>
          </ul>
        </section>

        {/* Footer */}
        <footer className="w-full border-t border-gray-200 dark:border-zinc-800 py-8 bg-white/80 dark:bg-zinc-900/80">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">JobFynxAI</span>
              <span className="text-xs text-gray-500">© {new Date().getFullYear()} All rights reserved.</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400">
              <a href="#" className="hover:text-purple-500 transition">Privacy Policy</a>
              <a href="#" className="hover:text-purple-500 transition">Terms</a>
              <a href="#" className="hover:text-purple-500 transition">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </AuroraBackground>
  )
}
