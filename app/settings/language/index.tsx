import Header from "@/components/ui/header";
import { Colors } from "@/constants/Colors";
import { changeLanguage } from "@/i18n";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, useColorScheme, View } from "react-native";

type LanguageOption = {
    label: string
    value: string
}

const languages: LanguageOption[] = [
    {
        label: "english",
        value: "en"
    },
    {
        label: "french",
        value: "fr"
    }
]

const Language = () => {
    const { t, i18n } = useTranslation();
    const colorScheme = useColorScheme() || "light";
    const [selectedLanguage, setSelectedLanguage] = useState(i18n.language || "en");

    useEffect(() => {
        setSelectedLanguage(i18n.language || "en")
    }, [i18n.language])

    const handleLanguage = async (value: string) => {
        if (value === selectedLanguage) return;
        await changeLanguage(value);
        setSelectedLanguage(value);
    }

    return (
        <View style={styles.container}>
            <Header title={t("language_settings")} />
            <View style={{ marginTop: 20, gap: 15 }}>
                {languages.map((item, index) => {
                    const isActive = selectedLanguage === item.value
                    return (
                        <Pressable
                            key={index}
                            style={({ pressed }) => [
                                styles.card,
                                {
                                    borderColor: Colors[colorScheme].icon,
                                    backgroundColor: isActive ?
                                        Colors[colorScheme === "light" ? "dark" : "light"]?.text :
                                        "transparent"
                                },
                                pressed && styles.pressed
                            ]}
                            android_ripple={{ color: "#00000010" }}
                            onPress={() => handleLanguage(item.value)}
                        >
                            <View style={styles.cardInner}>
                                <View style={styles.labelWrapper}>
                                    <Text style={[styles.label, { color: Colors[colorScheme].text }]}> 
                                        {t(item.label)}
                                    </Text>
                                    <Text style={[styles.value, { color: Colors[colorScheme].icon }]}> 
                                        {item.value.toUpperCase()}
                                    </Text>
                                </View>
                                <View style={[
                                    styles.dotContainer,
                                    {
                                        borderColor: isActive ? Colors[colorScheme].tint : Colors[colorScheme].tabIconDefault
                                    }
                                ]}
                                >
                                    <View style={[
                                        styles.dot,
                                        {
                                            borderColor: Colors[colorScheme].icon,
                                            backgroundColor: isActive ? Colors[colorScheme].icon : Colors[colorScheme].background
                                        }
                                    ]}
                                    />
                                </View>
                            </View>
                        </Pressable>
                    )
                })}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 40,
        gap: 15
    },
    card: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 15,
        gap: 5,
        borderWidth: 0.2,
        borderRadius: 10
    },
    cardInner: {
        flexDirection: "row",
        alignItems: "center",
        columnGap: 20,
        flex: 1,
        justifyContent: "space-between",
        paddingVertical: 15
    },
    labelWrapper: {
        gap: 4
    },
    label: {
        fontSize: 20,
        fontWeight: "700"
    },
    value: {
        fontSize: 16
    },
    dotContainer: {
        borderRadius: 50,
        borderWidth: 1,
        padding: 2
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 50,
        borderWidth: 1
    },
    pressed: {
        opacity: 0.85
    }
})

export default Language;