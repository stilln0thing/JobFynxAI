"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface AuthUser {
    username: string
    role: string
}

interface AuthContextType {
    user: AuthUser | null
    login: (username: string, role: string) => void
    logout: () => void
    isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    login: () => { },
    logout: () => { },
    isAuthenticated: false,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [loaded, setLoaded] = useState(false)

    // Rehydrate from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem("jobfynx_user")
            if (stored) {
                setUser(JSON.parse(stored))
            }
        } catch {
            // Invalid data, ignore
        }
        setLoaded(true)
    }, [])

    const login = (username: string, role: string) => {
        const u: AuthUser = { username, role }
        setUser(u)
        localStorage.setItem("jobfynx_user", JSON.stringify(u))
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem("jobfynx_user")
    }

    // Don't render children until we've checked localStorage
    if (!loaded) return null

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    )
}
