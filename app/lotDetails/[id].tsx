import { createConversation } from "@/actions/message.action";
import ReviewList from "@/components/reviews/review-list";
import ErrorModal from "@/components/ui/errorModal";
import Icons from "@/components/ui/icons";
import RequestTooLong from "@/components/ui/requestTooLong";
import LoaderSkeleton from "@/components/ui/Skeleton";
import { Colors } from "@/constants/Colors";
import useLot from "@/hooks/lots/useLot";
import useReviews from "@/hooks/reviews/useReviews";
import useCurrentProfile from "@/hooks/useCurrentProfile";
import { defaultParking } from "@/lib/defaultImages";
import { useLotStore } from "@/stores/zustand/lot";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BlurView } from 'expo-blur';
import * as NavigationBar from 'expo-navigation-bar';
import { Href, useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Skeleton } from "moti/skeleton";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
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
    const { t } = useTranslation();
    const colorScheme = useColorScheme() || "light";
    const { id } = useLocalSearchParams<{ id: string }>();
    const [indexImage, setIndexImage] = useState(0);
    const router = useRouter();
    const { lot: lotStore, setLot } = useLotStore();
    const { reviews, isLoading: reviewLoading } = useReviews({ lotId: +id });

    const {
        lot,
        isLoading,
        refetch,
        isRefetching
    } = useLot({ id })

    const [loadingImage, setLoadingImage] = useState(true);

    const { currentProfile } = useCurrentProfile();
    const [onNewConversation, setOnNewConversation] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")

    const handleMessageOwner = async () => {
        if (!currentProfile?.id || !lot.owner.id) return;

        try {
            setOnNewConversation(true)
            const conversation = await createConversation({
                senderId: currentProfile.id,
                receiverId: lot.owner.id
            })
            router.push({
                pathname: "/messages/[id]",
                params: { id: String(conversation.id) }
            } as Href)
        } catch {
            setErrorMessage(t("chat_error"))
        } finally {
            setOnNewConversation(false)
            setTimeout(() => {
                setErrorMessage("")
            }, 3000)
        }
    }

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
            vehicleNumber: ""
        })
        router.push("/reservations/selectVehicle");
    }

    useEffect(() => {
        NavigationBar.setVisibilityAsync("hidden");
    }, [])

    if (isLoading) return (
        <View style={styles.loading}>
            <LoaderSkeleton />
        </View>
    )

    const lotImage = lot?.urlImages?.at(indexImage) || null;

    return (
        <View style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
            {
                !lot ?
                    <RequestTooLong
                        refresh={refetch}
                        message={t("request_too_long")}
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
                            {
                                loadingImage &&
                                <Skeleton
                                    width={screenWidth}
                                    height={screenHeight / 2}
                                    colorMode={colorScheme}
                                />
                            }
                            <ImageBackground
                                source={lotImage ? { uri: lotImage } : defaultParking()}
                                style={
                                    loadingImage ?
                                        styles.loadingImage
                                        :
                                        styles.imageBackground
                                }
                                onLoadStart={
                                    () => setLoadingImage(true)
                                }
                                onLoadEnd={
                                    () => setLoadingImage(false)
                                }
                            >
                                <View style={styles.headerBackground}>
                                    <Icons
                                        onPress={() => router.back()}
                                        name="chevron-back"
                                        color={
                                            lotImage ?
                                                "white" :
                                                "#555"
                                        }
                                        size={30}
                                    />
                                    <Icons
                                        name="share-social-sharp"
                                        color={
                                            lotImage ?
                                                "white" :
                                                "#555"
                                        }
                                        size={30}
                                    />
                                </View>
                                {
                                    lotImage &&
                                    <View style={styles.bodyBackgroundWrapper}>
                                        <BlurView
                                            intensity={20}
                                            tint={colorScheme === "dark" ? "dark" : "light"}
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
                        <View style={{ maxHeight: Math.floor(screenHeight / 2) }}>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    paddingTop: 15,
                                    paddingHorizontal: 10
                                }}
                            >
                                <View
                                    style={{
                                        overflow: "hidden",
                                        borderRadius: 50
                                    }}
                                >
                                    <BlurView
                                        intensity={colorScheme === "dark" ? 15 : 5}
                                        tint={colorScheme === "dark" ? "light" : "dark"}
                                        style={{
                                            paddingHorizontal: 10,
                                            paddingVertical: 8
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontWeight: "600",
                                                color: Colors[colorScheme].tint
                                            }}
                                        >
                                            {t("car_parking")}
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
                                    <Pressable
                                        onPress={() => router.push(`/books/review/${lot.id}`)}
                                        style={({ pressed }) => pressed && { opacity: 0.5 }}
                                    >
                                        <Ionicons
                                            name="star"
                                            color="#ffbf00"
                                            size={24}
                                        />
                                    </Pressable>
                                    <Text
                                        style={{
                                            color: Colors[colorScheme].icon
                                        }}
                                    >
                                        {reviews.length} {t("reviews")}
                                    </Text>
                                </View>
                            </View>
                            <ScrollView
                                contentContainerStyle={{
                                    flexGrow: 1,
                                    justifyContent: "space-between",
                                    paddingBottom: 30
                                }}
                                showsVerticalScrollIndicator={false}
                            >
                                <>
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
                                                    color: Colors[colorScheme].text
                                                }}
                                            >
                                                {lot.name || ""}
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: 20,
                                                    color: Colors[colorScheme].icon,
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
                                                intensity={colorScheme === "dark" ? 15 : 5}
                                                tint={colorScheme === "dark" ? "light" : "dark"}
                                                style={{
                                                    padding: 5,
                                                    transform: "rotate(-45deg)"
                                                }}
                                            >
                                                {
                                                    onNewConversation ?
                                                        <ActivityIndicator
                                                            size={28}
                                                            color={Colors[colorScheme].tint}
                                                        />
                                                        :
                                                        <Icons
                                                            onPress={handleMessageOwner}
                                                            name="send-sharp"
                                                            size={20}
                                                            color={Colors[colorScheme].tint}
                                                        />
                                                }
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
                                                color={Colors[colorScheme].tint}
                                            />
                                            <Text
                                                style={{
                                                    fontSize: 16,
                                                    color: Colors[colorScheme].tabIconDefault
                                                }}
                                            >
                                                {lot.distance ? lot.distance.distanceKm.toFixed(2) + " km" : t("na")}
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
                                                color={Colors[colorScheme].tint}
                                            />
                                            <Text
                                                style={{
                                                    fontSize: 16,
                                                    color: Colors[colorScheme].tabIconDefault
                                                }}
                                            >
                                                {lot.distance?.formatted || t("na")}
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
                                                color={Colors[colorScheme].tint}
                                            />
                                            <Text
                                                style={{
                                                    fontSize: 16,
                                                    color: Colors[colorScheme].tabIconDefault
                                                }}
                                            >
                                                {(lot?.totalSpots || 0) - (lot?.occupiedSpots || 0)} {t("spots")}
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
                                                    color: Colors[colorScheme].text
                                                }}
                                            >
                                                {t("vehicle_category")}
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
                                                color: Colors[colorScheme].tabIconDefault
                                            }}
                                        >
                                            {t("width")} {"< " + lot.lotType?.maxWidth || t("na")} m
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                color: Colors[colorScheme].tabIconDefault
                                            }}
                                        >
                                            {t("height")} {"< " + lot.lotType?.maxHeight || t("na")} m
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                color: Colors[colorScheme].tabIconDefault
                                            }}
                                        >
                                            {t("length")} {"< " + lot.lotType?.maxLength || t("na")} m
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
                                                color: Colors[colorScheme].text
                                            }}
                                        >
                                            {t("description")}
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                paddingHorizontal: 15,
                                                color: Colors[colorScheme].icon,
                                                lineHeight: 22
                                            }}
                                        >
                                            {lot.lotType?.description || t("no_description_available")}
                                        </Text>
                                    </View>
                                    <View
                                        style={{
                                            paddingHorizontal: 15,
                                            paddingVertical: 10
                                        }}
                                    >
                                        <ReviewList
                                            lotId={lot.id}
                                            reviews={reviews}
                                            isLoading={reviewLoading}
                                        />
                                    </View>
                                </>
                            </ScrollView>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    paddingHorizontal: 15,
                                    paddingTop: 30
                                }}
                            >
                                <View>
                                    <Text
                                        style={{
                                            fontSize: 20,
                                            fontWeight: "semibold",
                                            color: Colors[colorScheme].icon,
                                            opacity: 0.7
                                        }}
                                    >
                                        {t("price")}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontWeight: "600",
                                            color: Colors[colorScheme].tint
                                        }}
                                    >
                                        ${lot.pricePerHour?.toFixed(2) || "0.00"} {t("per_hr")}
                                    </Text>
                                </View>
                                <Pressable
                                    android_ripple={{
                                        color: '#00000020'
                                    }}
                                    style={({ pressed }) => [
                                        styles.button,
                                        {
                                            backgroundColor: Colors[colorScheme].tint
                                        },
                                        pressed ? styles.pressed : null
                                    ]}
                                    onPress={handleBook}
                                >
                                    <Text
                                        style={[
                                            styles.buttonText,
                                            {
                                                color: Colors[colorScheme].background
                                            }
                                        ]}
                                    >
                                        {t("book_now")}
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                    </>
            }
            <StatusBar style="auto" />

            <ErrorModal
                visible={!!errorMessage}
                message={errorMessage}
                onClose={() => setErrorMessage("")}
            />
        </View>
    )
}

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 50
    },
    imageBackground: {
        height: Math.floor(screenHeight / 2) - 50,
        paddingTop: 35,
        paddingBottom: 20,
        paddingHorizontal: 10,
        justifyContent: "space-between"
    },
    loadingImage: {
        width: 0,
        height: 0
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
        borderRadius: 8
    },
    buttonText: {
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