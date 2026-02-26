"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/liquid-button"
import { apiGet } from "@/lib/api"
import {
    Loader2, ArrowLeft, Star, CheckCircle2, XCircle, MessageSquare,
    FileText, Bot, User, Sparkles, BarChart3, AlertCircle
} from "lucide-react"

interface EvaluationItem {
    question: string
    answer: string
    rating: number
    guidelines: string[]
}

interface Evaluation {
    id: string
    recommendation: string
    overallRating: number
    overallFeedback: string
    technologiesRating: number
    projectsRating: number
    communicationRating: number
    evaluationItems: EvaluationItem[]
}

interface TranscriptMessage {
    role: string
    content: string
    created_at: number
}

interface Resume {
    name: string
    technologies: string[]
    projects: any[]
    experience: string[]
    achievements: string[]
}

interface Interview {
    id: string
    userName: string
    status: string
    created_at: string
    resumePath: string
    resumeSummary: Resume | null
    transcript: TranscriptMessage[] | null
    evaluation: Evaluation | null
}

export default function InterviewDetailPage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string

    const [interview, setInterview] = useState<Interview | null>(null)
    const [loading, setLoading] = useState(true)
    const [evaluating, setEvaluating] = useState(false)
    const [error, setError] = useState("")
    const [activeTab, setActiveTab] = useState<"overview" | "transcript" | "evaluation">("overview")

    useEffect(() => {
        const fetchInterview = async () => {
            try {
                const data = await apiGet<Interview>(`/api/interviews/${id}`)
                setInterview(data)
            } catch (err: any) {
                setError(err.message || "Failed to load interview.")
            } finally {
                setLoading(false)
            }
        }
        if (id) fetchInterview()
    }, [id])

    const handleEvaluate = async () => {
        setEvaluating(true)
        try {
            const data = await apiGet<Interview>(`/api/interviews/evaluate/${id}`)
            setInterview(data)
            setActiveTab("evaluation")
        } catch (err: any) {
            setError(err.message || "Evaluation failed.")
        } finally {
            setEvaluating(false)
        }
    }

    const renderStars = (rating: number, max = 5) => {
        return (
            <div className="flex gap-0.5">
                {Array.from({ length: max }, (_, i) => (
                    <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-zinc-600"}`}
                    />
                ))}
                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">{rating.toFixed(1)}</span>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
            </div>
        )
    }

    if (error || !interview) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
                <Card className="p-8 max-w-md text-center bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-900/30">
                    <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Error</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{error || "Interview not found."}</p>
                    <Button onClick={() => router.push("/dashboard")} className="w-full">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                    </Button>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            {/* Header */}
            <nav className="flex items-center justify-between p-6 lg:px-8 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back
                    </Button>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                            {interview.userName || "Interview"}
                        </h1>
                        <p className="text-sm text-gray-500">ID: {interview.id?.slice(0, 8)}...</p>
                    </div>
                </div>
                {!interview.evaluation && (
                    <Button
                        onClick={handleEvaluate}
                        disabled={evaluating}
                        className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white"
                    >
                        {evaluating ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Evaluating...</>
                        ) : (
                            <><Sparkles className="w-4 h-4 mr-2" /> Evaluate Interview</>
                        )}
                    </Button>
                )}
            </nav>

            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Tab Navigation */}
                <div className="flex gap-1 mb-8 bg-white dark:bg-zinc-900 rounded-xl p-1 border border-gray-200 dark:border-zinc-800 w-fit">
                    {(["overview", "transcript", "evaluation"] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize ${activeTab === tab
                                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Overview Tab */}
                {activeTab === "overview" && (
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
                            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                                <User className="w-5 h-5 text-purple-500" /> Interview Details
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Name</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{interview.userName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Status</span>
                                    <span className="font-medium text-purple-500">{interview.status}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Created</span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {new Date(interview.created_at).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </Card>

                        {interview.resumeSummary && (
                            <Card className="p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
                                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-orange-400" /> Resume Summary
                                </h3>
                                {interview.resumeSummary.technologies && (
                                    <div className="mb-3">
                                        <p className="text-sm text-gray-500 mb-2">Technologies</p>
                                        <div className="flex flex-wrap gap-2">
                                            {interview.resumeSummary.technologies.map((tech, i) => (
                                                <span key={i} className="px-2.5 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full text-xs font-medium">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </Card>
                        )}

                        {interview.evaluation && (
                            <Card className="p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 md:col-span-2">
                                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-pink-500" /> Evaluation Summary
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800">
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{interview.evaluation.overallRating.toFixed(1)}</p>
                                        <p className="text-xs text-gray-500 mt-1">Overall</p>
                                    </div>
                                    <div className="text-center p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800">
                                        <p className="text-2xl font-bold text-purple-500">{interview.evaluation.technologiesRating.toFixed(1)}</p>
                                        <p className="text-xs text-gray-500 mt-1">Technologies</p>
                                    </div>
                                    <div className="text-center p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800">
                                        <p className="text-2xl font-bold text-orange-400">{interview.evaluation.projectsRating.toFixed(1)}</p>
                                        <p className="text-xs text-gray-500 mt-1">Projects</p>
                                    </div>
                                    <div className="text-center p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800">
                                        <p className="text-2xl font-bold text-pink-500">{interview.evaluation.communicationRating.toFixed(1)}</p>
                                        <p className="text-xs text-gray-500 mt-1">Communication</p>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center gap-2">
                                    {interview.evaluation.recommendation === "HIRE" ? (
                                        <span className="flex items-center gap-1 px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-sm font-medium">
                                            <CheckCircle2 className="w-4 h-4" /> HIRE
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-sm font-medium">
                                            <XCircle className="w-4 h-4" /> NOT HIRE
                                        </span>
                                    )}
                                </div>
                            </Card>
                        )}
                    </div>
                )}

                {/* Transcript Tab */}
                {activeTab === "transcript" && (
                    <Card className="p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
                        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-purple-500" /> Transcript
                        </h3>
                        {(!interview.transcript || interview.transcript.length === 0) ? (
                            <div className="text-center py-12 text-gray-500">
                                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-30" />
                                <p>No transcript available yet.</p>
                                <p className="text-sm mt-1">Complete the interview first.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {interview.transcript.map((msg, i) => (
                                    <div
                                        key={i}
                                        className={`flex gap-3 ${msg.role === "assistant" ? "" : "flex-row-reverse"}`}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "assistant"
                                                ? "bg-gradient-to-br from-purple-500 to-pink-500"
                                                : "bg-gradient-to-br from-cyan-400 to-blue-500"
                                            }`}>
                                            {msg.role === "assistant" ? (
                                                <Bot className="w-4 h-4 text-white" />
                                            ) : (
                                                <User className="w-4 h-4 text-white" />
                                            )}
                                        </div>
                                        <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${msg.role === "assistant"
                                                ? "bg-zinc-100 dark:bg-zinc-800 text-gray-900 dark:text-white"
                                                : "bg-purple-500 text-white"
                                            }`}>
                                            <p className="text-sm">{msg.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                )}

                {/* Evaluation Tab */}
                {activeTab === "evaluation" && (
                    <>
                        {!interview.evaluation ? (
                            <Card className="p-12 text-center bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
                                <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Not Evaluated Yet</h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-6">
                                    Click the &quot;Evaluate Interview&quot; button to get AI-powered feedback.
                                </p>
                                <Button
                                    onClick={handleEvaluate}
                                    disabled={evaluating}
                                    className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white"
                                >
                                    {evaluating ? (
                                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Evaluating...</>
                                    ) : (
                                        <><Sparkles className="w-4 h-4 mr-2" /> Evaluate Now</>
                                    )}
                                </Button>
                            </Card>
                        ) : (
                            <div className="space-y-6">
                                {/* Overall Feedback */}
                                <Card className="p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
                                    <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">Overall Feedback</h3>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{interview.evaluation.overallFeedback}</p>
                                    <div className="mt-4 flex items-center gap-3">
                                        <span className="text-sm text-gray-500">Overall Rating:</span>
                                        {renderStars(interview.evaluation.overallRating)}
                                    </div>
                                </Card>

                                {/* Rating Breakdown */}
                                <div className="grid gap-4 md:grid-cols-3">
                                    {[
                                        { label: "Technologies", rating: interview.evaluation.technologiesRating, color: "purple" },
                                        { label: "Projects", rating: interview.evaluation.projectsRating, color: "orange" },
                                        { label: "Communication", rating: interview.evaluation.communicationRating, color: "pink" },
                                    ].map((item) => (
                                        <Card key={item.label} className="p-5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
                                            <p className="text-sm text-gray-500 mb-2">{item.label}</p>
                                            {renderStars(item.rating)}
                                        </Card>
                                    ))}
                                </div>

                                {/* Q&A Evaluations */}
                                {interview.evaluation.evaluationItems && interview.evaluation.evaluationItems.length > 0 && (
                                    <Card className="p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
                                        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Question-by-Question</h3>
                                        <div className="space-y-6">
                                            {interview.evaluation.evaluationItems.map((item, i) => (
                                                <div key={i} className="border-b border-gray-100 dark:border-zinc-800 pb-4 last:border-0 last:pb-0">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <p className="font-medium text-gray-900 dark:text-white text-sm">Q{i + 1}: {item.question}</p>
                                                        {renderStars(item.rating)}
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                        <strong>Answer:</strong> {item.answer}
                                                    </p>
                                                    {item.guidelines && item.guidelines.length > 0 && (
                                                        <div className="mt-2">
                                                            <p className="text-xs text-gray-500 mb-1">Tips:</p>
                                                            <ul className="space-y-1">
                                                                {item.guidelines.map((g, j) => (
                                                                    <li key={j} className="text-xs text-purple-600 dark:text-purple-400 flex items-start gap-1">
                                                                        <CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0" /> {g}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </Card>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
