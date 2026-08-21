import { supabase } from "@/lib/supabase";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

const extractTokens = (url: string) => {
    const hashPart = url.split("#")[1]
    if (!hashPart) return null

    const params = new URLSearchParams(hashPart)
    const accessToken = params.get("access_token")
    const refreshToken = params.get("refresh_token")

    if (!accessToken || !refreshToken) return null

    return {
        accessToken,
        refreshToken
    }
}

export const useSetPasswordDeepLink = () => {
    const [isDeepLinkHandling, setIsDeepLinkHandling] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const handleUrl = async (event: { url: string }) => {
            const parsed = Linking.parse(event.url)
            if (parsed.path !== "auth/setPassword") return

            const tokens = extractTokens(event.url)
            if (!tokens) return

            const { accessToken, refreshToken } = tokens

            await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken
            })

            router.push("/auth/setPassword")
        }

        const subscription = Linking.addEventListener("url", handleUrl)

        Linking.getInitialURL().then((url) => {
            if (!url) return

            handleUrl({ url })
        }).finally(() => setIsDeepLinkHandling(false))

        return () => {
            subscription.remove()
        }
    }, [])

    return {
        isDeepLinkHandling
    }
}