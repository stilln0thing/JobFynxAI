"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState, useRef, Suspense } from "react"
import { Button } from "@/components/ui/liquid-button"
import { Card } from "@/components/ui/card"
import { apiPost } from "@/lib/api"
import { ProtectedRoute } from "@/components/protected-route"
import { Mic, MicOff, PhoneOff, Loader2, Bot, User, AlertCircle } from "lucide-react"

function PlaygroundContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const interviewId = searchParams.get("interviewId")

    const [token, setToken] = useState<string | null>(null)
    const [connected, setConnected] = useState(false)
    const [connecting, setConnecting] = useState(false)
    const [error, setError] = useState("")
    const [muted, setMuted] = useState(false)
    const [elapsed, setElapsed] = useState(0)
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    // Connect to interview room
    const connectToRoom = async () => {
        if (!interviewId) {
            setError("No interview ID provided.")
            return
        }
        setConnecting(true)
        setError("")
        try {
            const data = await apiPost("/api/connect", { interviewId })
            setToken(data.token)
            setConnected(true)
            // Start timer
            timerRef.current = setInterval(() => {
                setElapsed(prev => prev + 1)
            }, 1000)
        } catch (err: any) {
            setError(err.message || "Failed to connect to interview room.")
        } finally {
            setConnecting(false)
        }
    }

    // Disconnect
    const handleDisconnect = async () => {
        if (timerRef.current) clearInterval(timerRef.current)
        try {
            await apiPost("/api/disconnect", {
                roomName: interviewId,
                userId: "user",
            })
        } catch {
            // Best effort
        }
        setConnected(false)
        setToken(null)
        router.push(`/interviews/${interviewId}`)
    }

    // Auto-connect on mount
    useEffect(() => {
        if (interviewId && !connected && !connecting) {
            connectToRoom()
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [interviewId])

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60)
        const s = secs % 60
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
    }

    if (!interviewId) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
                <Card className="p-8 max-w-md text-center bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
                    <AlertCircle className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">No Interview Selected</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Please register for an interview first.
                    </p>
                    <Button onClick={() => router.push("/register")} className="w-full">
                        Register for Interview
                    </Button>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 via-pink-500 to-cyan-400 rounded-xl flex items-center justify-center">
                        <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 dark:text-white">JobFynxAI Interview</h1>
                        <p className="text-xs text-gray-500">
                            {connected ? (
                                <span className="text-green-500 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Live — {formatTime(elapsed)}
                                </span>
                            ) : (
                                "Waiting to connect..."
                            )}
                        </p>
                    </div>
                </div>
                {connected && (
                    <Button variant="destructive" size="sm" onClick={handleDisconnect}>
                        <PhoneOff className="w-4 h-4 mr-2" /> End Interview
                    </Button>
                )}
            </div>

            {/* Main content */}
            <div className="flex-1 flex items-center justify-center p-8">
                {error && (
                    <Card className="p-8 max-w-md text-center bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-900/30">
                        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Connection Error</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
                        <Button onClick={connectToRoom} className="w-full">
                            Retry Connection
                        </Button>
                    </Card>
                )}

                {connecting && (
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-16 h-16 text-purple-500 animate-spin" />
                        <p className="text-lg text-gray-700 dark:text-gray-300">Connecting to interview room...</p>
                    </div>
                )}

                {connected && !error && (
                    <div className="w-full max-w-4xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* AI Interviewer */}
                            <Card className="p-8 flex flex-col items-center justify-center bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 min-h-[300px]">
                                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-purple-500/20">
                                    <Bot className="w-12 h-12 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI Interviewer</h3>
                                <p className="text-sm text-gray-500 mt-1">Listening...</p>
                                <div className="mt-4 flex gap-2">
                                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                    <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                    <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                </div>
                            </Card>

                            {/* Candidate */}
                            <Card className="p-8 flex flex-col items-center justify-center bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 min-h-[300px]">
                                <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/20">
                                    <User className="w-12 h-12 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">You</h3>
                                <p className="text-sm text-gray-500 mt-1">{muted ? "Muted" : "Speaking"}</p>
                            </Card>
                        </div>

                        {/* Controls */}
                        <div className="flex justify-center gap-4 mt-8">
                            <Button
                                variant={muted ? "destructive" : "outline"}
                                size="lg"
                                className="rounded-full w-16 h-16"
                                onClick={() => setMuted(!muted)}
                            >
                                {muted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                            </Button>
                            <Button
                                variant="destructive"
                                size="lg"
                                className="rounded-full w-16 h-16"
                                onClick={handleDisconnect}
                            >
                                <PhoneOff className="w-6 h-6" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default function PlaygroundPage() {
    return (
        <ProtectedRoute>
            <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
                    <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
                </div>
            }>
                <PlaygroundContent />
            </Suspense>
        </ProtectedRoute>
    )
}
