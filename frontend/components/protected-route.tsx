"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login")
        }
    }, [isAuthenticated, router])

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
                <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
            </div>
        )
    }

    return <>{children}</>
}
