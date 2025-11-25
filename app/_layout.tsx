import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { initI18n } from '@/i18n';
import { AuthContextProvider } from '@/stores/context/AuthContext';
import { TabsHistoryContextProvider } from '@/stores/context/tabsHistoryContext';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect, useLayoutEffect } from 'react';
import { useColorScheme } from 'react-native';

const queryClient = new QueryClient();

const RootLayout = () => {
  const colorScheme = useColorScheme();
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname.startsWith("/lotDetails"))
      NavigationBar.setVisibilityAsync("hidden");
  }, [pathname])

  useLayoutEffect(() => {
    const initLang = async () => {
      await initI18n();
    }
    initLang();
  }, [])

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <TabsHistoryContextProvider>
        <AuthContextProvider>
          <QueryClientProvider client={queryClient}>
            <Stack
              screenOptions={{
                headerShown: false
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="+not-found" />
            </Stack>
          </QueryClientProvider>
        </AuthContextProvider>
      </TabsHistoryContextProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  )
}

export default RootLayout;
