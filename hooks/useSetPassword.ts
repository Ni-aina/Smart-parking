import { supabase } from "@/lib/supabase";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

const extractParams = (url: string) => {
    const params = new URLSearchParams()
    const parts = url.split("#")
    if (parts[1]) {
        const hashParams = new URLSearchParams(parts[1])
        hashParams.forEach((value, key) => {
            params.set(key, value)
        })
    }
    const queryPart = parts[0].split("?")[1]
    if (queryPart) {
        const queryParams = new URLSearchParams(queryPart)
        queryParams.forEach((value, key) => {
            if (!params.has(key)) {
                params.set(key, value)
            }
        })
    }
    return params
}

const isSetPasswordLink = (url: string) => {
    const parsed = Linking.parse(url)
    const fullPath = [parsed.hostname, parsed.path].filter(Boolean).join("/")
    return fullPath.includes("setPassword") ||
        url.includes("setPassword") ||
        url.includes("type=invite") ||
        url.includes("type=recovery")
}

export const useSetPasswordDeepLink = () => {
    const [isDeepLinkHandling, setIsDeepLinkHandling] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const handleUrl = async (url: string) => {
            try {
                if (!isSetPasswordLink(url)) {
                    return
                }

                const params = extractParams(url)
                const accessToken = params.get("access_token")
                const refreshToken = params.get("refresh_token")
                const code = params.get("code")
                const tokenHash = params.get("token_hash") || params.get("token")
                const type = params.get("type")

                let sessionSet = false

                if (accessToken && refreshToken) {
                    const { error } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken
                    })
                    if (!error) {
                        sessionSet = true
                    }
                } else if (code) {
                    const { error } = await supabase.auth.exchangeCodeForSession(code)
                    if (!error) {
                        sessionSet = true
                    }
                } else if (tokenHash && type) {
                    const { error } = await supabase.auth.verifyOtp({
                        token_hash: tokenHash,
                        type: type as "invite" | "recovery" | "signup" | "email"
                    })
                    if (!error) {
                        sessionSet = true
                    }
                }

                if (sessionSet) {
                    router.replace("/auth/setPassword")
                }
            } finally {
                setIsDeepLinkHandling(false)
            }
        }

        Linking.getInitialURL()
            .then((url) => {
                if (url) {
                    handleUrl(url)
                } else {
                    setIsDeepLinkHandling(false)
                }
            })
            .catch(() => {
                setIsDeepLinkHandling(false)
            })

        const subscription = Linking.addEventListener("url", (event) => {
            handleUrl(event.url)
        })

        return () => {
            subscription.remove()
        }
    }, [])

    return {
        isDeepLinkHandling
    }
}