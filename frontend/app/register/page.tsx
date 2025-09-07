"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/liquid-button"
import { Input } from "@/components/ui/input"
import { Dialog } from "@/components/ui/dialog"
import { CheckCircle, Upload, FileText, Loader2, User } from "lucide-react"

const instructions = [
  "Make sure you are using a stable internet connection to avoid disruptions.",
  "Find a quiet, well-lit location with minimal background noise.",
  "Grant camera and microphone permissions in your browser.",
  "Ensure you are using a modern browser (Chrome or Firefox).",
]

export default function RegisterPage() {
  const router = useRouter()
  const [interview, setInterview] = useState({ id: "", name: "", resumeSummary: "" })
  const [submitted, setSubmitted] = useState(false)
  const [fileName, setFileName] = useState("")
  const [filePath, setFilePath] = useState("")
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [name, setName] = useState("")
  const [error, setError] = useState("")

  // Handle file upload (mocked for now)
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true)
    setError("")
    const file = e.target.files?.[0]
    if (!file) return setLoading(false)
    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.")
      setLoading(false)
      return
    }
    // Simulate upload
    setTimeout(() => {
      setFileName(file.name)
      setFilePath("/uploads/" + file.name)
      setLoading(false)
    }, 1200)
  }

  // Remove uploaded file
  const handleRemove = () => {
    setFileName("")
    setFilePath("")
  }

  // Register for interview (mocked)
  const handleRegister = async (e: React.FormEvent) => {
    setSubmitted(true)

    e.preventDefault()
    setLoading(true)
    setError("")
    if (!name) {
      setError("Please enter your name.")
      setLoading(false)
      return
    }
    if (!fileName) {
      setError("Please upload your resume (PDF).")
      setLoading(false)
      return
    }
    // Simulate API call
    setTimeout(() => {
      setInterview({ id: "12345", name, resumeSummary: "A summary of your resume." })
      setIsModalOpen(true)
      setLoading(false)
    }, 1200)
  }

  // Start interview (mocked)
  const startInterview = () => {
    setIsModalOpen(false)
    // Here you would connect to the interview room, etc.
    router.push("/playground")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-transparent px-4 py-12">
      {!submitted && (
      <Card className="w-full max-w-lg p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">New Interview</h2>
        <form className="space-y-6" onSubmit={handleRegister}>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="name">
              Name
            </label>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-purple-500" />
              {interview.id ? (
                <span className="text-gray-900 dark:text-white font-semibold">{interview.name}</span>
              ) : (
                <Input
                  id="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full"
                  disabled={!!interview.id}
                />
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="resume">
              Resume (PDF)
            </label>
            {interview.id ? (
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-400" />
                <span className="text-gray-900 dark:text-white font-semibold">{fileName}</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    id="resume"
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleUpload}
                    disabled={!!fileName || loading}
                  />
                  <Button type="button" className="flex items-center gap-2" disabled={!!fileName || loading}>
                    <Upload className="w-5 h-5" /> Upload PDF
                  </Button>
                </label>
                {fileName && (
                  <>
                    <span className="text-gray-900 dark:text-white font-semibold">{fileName}</span>
                    <Button type="button" variant="outline" size="sm" onClick={handleRemove} disabled={loading}>
                      Remove
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
          {error && <div className="text-red-500 text-sm font-medium">{error}</div>}
          <Button type="submit" size="lg" className="w-full mt-2" disabled={!!interview.id || loading}>
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Register"}
          </Button>
        </form>
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Before you start:</h3>
          <ul className="space-y-2">
            {instructions.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                <CheckCircle className="w-5 h-5 mt-1 text-purple-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>
      )}
      {/* Modal/Dialog for interview setup confirmation */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        {submitted && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 max-w-md w-full border border-gray-200 dark:border-zinc-800">
            <div className="flex flex-col items-center text-center">
              {loading ? (
                <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-4" />
              ) : (
                <CheckCircle className="w-10 h-10 text-green-500 mb-4" />
              )}
              <h4 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                {loading ? "Setting up your Interview!" : "Setup Complete!"}
              </h4>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {loading
                  ? "Please wait while we set up your interview."
                  : "You're ready to start! Please review the instructions below."}
              </p>
              <ul className="space-y-2 mb-4">
                {instructions.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                    <CheckCircle className="w-5 h-5 mt-1 text-purple-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button onClick={startInterview} size="lg" className="w-full" disabled={loading}>
                Start Interview
              </Button>
            </div>
          </div>
        </div>
        )}
      </Dialog>
    </div>
  )
} 