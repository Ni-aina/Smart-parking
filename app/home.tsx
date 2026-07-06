import Button from "@/components/ui/button";
import Icons from "@/components/ui/icons";
import { Colors } from "@/constants/Colors";
import { Link, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, useColorScheme, View } from "react-native";

const HomeScreen = () => {
    const { t } = useTranslation();
    const colorscheme = useColorScheme() || "light";

    return (
        <View
            style={[
                styles.background,
                {
                    backgroundColor: Colors[colorscheme].background
                }
            ]}
        >
            <View style={styles.container}>
                <Image
                    source={require("../assets/images/parking-lot.png")}
                    style={{
                        width: 240,
                        height: 180
                    }}
                />
                <View style={{
                    flexDirection: "row",
                    alignItems: "flex-start"
                }}>
                    <Icons
                        name="arrow-back"
                        size={28}
                        color={Colors[colorscheme].text}
                        onPress={() => router.replace("/")}
                    />
                    <Text
                        style={[
                            styles.text,
                            {
                                color: Colors[colorscheme].text
                            }
                        ]}
                    >
                        {t('find_the_best_parking_spot')}
                    </Text>
                </View>
                <View
                    style={{
                        borderRadius: 10,
                        overflow: 'hidden'
                    }}
                >
                    <Text
                        style={[
                            styles.description,
                            {
                                color: Colors[colorscheme].text
                            }
                        ]}
                    >
                        {t('find_the_best_parking_spot_description')}
                    </Text>
                </View>
                <View style={styles.accountContainer}>
                    <Button
                        title={t("let's_get_started")}
                        onPress={() => router.navigate("/(tabs)")}
                    />
                    <Text
                        style={[
                            styles.description,
                            {
                                color: Colors[colorscheme].text
                            }
                        ]}
                    >
                        {t("dont_have_an_account")} {" "}
                        <Link
                            href="/auth/signUp"
                            style={{
                                color: Colors[colorscheme].text,
                                textDecorationLine: "underline"
                            }}
                        >
                            {t("create_an_account")}
                        </Link>
                    </Text>
                </View>
            </View>
            <StatusBar style="auto" />
        </View>
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
        maxWidth: '85%',
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold'
    },
    description: {
        fontSize: 16,
        maxWidth: '90%',
        textAlign: 'justify',
    },
    accountContainer: {
        gap: 15,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default HomeScreen;