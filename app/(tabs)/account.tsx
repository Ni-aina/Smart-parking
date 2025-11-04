import { logout } from "@/actions/user.action";
import ProtectedRoute from "@/components/ProtectedRoute";
import Pending from "@/components/ui/pending";
import LoaderSkeleton from "@/components/ui/Skeleton";
import { Colors } from "@/constants/Colors";
import useCurrentProfile from "@/hooks/useCurrentProfile";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    useColorScheme,
    View
} from "react-native";

const AccountScreen = () => {
    const colorSchema = useColorScheme() || "light";
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
            alert("Log out failed");
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
                    <Image
                        source={require("@/assets/images/accounts/default-user.png")}
                        alt="Default user"
                        style={styles.iconProfile}
                        borderRadius={50}
                    />
                    <View>
                        <Text
                            style={[

                                styles.textProfile, {
                                    color: Colors[colorSchema].text
                                }]
                            }>
                            {error?.message || currentProfile?.fullName || ""}
                        </Text>
                        <Text
                            style={[

                                styles.emailProfile, {
                                    color: Colors[colorSchema].icon
                                }]
                            }>
                            {currentProfile?.emailAddress || ""}
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
                                color: Colors[colorSchema].text
                            }]
                        }>
                        Personal Info
                    </Text>
                    <Pressable
                        style={({ pressed }) => [
                            styles.infoContent, pressed && styles.pressed
                        ]}
                        android_ripple={{ color: "#777" }}
                    >
                        <View style={styles.dataContent}>
                            <Ionicons
                                name="person-outline"
                                size={24}
                                color={Colors[colorSchema].icon}
                            />
                            <Text
                                style={[
                                    styles.textContent, {
                                        color: Colors[colorSchema].text
                                    }]
                                }>
                                Personal Data
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={28}
                            color={Colors[colorSchema].icon}
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
                                color={Colors[colorSchema].icon}
                            />
                            <Text
                                style={[
                                    styles.textContent, {
                                        color: Colors[colorSchema].text
                                    }]
                                }>
                                Payment Account
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={28}
                            color={Colors[colorSchema].icon}
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
                                color={Colors[colorSchema].icon}
                            />
                            <Text
                                style={[
                                    styles.textContent, {
                                        color: Colors[colorSchema].text
                                    }]
                                }>
                                Account Security
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={28}
                            color={Colors[colorSchema].icon}
                        />
                    </Pressable>
                    <Text
                        style={[

                            styles.subtitle, {
                                color: Colors[colorSchema].text
                            }]
                        }>
                        General
                    </Text>
                    <Pressable
                        style={({ pressed }) => [
                            styles.infoContent, pressed && styles.pressed
                        ]}
                        android_ripple={{ color: "#777" }}
                    >
                        <View style={styles.dataContent}>
                            <Ionicons
                                name="globe-outline"
                                size={24}
                                color={Colors[colorSchema].icon}
                            />
                            <Text
                                style={[
                                    styles.textContent, {
                                        color: Colors[colorSchema].text
                                    }]
                                }>
                                Languages
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={28}
                            color={Colors[colorSchema].icon}
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
                                color={Colors[colorSchema].icon}
                            />
                            <Text
                                style={[
                                    styles.textContent, {
                                        color: Colors[colorSchema].text
                                    }]
                                }>
                                Push Notification
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={28}
                            color={Colors[colorSchema].icon}
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
                                color={Colors[colorSchema].icon}
                            />
                            <Text
                                style={[
                                    styles.textContent, {
                                        color: Colors[colorSchema].text
                                    }]
                                }>
                                Messages
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={28}
                            color={Colors[colorSchema].icon}
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
                                color={Colors[colorSchema].icon}
                            />
                            <Text
                                style={[
                                    styles.textContent, {
                                        color: Colors[colorSchema].text
                                    }]
                                }>
                                Clear Data
                            </Text>
                        </View>
                        <Text
                            style={[
                                styles.textContent, {
                                    color: Colors[colorSchema].icon
                                }]
                            }>
                            88 MB
                        </Text>
                    </Pressable>
                    <Text
                        style={[

                            styles.subtitle, {
                                color: Colors[colorSchema].text
                            }]
                        }>
                        About
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
                                color={Colors[colorSchema].icon}
                            />
                            <Text
                                style={[
                                    styles.textContent, {
                                        color: Colors[colorSchema].text
                                    }]
                                }>
                                Help Center
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={28}
                            color={Colors[colorSchema].icon}
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
                                color={Colors[colorSchema].icon}
                            />
                            <Text
                                style={[
                                    styles.textContent, {
                                        color: Colors[colorSchema].text
                                    }]
                                }>
                                Privacy & Policy
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={28}
                            color={Colors[colorSchema].icon}
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
                                color={Colors[colorSchema].icon}
                            />
                            <Text
                                style={[
                                    styles.textContent, {
                                        color: Colors[colorSchema].text
                                    }]
                                }>
                                About App
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={28}
                            color={Colors[colorSchema].icon}
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
                                color={Colors[colorSchema].icon}
                            />
                            <Text
                                style={[
                                    styles.textContent, {
                                        color: Colors[colorSchema].text
                                    }]
                                }>
                                Term & Condition
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={28}
                            color={Colors[colorSchema].icon}
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
                                color: Colors[colorSchema].text
                            }]
                        }
                    >
                        Logout
                    </Text>
                    <Ionicons
                        name="log-out-outline"
                        size={24}
                        color={Colors[colorSchema].icon}
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
    iconProfile: {
        width: 70,
        height: 70
    },
    textProfile: {
        fontSize: 24,
        fontWeight: "semibold"
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