import { supabase } from "@/lib/supabase";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export const useSetPasswordDeepLink = () => {
    const router = useRouter()

    useEffect(() => {
        const handleUrl = async (event: { url: string }) => {
            const parsed = Linking.parse(event.url)
            if (parsed.path === "auth/setPassword") {
                const accessToken = parsed.queryParams?.access_token as string
                const refreshToken = parsed.queryParams?.refresh_token as string
                if (accessToken && refreshToken) {
                    await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken
                    })
                    router.push("/auth/setPassword")
                }
            }
        }

        const subscription = Linking.addEventListener("url", handleUrl)

        Linking.getInitialURL().then((url) => {
            if (url) {
                handleUrl({ url })
            }
        })

        return () => {
            subscription.remove()
        }
    }, [])
}