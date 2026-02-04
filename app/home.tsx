import Button from "@/components/ui/button";
import Icons from "@/components/ui/icons";
import { Link, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useTranslation } from "react-i18next";
import { ImageBackground, StyleSheet, Text, View } from "react-native";

const HomeScreen = () => {
    const { t } = useTranslation();

    return (
        <ImageBackground
            source={require('@/assets/images/parking.jpg')}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.container}>
                <View style={{
                    flexDirection: "row",
                    alignItems: "flex-start"
                }}>
                    <Icons
                        name="arrow-back"
                        size={28}
                        color="white"
                        onPress={() => router.replace("/")}
                    />
                    <Text style={styles.text}>
                        {t('find_the_best_parking_spot')}
                    </Text>
                </View>
                <Text style={styles.description}>
                    {t('find_the_best_parking_spot_description')}
                </Text>
                <View style={styles.accountContainer}>
                    <Button
                        title={t("let's_get_started")}
                        onPress={() => router.navigate("/(tabs)")}
                    />
                    <Text style={styles.description}>
                        {t("dont_have_an_account")} {" "}
                        <Link
                            href="/auth/signUp"
                            style={{
                                color: "#51c12fe7",
                                textDecorationLine: "underline"
                            }}
                        >
                            {t("create_an_account")}
                        </Link>
                    </Text>
                </View>
            </View>
            <StatusBar style="light" />
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        rowGap: 30
    },
    text: {
        fontSize: 28,
        maxWidth: '70%',
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold'
    },
    description: {
        fontSize: 16,
        maxWidth: '90%',
        textAlign: 'justify',
        color: 'white'
    },
    accountContainer: {
        gap: 15,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default HomeScreen;