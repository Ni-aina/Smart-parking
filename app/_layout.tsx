import Loading from "@/components/ui/loading";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useSetPasswordDeepLink } from "@/hooks/useSetPassword";
import { initI18n } from "@/i18n";
import { stripePublicKey } from "@/lib/config";
import { AuthContextProvider } from "@/stores/context/AuthContext";
import { TabsHistoryContextProvider } from "@/stores/context/tabsHistoryContext";
import { ThemeProvider } from "@/stores/context/ThemeContext";
import { StripeProvider } from "@stripe/stripe-react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as NavigationBar from "expo-navigation-bar";
import { Stack, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { KeyboardProvider } from "react-native-keyboard-controller";
import "react-native-reanimated";

const queryClient = new QueryClient();

const RootNavigation = () => {
  usePushNotifications();

  return (
    <Stack
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="+not-found" />
    </Stack>
  )
}

const RootLayout = () => {
  const { isDeepLinkHandling } = useSetPasswordDeepLink();
  const [ready, setReady] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname.startsWith("/lotDetails")) {
      NavigationBar.setVisibilityAsync("hidden");
    }
  }, [pathname])

  useEffect(() => {
    const initLang = async () => {
      await initI18n();
      setReady(true);
    }
    initLang();
  }, [])

  if (!ready || isDeepLinkHandling) return <Loading />

  return (
    <ThemeProvider>
      <KeyboardProvider>
        <StripeProvider publishableKey={stripePublicKey}>
          <TabsHistoryContextProvider>
            <AuthContextProvider>
              <QueryClientProvider client={queryClient}>
                <RootNavigation />
              </QueryClientProvider>
            </AuthContextProvider>
          </TabsHistoryContextProvider>
        </StripeProvider>
        <StatusBar style="auto" />
      </KeyboardProvider>
    </ThemeProvider>
  )
}

export default RootLayout;
