import { useAuthContext } from "@/stores/context/AuthContext";
import { useTabsHistoryContext } from "@/stores/context/tabsHistoryContext";
import * as NavigationBar from "expo-navigation-bar";
import {
    RelativePathString,
    Stack,
    usePathname,
    useRouter
} from "expo-router";
import { useEffect } from "react";

const AuthLayout = () => {
    const {
        session,
        loading
    } = useAuthContext();

    const { pathname } = useTabsHistoryContext();
    const currentPath = usePathname();

    const router = useRouter();

    useEffect(() => {
        NavigationBar.setVisibilityAsync("visible");
    }, [])

    useEffect(() => {
        if (loading || !session || currentPath === "/auth/setPassword") return;

        const publicPaths = ["/", "/home"];
        const redirection = publicPaths.includes(pathname) ? "/(tabs)/account" : pathname;
        router.replace(redirection as RelativePathString);
    }, [
        loading,
        session
    ])

    return <Stack screenOptions={{ headerShown: false }} />
}

export default AuthLayout;