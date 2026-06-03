import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider as NativeThemeProvider
} from "@react-navigation/native";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
    theme: Theme;
    colorscheme: "light" | "dark";
    setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: "system",
    colorscheme: "light",
    setTheme: () => { }
})

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const systemScheme = useColorScheme() ?? "light";
    const [theme, setThemeState] = useState<Theme>("system");

    useEffect(() => {
        AsyncStorage.getItem("app_theme").then((saved) => {
            if (saved) setThemeState(saved as Theme);
        })
    }, [])

    const setTheme = (t: Theme) => {
        setThemeState(t);
        AsyncStorage.setItem("app_theme", t);
    }

    const colorscheme: "light" | "dark" =
        theme === "system" ? systemScheme : theme;

    return (
        <ThemeContext.Provider
            value={{
                theme,
                colorscheme,
                setTheme
            }}
        >
            <NativeThemeProvider
                value={colorscheme === "dark" ? DarkTheme : DefaultTheme}
            >
                {children}
            </NativeThemeProvider>
        </ThemeContext.Provider>
    )
}

export const useTheme = () => useContext(ThemeContext);