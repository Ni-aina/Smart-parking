import { supabase } from "@/lib/supabase";
import { useAuthContext } from "@/stores/context/AuthContext";
import { useTabsHistoryContext } from "@/stores/context/tabsHistoryContext";
import * as Linking from "expo-linking";
import * as NavigationBar from "expo-navigation-bar";
import { RelativePathString, Stack, usePathname, useRouter } from "expo-router";
import { useEffect } from "react";

const AuthLayout = () => {
    const {
        session,
        loading
    } = useAuthContext();

    const {
        pathname: pathnameHistory
    } = useTabsHistoryContext();

    const pathname = usePathname();

    const router = useRouter();

    useEffect(() => {
        NavigationBar.setVisibilityAsync("visible");
    }, [])

    useEffect(() => {
        if (loading) return;

        if (pathname === "/auth/setPassword") {

            if (session) return;

            (async () => {
                const url = await Linking.getInitialURL()

                const token = url ? Linking.parse(url).queryParams?.token as string | undefined : undefined

                if (!token) {
                    router.replace("/(tabs)" as RelativePathString);
                    return;
                }

                const { error } = await supabase.auth.verifyOtp({
                    token_hash: token,
                    type: "invite"
                })

                if (error) {
                    router.replace("/(tabs)" as RelativePathString);
                    return;
                }
            })()
        }

        if (session) {
            const publicPaths = ["/", "/home"];
            const redirection = publicPaths.includes(pathnameHistory) ? "/(tabs)/account" : pathnameHistory;
            if (pathname !== "/auth/setPassword") router.replace(redirection as RelativePathString);
        }
    }, [
        loading,
        session
    ])

    return <Stack screenOptions={{ headerShown: false }} />
}

export default AuthLayout;