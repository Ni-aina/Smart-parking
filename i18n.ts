import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import fr from "./locales/fr.json";

const LANG_KEY = "appLanguage";

const resources = {
    en: { translation: en },
    fr: { translation: fr },
}

async function getStoredLanguage() {
    try {
        const savedLang = await AsyncStorage.getItem(LANG_KEY);
        return savedLang || Localization.getLocales()[0].languageCode || "en";
    } catch {
        return "en";
    }
}

export async function initI18n() {
    const lng = await getStoredLanguage();

    await i18n
        .use(initReactI18next)
        .init({
            resources,
            lng,
            fallbackLng: "en",
            interpolation: {
                escapeValue: false,
            },
        });

    return i18n;
}

export async function changeLanguage(lang: string) {
    await i18n.changeLanguage(lang);
    await AsyncStorage.setItem(LANG_KEY, lang);
}
