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
    const [isSessionSet, setIsSessionSet] = useState(false);
    const router = useRouter()

    useEffect(() => {
        if (isSessionSet) {
            setIsDeepLinkHandling(false)
            return
        }

        const handleUrl = async (url: string) => {
            if (!isSetPasswordLink(url)) {
                setIsDeepLinkHandling(false)
                return
            }

            try {
                const params = extractParams(url)
                const accessToken = params.get("access_token")
                const refreshToken = params.get("refresh_token")
                const code = params.get("code")
                const tokenHash = params.get("token_hash") || params.get("token")
                const type = (params.get("type") || "invite") as "invite" | "recovery"

                if (accessToken && refreshToken) {
                    const { error } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken
                    })
                    if (!error) setIsSessionSet(true)
                } else if (code) {
                    const { error } = await supabase.auth.exchangeCodeForSession(code)
                    if (!error) setIsSessionSet(true)
                } else if (tokenHash) {
                    const { error } = await supabase.auth.verifyOtp({
                        token_hash: tokenHash,
                        type: type
                    })
                    if (!error) setIsSessionSet(true)
                }

                if (isSessionSet) router.replace("/auth/setPassword")
            } finally {
                setIsDeepLinkHandling(false)
            }
        }

        Linking.getInitialURL().then((url) => {
            if (url) handleUrl(url)
            else setIsDeepLinkHandling(false)
        })

        const subscription = Linking.addEventListener("url", (event) => {
            handleUrl(event.url)
        })

        return () => {
            subscription.remove()
        }
    }, [router])

    return {
        isDeepLinkHandling
    }
}