import { logout } from "@/actions/user.action";
import ProtectedRoute from "@/components/ProtectedRoute";
import Pending from "@/components/ui/pending";
import LoaderSkeleton from "@/components/ui/Skeleton";
import { Colors } from "@/constants/Colors";
import useCurrentProfile from "@/hooks/useCurrentProfile";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    useColorScheme,
    View
} from "react-native";

const AccountScreen = () => {
    const { t } = useTranslation();
    const colorscheme = useColorScheme() || "light";
    const router = useRouter();

    const {
        currentProfile,
        isPending,
        error
    } = useCurrentProfile();
    const [isSignOut, setIsSignOut] = useState(false);

    const handleSingout = async () => {
        try {
            setIsSignOut(true);
            await logout();
        } catch (err) {
            alert(t("log_out_failed"));
        } finally {
            setIsSignOut(false);
        }
    }

    if (isPending) return (
        <View style={styles.loading}>
            <LoaderSkeleton />
        </View>
    )

    return (
        <ProtectedRoute>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View
                        style={[styles.profilePicture, { backgroundColor: Colors[colorscheme].text }]}
                    >
                        <Text
                            style={{
                                color: Colors[colorscheme].background,
                                fontSize: 36
                            }}
                        >
                            {currentProfile?.fullName.at(0)?.toString().toUpperCase()}
                        </Text>
                    </View>
                    <View>
                        <Text
                            style={[
                                styles.textProfile, {
                                    color: Colors[colorscheme].text
                                }]
                            }>
                            {error?.message || currentProfile?.fullName!}
                        </Text>
                        <Text
                            style={[

                                styles.emailProfile, {
                                    color: Colors[colorscheme].icon
                                }]
                            }>
                            {currentProfile?.emailAddress!}
                        </Text>
                    </View>
                </View>
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >
                    <Text
                        style={[

                            styles.subtitle, {
                                color: Colors[colorscheme].text
                            }]
                        }>
                        {t("personal_info")}
                    </Text>
                    <Pressable
                        style={({ pressed }) => [
                            styles.infoContent, pressed && styles.pressed
                        ]}
                        android_ripple={{ color: "#777" }}
                        onPress={() => router.push("/settings/account")}
                    >
                        <View style={styles.dataContent}>
                            <Ionicons
                                name="person-outline"
                                size={24}
                                color={Colors[colorscheme].icon}
                            />
                            <Text
                                style={[
                                    styles.textContent, {
                                        color: Colors[colorscheme].text
                                    }]
                                }>
                                {t("personal_data")}
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={28}
                            color={Colors[colorscheme].icon}
                        />
                    </Pressable>
                    <Pressable
                        style={({ pressed }) => [
                            styles.infoContent, pressed && styles.pressed
                        ]}
                        android_ripple={{ color: "#777" }}
                    >
                        <View style={styles.dataContent}>
                            <Ionicons
                                name="card-outline"
                                size={24}
                                color={Colors[colorscheme].icon}
                            />
                            <Text
                                style={[
                                    styles.textContent, {
                                        color: Colors[colorscheme].text
                                    }]
                                }>
                                {t("payment_account")}
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={28}
                            color={Colors[colorscheme].icon}
                        />
                    </Pressable>
                    <Pressable
                        style={({ pressed }) => [
                            styles.infoContent, pressed && styles.pressed
                        ]}
                        android_ripple={{ color: "#777" }}
                    >
                        <View style={styles.dataContent}>
                            <Ionicons
                                name="shield-checkmark-outline"
                                size={24}
                                color={Colors[colorscheme].icon}
                            />
                            <Text
                                style={[
                                    styles.textContent, {
                                        color: Colors[colorscheme].text
                                    }]
                                }>
                                {t("account_security")}
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={28}
                            color={Colors[colorscheme].icon}
                        />
                    </Pressable>
                    <Text
                        style={[

                            styles.subtitle, {
                                color: Colors[colorscheme].text
                            }]
                        }>
                        {t("general")}
                    </Text>
                    <Pressable
                        style={({ pressed }) => [
                            styles.infoContent, pressed && styles.pressed
                        ]}
                        android_ripple={{ color: "#777" }}
                        onPress={()=> router.push("/settings/language")}
                    >
                        <View style={styles.dataContent}>
                            <Ionicons
                                name="globe-outline"
                                size={24}
                                color={Colors[colorscheme].icon}
                            />
                            <Text
                                style={[
                                    styles.textContent, {
                                        color: Colors[colorscheme].text
                                    }]
                                }>
                                {t("languages")}
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={28}
                            color={Colors[colorscheme].icon}
                        />
                    </Pressable>
                    <Pressable
                        style={({ pressed }) => [
                            styles.infoContent, pressed && styles.pressed
                        ]}
                        android_ripple={{ color: "#777" }}
                    >
                        <View style={styles.dataContent}>
                            <Ionicons
                                name="notifications-outline"
                                size={24}
                                color={Colors[colorscheme].icon}
                            />
                            <Text
                                style={[
                                    styles.textContent, {
                                        color: Colors[colorscheme].text
                                    }]
                                }>
                                {t("push_notification")}
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={28}
                            color={Colors[colorscheme].icon}
                        />
                    </Pressable>
                    <Pressable
                        style={({ pressed }) => [
                            styles.infoContent, pressed && styles.pressed
                        ]}
                        android_ripple={{ color: "#777" }}
                    >
                        <View style={styles.dataContent}>
                            <Ionicons
                                name="chatbubble-outline"
                                size={24}
                                color={Colors[colorscheme].icon}
                            />
                            <Text
                                style={[
                                    styles.textContent, {
                                        color: Colors[colorscheme].text
                                    }]
                                }>
                                {t("messages")}
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={28}
                            color={Colors[colorscheme].icon}
                        />
                    </Pressable>
                    <Pressable
                        style={({ pressed }) => [
                            styles.infoContent, pressed && styles.pressed
                        ]}
                        android_ripple={{ color: "#777" }}
                    >
                        <View style={styles.dataContent}>
                            <Ionicons
                                name="trash-outline"
                                size={24}
                                color={Colors[colorscheme].icon}
                            />
                            <Text
                                style={[
                                    styles.textContent, {
                                        color: Colors[colorscheme].text
                                    }]
                                }>
                                {t("clear_data")}
                            </Text>
                        </View>
                        <Text
                            style={[
                                styles.textContent, {
                                    color: Colors[colorscheme].icon
                                }]
                            }>
                            88 MB
                        </Text>
                    </Pressable>
                    <Text
                        style={[

                            styles.subtitle, {
                                color: Colors[colorscheme].text
                            }]
                        }>
                        {t("about")}
                    </Text>
                    <Pressable
                        style={({ pressed }) => [
                            styles.infoContent, pressed && styles.pressed
                        ]}
                        android_ripple={{ color: "#777" }}
                    >
                        <View style={styles.dataContent}>
                            <Ionicons
                                name="help-circle-outline"
                                size={24}
                                color={Colors[colorscheme].icon}
                            />
                            <Text
                                style={[
                                    styles.textContent, {
                                        color: Colors[colorscheme].text
                                    }]
                                }>
                                {t("help_center")}
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={28}
                            color={Colors[colorscheme].icon}
                        />
                    </Pressable>
                    <Pressable
                        style={({ pressed }) => [
                            styles.infoContent, pressed && styles.pressed
                        ]}
                        android_ripple={{ color: "#777" }}
                    >
                        <View style={styles.dataContent}>
                            <Ionicons
                                name="lock-closed-outline"
                                size={24}
                                color={Colors[colorscheme].icon}
                            />
                            <Text
                                style={[
                                    styles.textContent, {
                                        color: Colors[colorscheme].text
                                    }]
                                }>
                                {t("privacy_and_policy")}
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={28}
                            color={Colors[colorscheme].icon}
                        />
                    </Pressable>
                    <Pressable
                        style={({ pressed }) => [
                            styles.infoContent, pressed && styles.pressed
                        ]}
                        android_ripple={{ color: "#777" }}
                    >
                        <View style={styles.dataContent}>
                            <Ionicons
                                name="information-circle-outline"
                                size={24}
                                color={Colors[colorscheme].icon}
                            />
                            <Text
                                style={[
                                    styles.textContent, {
                                        color: Colors[colorscheme].text
                                    }]
                                }>
                                {t("about_app")}
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={28}
                            color={Colors[colorscheme].icon}
                        />
                    </Pressable>
                    <Pressable
                        style={({ pressed }) => [
                            styles.infoContent, pressed && styles.pressed
                        ]}
                        android_ripple={{ color: "#777" }}
                    >
                        <View style={styles.dataContent}>
                            <Ionicons
                                name="construct-outline"
                                size={24}
                                color={Colors[colorscheme].icon}
                            />
                            <Text
                                style={[
                                    styles.textContent, {
                                        color: Colors[colorscheme].text
                                    }]
                                }>
                                {t("term_and_condition")}
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={28}
                            color={Colors[colorscheme].icon}
                        />
                    </Pressable>
                </ScrollView>
                <Pressable
                    style={({ pressed }) => [styles.wrapLogout, pressed && styles.pressed]}
                    onPress={handleSingout}
                >
                    <Text
                        style={
                            [styles.textLogout,
                            {
                                color: Colors[colorscheme].text
                            }]
                        }
                    >
                        {t("logout")}
                    </Text>
                    <Ionicons
                        name="log-out-outline"
                        size={24}
                        color={Colors[colorscheme].icon}
                    />
                </Pressable>
            </View>
            {
                isSignOut && <Pending />
            }
        </ProtectedRoute>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 40,
        gap: 15
    },
    scrollContainer: {
        gap: 15
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
        columnGap: 16,
        rowGap: 5
    },
    profilePicture: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
        width: 80,
        height: 80
    },
    textProfile: {
        fontSize: 24,
        fontWeight: "semibold",
        paddingRight: 70
    },
    emailProfile: {
        fontSize: 16
    },
    subtitle: {
        fontSize: 14
    },
    infoContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    dataContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    textContent: {
        fontSize: 18,
        fontWeight: "semibold"
    },
    wrapLogout: {
        marginTop: 10,
        marginBottom: 20,
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    textLogout: {
        fontSize: 16
    },
    pressed: {
        opacity: 0.7
    },
    loading: {
        paddingHorizontal: 15,
        paddingVertical: 70
    }
})

export default AccountScreen;