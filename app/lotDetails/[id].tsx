import Icons from "@/components/ui/icons";
import RequestTooLong from "@/components/ui/requestTooLong";
import LoaderSkeleton from "@/components/ui/Skeleton";
import { Colors } from "@/constants/Colors";
import useLot from "@/hooks/lots/useLot";
import { defaultParking } from "@/lib/defaultImages";
import { useLotStore } from "@/stores/zustand/lot";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BlurView } from 'expo-blur';
import * as NavigationBar from 'expo-navigation-bar';
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
    Dimensions,
    Image,
    ImageBackground,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    useColorScheme,
    View
} from "react-native";

const LotDetailsScreen = () => {
    const colorscheme = useColorScheme() || "light";
    const { id } = useLocalSearchParams<{ id: string }>();
    const [indexImage, setIndexImage] = useState(0);
    const router = useRouter();
    const { lot: lotStore, setLot } = useLotStore();
    const {
        lot,
        isPending,
        refetch,
        isRefetching
    } = useLot({ id })

    const handleBook = () => {
        setLot({
            ...lotStore,
            id,
            lotArea: lot.name || "",
            lotAddress: lot.location || "",
            maxWidth: lot.lotType?.maxWidth || 0,
            maxHeight: lot.lotType?.maxHeight || 0,
            maxLength: lot.lotType?.maxLength || 0,
            pricePerHour: lot.pricePerHour || 0,
            vehicleId: "",
            vehicleModel: ""
        })
        router.push("/reservation/selectVehicle");
    }

    useEffect(() => {
        NavigationBar.setVisibilityAsync("hidden");
    }, [])

    if (isPending) return (
        <View style={styles.loading}>
            <LoaderSkeleton />
        </View>
    )

    const lotImage = lot?.urlImages?.at(indexImage) || null;

    return (
        <View style={styles.container}>
            {
                !lot ?
                    <RequestTooLong
                        refresh={refetch}
                        message="Request too long"
                    />
                    :
                    <>
                        <ScrollView
                            scrollEnabled={false}
                            refreshControl={
                                <RefreshControl
                                    refreshing={isRefetching}
                                    onRefresh={refetch}
                                />
                            }
                        >
                            <ImageBackground
                                source={lotImage ? { uri: lotImage } : defaultParking()}
                                style={styles.imageBackground}
                            >
                                <View style={styles.headerBackground}>
                                    <Icons
                                        onPress={() => router.back()}
                                        name="chevron-back"
                                        color="white"
                                        size={30}
                                    />
                                    <Icons
                                        name="share-social-sharp"
                                        color="white"
                                        size={30}
                                    />
                                </View>
                                {
                                    lotImage &&
                                    <View style={styles.bodyBackgroundWrapper}>
                                        <BlurView
                                            intensity={20}
                                            tint={colorscheme === "dark" ? "dark" : "light"}
                                            style={{
                                                padding: 5
                                            }}
                                        >
                                            <ScrollView
                                                horizontal
                                                showsHorizontalScrollIndicator={false}
                                                contentContainerStyle={{
                                                    flexDirection: "row",
                                                    gap: 5
                                                }}
                                                nestedScrollEnabled={true}
                                            >

                                                {
                                                    lot.urlImages?.map((item, index) =>
                                                        <Pressable
                                                            key={index}
                                                            onPress={() => setIndexImage(index)}
                                                        >
                                                            <Image
                                                                source={{ uri: item }}
                                                                alt={item}
                                                                style={styles.image}
                                                            />
                                                        </Pressable>
                                                    )
                                                }
                                            </ScrollView>
                                        </BlurView>
                                    </View>
                                }
                            </ImageBackground>
                        </ScrollView>
                        <ScrollView
                            contentContainerStyle={{
                                flexGrow: 1,
                                justifyContent: "space-between",
                                paddingBottom: 30,
                                backgroundColor: Colors[colorscheme].background
                            }}
                            showsVerticalScrollIndicator={false}
                        >
                            <View>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        padding: 10
                                    }}
                                >
                                    <View
                                        style={{
                                            overflow: "hidden",
                                            borderRadius: 50
                                        }}
                                    >
                                        <BlurView
                                            intensity={colorscheme === "dark" ? 15 : 5}
                                            tint={colorscheme === "dark" ? "light" : "dark"}
                                            style={{
                                                paddingHorizontal: 10,
                                                paddingVertical: 8
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 16,
                                                    fontWeight: "600",
                                                    color: Colors[colorscheme].tint
                                                }}
                                            >
                                                Car parking
                                            </Text>
                                        </BlurView>
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            gap: 5
                                        }}
                                    >
                                        <Ionicons
                                            name="star"
                                            color="#ffbf00"
                                            size={24}
                                        />
                                        <Text
                                            style={{
                                                color: Colors[colorscheme].icon
                                            }}
                                        >
                                            {(Math.random() * 100).toFixed(0)} reviews
                                        </Text>
                                    </View>
                                </View>
                                <View
                                    style={{
                                        marginTop: 10,
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        paddingHorizontal: 15,
                                        gap: 5
                                    }}
                                >
                                    <View>
                                        <Text
                                            style={{
                                                fontSize: 24,
                                                fontWeight: "bold",
                                                color: Colors[colorscheme].text
                                            }}
                                        >
                                            {lot.name || ""}
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 20,
                                                color: Colors[colorscheme].icon,
                                                opacity: 0.7
                                            }}
                                        >
                                            {lot.location || ""}
                                        </Text>
                                    </View>
                                    <View
                                        style={{
                                            overflow: "hidden",
                                            borderRadius: 50
                                        }}
                                    >
                                        <BlurView
                                            intensity={colorscheme === "dark" ? 15 : 5}
                                            tint={colorscheme === "dark" ? "light" : "dark"}
                                            style={{
                                                padding: 5,
                                                transform: "rotate(-45deg)"
                                            }}
                                        >
                                            <Icons
                                                name="send-sharp"
                                                size={20}
                                                color={Colors[colorscheme].tint}
                                            />
                                        </BlurView>
                                    </View>
                                </View>
                                <View
                                    style={{
                                        padding: 15,
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        gap: 5
                                    }}
                                >
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            gap: 5
                                        }}
                                    >
                                        <Ionicons
                                            name="location-outline"
                                            size={20}
                                            color={Colors[colorscheme].tint}
                                        />
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                color: Colors[colorscheme].tabIconDefault
                                            }}
                                        >
                                            {lot.distance ? lot.distance.distanceKm.toFixed(2) + " km" : "N/A"}
                                        </Text>
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            gap: 5
                                        }}
                                    >
                                        <Ionicons
                                            name="time-outline"
                                            size={20}
                                            color={Colors[colorscheme].tint}
                                        />
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                color: Colors[colorscheme].tabIconDefault
                                            }}
                                        >
                                            {lot.distance?.formatted || "N/A"}
                                        </Text>
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            gap: 5
                                        }}
                                    >
                                        <Ionicons
                                            name="car-outline"
                                            size={20}
                                            color={Colors[colorscheme].tint}
                                        />
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                color: Colors[colorscheme].tabIconDefault
                                            }}
                                        >
                                            {(lot?.totalSpots || 0) - (lot?.occupiedSpots || 0)} Spots
                                        </Text>
                                    </View>
                                </View>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        paddingHorizontal: 15,
                                        gap: 5
                                    }}
                                >
                                    <View>
                                        <Text
                                            style={{
                                                fontSize: 24,
                                                fontWeight: "bold",
                                                color: Colors[colorscheme].text
                                            }}
                                        >
                                            Vehicle category
                                        </Text>
                                    </View>
                                </View>
                                <View
                                    style={{
                                        padding: 15,
                                        paddingTop: 8,
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        gap: 5
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            color: Colors[colorscheme].tabIconDefault
                                        }}
                                    >
                                        Width {"< " + lot.lotType?.maxWidth || "N/A"} m
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            color: Colors[colorscheme].tabIconDefault
                                        }}
                                    >
                                        Height {"< " + lot.lotType?.maxHeight || "N/A"} m
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            color: Colors[colorscheme].tabIconDefault
                                        }}
                                    >
                                        Length {"< " + lot.lotType?.maxLength || "N/A"} m
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        marginTop: 10,
                                        paddingBottom: 30
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 20,
                                            fontWeight: "600",
                                            paddingHorizontal: 15,
                                            marginBottom: 10,
                                            color: Colors[colorscheme].text
                                        }}
                                    >
                                        Description
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            paddingHorizontal: 15,
                                            color: Colors[colorscheme].icon,
                                            lineHeight: 22
                                        }}
                                    >
                                        {lot.lotType?.description || "No description available."}
                                    </Text>
                                </View>
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    paddingHorizontal: 15,
                                    paddingBottom: 30
                                }}
                            >
                                <View>
                                    <Text
                                        style={{
                                            fontSize: 20,
                                            fontWeight: "semibold",
                                            color: Colors[colorscheme].icon,
                                            opacity: 0.7
                                        }}
                                    >
                                        Price
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontWeight: "600",
                                            color: Colors[colorscheme].tint
                                        }}
                                    >
                                        ${lot.pricePerHour?.toFixed(2) || "0.00"} / hr
                                    </Text>
                                </View>
                                <Pressable
                                    android_ripple={{
                                        color: '#00000020'
                                    }}
                                    style={({ pressed }) => [
                                        styles.button,
                                        pressed ? styles.pressed : null
                                    ]}
                                    onPress={handleBook}
                                >
                                    <Text style={styles.buttonText}>
                                        Book Now
                                    </Text>
                                </Pressable>
                            </View>
                        </ScrollView>
                    </>
            }
            <StatusBar style="light" />
        </View>
    )
}

const screenHeight = Dimensions.get("screen").height;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    imageBackground: {
        alignSelf: "stretch",
        height: screenHeight / 2,
        paddingVertical: 35,
        paddingHorizontal: 10,
        justifyContent: "space-between"
    },
    headerBackground: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    bodyBackgroundWrapper: {
        borderRadius: 10,
        overflow: 'hidden'
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 8
    },
    button: {
        width: "50%",
        paddingVertical: 12,
        backgroundColor: Colors["light"].tint,
        borderRadius: 8
    },
    buttonText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold'
    },
    loading: {
        paddingHorizontal: 15,
        paddingVertical: 70
    },
    pressed: {
        opacity: 0.75
    }
})

export default LotDetailsScreen;