import SignUpForm from "@/components/SignUpForm";
import Icons from "@/components/ui/icons";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, useColorScheme, View } from "react-native";

const SignUpScreen = () => {
    const { t } = useTranslation();
    const colorScheme = useColorScheme() || "light";
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.headerContent}>
                <Icons name="arrow-back" size={28}
                    onPress={() => router.push("/home")}
                    color={Colors[colorScheme].text}
                />
                <Text style={[styles.title, { color: Colors[colorScheme].text }]}>
                    {t("create_your_account")}
                </Text>
            </View>
            <Text style={[styles.description, { color: Colors[colorScheme].text }]}>
                {t("create_your_account_description")}
            </Text>
            <SignUpForm />
            <StatusBar style="auto" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
        paddingBottom: 50,
        paddingHorizontal: 20,
        gap: 20
    },
    headerContent: {
        flexDirection: "row",
        gap: 4,
        alignItems: "center"
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold'
    },
    description: {
        fontSize: 16
    }
})

export default SignUpScreen;