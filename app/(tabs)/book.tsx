import BookHistory from "@/components/books/bookHistory";
import MyBooking from "@/components/books/myBooking";
import ProtectedRoute from "@/components/ProtectedRoute";
import Icons from "@/components/ui/icons";
import { Colors } from "@/constants/Colors";
import useActiveBar from "@/hooks/useActiveBar";
import useCurrentProfile from "@/hooks/useCurrentProfile";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    useColorScheme,
    View
} from "react-native";

const BookScreen = () => {
    const {
        currentProfile
    } = useCurrentProfile();

    const currentRoles = currentProfile?.roles;
    const accessToScan = currentRoles?.includes("owner") || currentRoles?.includes("agent");
    const router = useRouter();

    const colorscheme = useColorScheme() || "light";
    const [active, setActive] = useState<0 | 1>(0);

    const {
        barColors
    } = useActiveBar({ colorscheme });
    
    const handleScan = ()=> router.push("/scanner");

    return (
        <ProtectedRoute>
            <View style={styles.container}>
                <View style={styles.content}>
                    <Text style={[
                        styles.headerText,
                        {
                            color: Colors[colorscheme].text
                        }
                    ]}>
                        My Booking
                    </Text>
                    <View
                        style={{
                            flexDirection: "row",
                            gap: 5
                        }}
                    >
                        {
                            accessToScan &&
                            <Icons
                                name="scan"
                                color={Colors[colorscheme].tint}
                                onPress={handleScan}
                            />
                        }
                        <Icons
                            name="calendar"
                            color={Colors[colorscheme].tint}
                        />
                    </View>
                </View>
                <View style={styles.content}>
                    <Pressable
                        onPress={() => setActive(0)}
                        android_ripple={{
                            color: '#00000020'
                        }}
                        style={({ pressed }) => [styles.pressable, pressed ? styles.pressed : null]}
                    >
                        <View style={[
                            styles.button,
                            active === 0 ? {
                                backgroundColor: barColors["active"].backgroundColor
                            } : {
                                backgroundColor: barColors["inactive"].backgroundColor
                            }
                        ]}>
                            <Text style={[
                                styles.buttonText,
                                active === 0 ? {
                                    color: barColors["active"].color
                                } : {
                                    color: barColors["inactive"].color
                                }
                            ]}>
                                My Booking
                            </Text>
                        </View>
                    </Pressable>
                    <Pressable
                        onPress={() => setActive(1)}
                        android_ripple={{
                            color: '#00000020'
                        }}
                        style={({ pressed }) => [styles.pressable, pressed ? styles.pressed : null]}
                    >
                        <View style={[
                            styles.button,
                            active === 1 ? {
                                backgroundColor: barColors["active"].backgroundColor
                            } : {
                                backgroundColor: barColors["inactive"].backgroundColor
                            }
                        ]}>
                            <Text style={[
                                styles.buttonText,
                                active === 1 ? {
                                    color: barColors["active"].color
                                } : {
                                    color: barColors["inactive"].color
                                }
                            ]}>
                                History
                            </Text>
                        </View>
                    </Pressable>
                </View>
                {
                    active === 0 ?
                        <MyBooking /> :
                        <BookHistory />
                }
            </View>
        </ProtectedRoute>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 60,
        gap: 15
    },
    camera: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        overflow: 'hidden'
    },
    content: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 5
    },
    headerText: {
        fontSize: 24
    },
    pressable: {
        width: "48%"
    },
    button: {
        padding: 10,
        alignItems: "center",
        borderRadius: 8
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold'
    },
    pressed: {
        opacity: 0.75,
    }
})

export default BookScreen;