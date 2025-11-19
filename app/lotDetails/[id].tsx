import Icons from "@/components/ui/icons";
import RequestTooLong from "@/components/ui/requestTooLong";
import LoaderSkeleton from "@/components/ui/Skeleton";
import { Colors } from "@/constants/Colors";
import useLot from "@/hooks/useLot";
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

const LotDetails = () => {
    const colorSchema = useColorScheme() || "light";
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
            maxWidth: lot.lotType?.max_width || 0,
            maxHeight: lot.lotType?.max_height || 0,
            maxLength: lot.lotType?.max_length || 0,
            vehicleId: ""
        })
        router.push("/reservation/selectVehicle");
    }

    useEffect(() => {
        NavigationBar.setVisibilityAsync("visible");
    }, [])

    if (isPending) return (
        <View style={styles.loading}>
            <LoaderSkeleton />
        </View>
    )

    const defaultParking = require("@/assets/images/default-parking.png");
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
                                source={lotImage ? { uri: lotImage } : defaultParking}
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
                                            tint={colorSchema === "dark" ? "dark" : "light"}
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
                                backgroundColor: Colors[colorSchema].background
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
                                            intensity={colorSchema === "dark" ? 15 : 5}
                                            tint={colorSchema === "dark" ? "light" : "dark"}
                                            style={{
                                                paddingHorizontal: 10,
                                                paddingVertical: 8
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 16,
                                                    fontWeight: "600",
                                                    color: Colors[colorSchema].tint
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
                                                color: Colors[colorSchema].icon
                                            }}
                                        >
                                            65 reviews
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
                                                color: Colors[colorSchema].text
                                            }}
                                        >
                                            {lot.name || ""}
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 20,
                                                color: Colors[colorSchema].icon,
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
                                            intensity={colorSchema === "dark" ? 15 : 5}
                                            tint={colorSchema === "dark" ? "light" : "dark"}
                                            style={{
                                                padding: 5,
                                                transform: "rotate(-45deg)"
                                            }}
                                        >
                                            <Icons
                                                name="send-sharp"
                                                size={20}
                                                color={Colors[colorSchema].tint}
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
                                            color={Colors[colorSchema].tint}
                                        />
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                color: Colors[colorSchema].tabIconDefault
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
                                            color={Colors[colorSchema].tint}
                                        />
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                color: Colors[colorSchema].tabIconDefault
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
                                            color={Colors[colorSchema].tint}
                                        />
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                color: Colors[colorSchema].tabIconDefault
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
                                                color: Colors[colorSchema].text
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
                                            color: Colors[colorSchema].tabIconDefault
                                        }}
                                    >
                                        Width {"< " + lot.lotType?.max_width || "N/A"} m
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            color: Colors[colorSchema].tabIconDefault
                                        }}
                                    >
                                        Height {"< " + lot.lotType?.max_height || "N/A"} m
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            color: Colors[colorSchema].tabIconDefault
                                        }}
                                    >
                                        Length {"< " + lot.lotType?.max_length || "N/A"} m
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
                                            color: Colors[colorSchema].text
                                        }}
                                    >
                                        Description
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            paddingHorizontal: 15,
                                            color: Colors[colorSchema].icon,
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
                                            color: Colors[colorSchema].icon,
                                            opacity: 0.7
                                        }}
                                    >
                                        Price
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontWeight: "600",
                                            color: Colors[colorSchema].tint
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

export default LotDetails;