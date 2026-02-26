"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/liquid-button"
import { Input } from "@/components/ui/input"
import { Loader2, Bot, Lock, User, Eye, EyeOff } from "lucide-react"
import { apiPost } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"

export default function LoginPage() {
    const router = useRouter()
    const { login, isAuthenticated } = useAuth()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    // If already logged in, redirect
    if (isAuthenticated) {
        router.push("/dashboard")
        return null
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        if (!username.trim()) {
            setError("Please enter your username.")
            return
        }
        if (!password) {
            setError("Please enter your password.")
            return
        }
        setLoading(true)
        try {
            const data = await apiPost<{ username: string; role: string }>("/api/login", {
                username,
                password,
            })
            login(data.username, data.role)
            router.push("/dashboard")
        } catch (err: any) {
            setError(err.message || "Invalid credentials. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
            {/* Background blobs */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] bg-purple-500 opacity-20 blur-3xl rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] bg-orange-400 opacity-20 blur-3xl rounded-full" />
                <div className="absolute top-[30%] right-[10%] w-[200px] h-[200px] bg-pink-400 opacity-15 blur-2xl rounded-full" />
            </div>

            <Card className="relative z-10 w-full max-w-md p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative flex items-center justify-center mb-4">
                        <span className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-orange-300 blur-md opacity-60 animate-pulse" />
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-400 via-pink-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25 border-2 border-white dark:border-zinc-900 relative z-10">
                            <Bot className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                        JobFynxAI
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sign in to continue</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="login-username">
                            Username
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                id="login-username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                className="pl-10"
                                autoComplete="username"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="login-password">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                id="login-password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="pl-10 pr-10"
                                autoComplete="current-password"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm font-medium bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-lg px-3 py-2">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        size="lg"
                        className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-shadow"
                        disabled={loading}
                    >
                        {loading ? (
                            <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Signing in...</>
                        ) : (
                            "Sign In"
                        )}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-400">
                        Use the credentials provided by your administrator
                    </p>
                </div>
            </Card>
        </div>
    )
}
