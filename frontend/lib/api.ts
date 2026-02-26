const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export async function apiPost<T = any>(path: string, body?: any): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
    })
    if (!res.ok) {
        const data = await res.json().catch(() => ({ error: res.statusText }))
        throw new Error(data.error || res.statusText)
    }
    return res.json()
}

export async function apiGet<T = any>(path: string): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`)
    if (!res.ok) {
        const data = await res.json().catch(() => ({ error: res.statusText }))
        throw new Error(data.error || res.statusText)
    }
    return res.json()
}

export async function apiUpload<T = any>(path: string, file: File): Promise<T> {
    const formData = new FormData()
    formData.append("file", file)
    const res = await fetch(`${API_BASE}${path}`, {
        method: "POST",
        body: formData,
    })
    if (!res.ok) {
        const data = await res.json().catch(() => ({ error: res.statusText }))
        throw new Error(data.error || res.statusText)
    }
    return res.json()
}

export async function apiDelete<T = any>(path: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${API_BASE}${path}`)
    if (params) {
        Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
    }
    const res = await fetch(url.toString(), { method: "DELETE" })
    if (!res.ok) {
        const data = await res.json().catch(() => ({ error: res.statusText }))
        throw new Error(data.error || res.statusText)
    }
    return res.json()
}
