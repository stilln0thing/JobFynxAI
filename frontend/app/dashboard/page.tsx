"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/liquid-button"
import { apiGet } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import {
    Loader2, Plus, Calendar, User, CheckCircle2, Clock, AlertCircle,
    ArrowRight, Bot, LogOut
} from "lucide-react"

interface Interview {
    id: string
    userName: string
    status: string
    created_at: string
    resumePath: string
}

function DashboardContent() {
    const router = useRouter()
    const { user, logout } = useAuth()
    const [interviews, setInterviews] = useState<Interview[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                const data = await apiGet<Interview[]>("/api/interviews")
                setInterviews(data || [])
            } catch (err: any) {
                setError(err.message || "Failed to load interviews.")
            } finally {
                setLoading(false)
            }
        }
        fetchInterviews()
    }, [])

    const getStatusColor = (status: string) => {
        switch (status?.toUpperCase()) {
            case "REGISTERED":
                return "text-blue-500 bg-blue-500/10 border-blue-500/30"
            case "IN_PROGRESS":
                return "text-orange-500 bg-orange-500/10 border-orange-500/30"
            case "COMPLETED":
                return "text-green-500 bg-green-500/10 border-green-500/30"
            case "EVALUATED":
                return "text-purple-500 bg-purple-500/10 border-purple-500/30"
            default:
                return "text-gray-500 bg-gray-500/10 border-gray-500/30"
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status?.toUpperCase()) {
            case "REGISTERED":
                return <Clock className="w-4 h-4" />
            case "IN_PROGRESS":
                return <Loader2 className="w-4 h-4 animate-spin" />
            case "COMPLETED":
                return <CheckCircle2 className="w-4 h-4" />
            case "EVALUATED":
                return <CheckCircle2 className="w-4 h-4" />
            default:
                return <AlertCircle className="w-4 h-4" />
        }
    }

    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            })
        } catch {
            return dateStr
        }
    }

    const handleLogout = () => {
        logout()
        router.push("/")
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            {/* Header */}
            <nav className="flex items-center justify-between p-6 lg:px-8 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/")}>
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 via-pink-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                        <Bot className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                        JobFynxAI
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    {user && (
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            Hi, <strong className="text-gray-900 dark:text-white">{user.username}</strong>
                        </span>
                    )}
                    <Button
                        onClick={() => router.push("/register")}
                        className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white"
                    >
                        <Plus className="w-4 h-4 mr-2" /> New Interview
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-1" /> Logout
                    </Button>
                </div>
            </nav>

            <div className="max-w-5xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Your Interviews</h1>

                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
                    </div>
                )}

                {error && (
                    <Card className="p-8 text-center bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-900/30">
                        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-300">{error}</p>
                    </Card>
                )}

                {!loading && !error && interviews.length === 0 && (
                    <Card className="p-12 text-center bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-orange-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar className="w-10 h-10 text-purple-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">No Interviews Yet</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Start your first AI-powered mock interview to practice and improve your skills.
                        </p>
                        <Button
                            onClick={() => router.push("/register")}
                            className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Start Your First Interview
                        </Button>
                    </Card>
                )}

                {!loading && !error && interviews.length > 0 && (
                    <div className="grid gap-4">
                        {interviews.map((interview) => (
                            <Card
                                key={interview.id}
                                className="p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300 cursor-pointer group"
                                onClick={() => router.push(`/interviews/${interview.id}`)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
                                            <User className="w-6 h-6 text-purple-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {interview.userName || "Interview"}
                                            </h3>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {formatDate(interview.created_at)}
                                                </span>
                                                <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium flex items-center gap-1 ${getStatusColor(interview.status)}`}>
                                                    {getStatusIcon(interview.status)}
                                                    {interview.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <DashboardContent />
        </ProtectedRoute>
    )
}
