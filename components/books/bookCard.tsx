import { Colors } from "@/constants/Colors";
import { defaultParking } from "@/lib/defaultImages";
import { ReservationInterface } from "@/types/reservation";
import { getStatusColor } from "@/utils/statusColor";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { Skeleton } from "moti/skeleton";
import { useState } from "react";
import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    useColorScheme,
    View
} from "react-native";

interface BookCardProps {
    reservation: ReservationInterface
}

const BookCard = ({ reservation }: BookCardProps) => {
    const colorscheme = useColorScheme() || "light";
    const router = useRouter();

    const [loadingImage, setLoadingImage] = useState(true);

    const colorScheme = useColorScheme() || 'light';
    const lotImage = reservation.lot.urlImages.length > 0 ?
        reservation.lot.urlImages[0] :
        null;

    const durationHours = Math.ceil(
        (new Date(reservation.endTime).getTime() - new Date(reservation.startTime).getTime()) /
        (1000 * 60 * 60)
    )

    const id = reservation.id;
    const amount = reservation.lot.pricePerHour * durationHours;
    const status = reservation.status;

    return (
        <View
            style={[
                styles.content,
                {
                    borderColor: Colors[colorScheme].gray200
                }
            ]}
        >
            <View
                style={styles.card}
            >
                {
                    loadingImage &&
                    <View>
                        <Skeleton
                            colorMode={colorscheme}
                            width={100}
                            height={100}
                        />
                    </View>
                }
                <Image
                    source={lotImage ? { uri: lotImage } : defaultParking()}
                    style={
                        loadingImage ?
                        styles.loadingImage :
                        styles.image
                    }
                    onLoadStart={
                        () => setLoadingImage(true)
                    }
                    onLoadEnd={
                        () => setLoadingImage(false)
                    }
                />
                <View
                    style={{
                        flex: 1,
                        alignSelf: 'stretch',
                        gap: 8
                    }}
                >
                    <View
                        style={{
                            alignSelf: 'stretch',
                            flexDirection: 'row',
                            gap: 4,
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                    >
                        <View
                            style={{
                                borderWidth: 1,
                                borderColor: Colors[colorScheme].gray100,
                                padding: 8,
                                borderRadius: 50
                            }}
                        >
                            <Text
                                style={{
                                    fontWeight: "700",
                                    color: getStatusColor(reservation.status) ?? Colors[colorScheme].tint,
                                    fontSize: 10
                                }}
                            >
                                {reservation.status.toUpperCase()}
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                gap: 2,
                                alignItems: 'center'
                            }}
                        >
                            <Ionicons
                                name="star"
                                color="#ffbf00"
                                size={18}
                            />
                            <Text
                                style={{
                                    color: Colors[colorScheme].icon,
                                    fontWeight: 'bold'
                                }}
                            >

                                {(Math.random() * (5 - 3.8) + 3.8).toFixed(1)}
                            </Text>
                        </View>
                    </View>
                    <Text
                        style={{
                            color: Colors[colorScheme].text,
                            fontSize: 16,
                            fontWeight: 'bold'
                        }}
                    >
                        {reservation.lot.name}
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            gap: 4,
                            alignItems: 'center'
                        }}
                    >
                        <Ionicons
                            name="location"
                            size={18}
                            color={Colors[colorScheme].tint}
                        />
                        <Text
                            style={{
                                color: Colors[colorScheme].text
                            }}
                        >
                            {reservation.lot.location}
                        </Text>
                    </View>
                    <Text
                        style={{
                            fontWeight: 'bold',
                            color: Colors[colorScheme].text
                        }}
                    >
                        $ {reservation.lot.pricePerHour} / hour
                    </Text>
                </View>
            </View>
            <View
                style={{
                    marginTop: 8,
                    marginBottom: 4,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 4
                }}
            >
                <Pressable
                    android_ripple={{
                        color: '#00000020'
                    }}
                    style={({ pressed }) => [
                        styles.button,
                        {
                            borderColor: Colors[colorScheme].gray200
                        },
                        pressed ? {
                            opacity: 0.6
                        } : null
                    ]}
                >
                    <Text
                        style={{
                            color: Colors[colorScheme].text
                        }}
                    >
                        Cancel
                    </Text>
                </Pressable>
                <Pressable
                    onPress={() =>
                        status.toLowerCase() === 'pending' ?
                            router.push(`/books/checkout?id=${id}&amount=${amount}`) :
                            router.push(`/books/${id}`)
                    }
                    android_ripple={{
                        color: '#00000020'
                    }}
                    style={({ pressed }) => [
                        styles.button,
                        {
                            backgroundColor: Colors[colorScheme].tint
                        },
                        pressed ? {
                            opacity: 0.6
                        } : null
                    ]}
                >
                    <Text
                        style={{
                            color: colorScheme === 'light' ? '#FFFFFF' : '#000000',
                            fontWeight: 'bold'
                        }}
                    >
                        {
                            status.toLowerCase() === 'pending' ?
                                'Pay Now' :
                                'E-Ticket'
                        }
                    </Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    content: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 8,
        marginVertical: 8
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginRight: 16
    },
    loadingImage: {
        width: 0,
        height: 0
    },
    button: {
        width: '48%',
        alignItems: 'center',
        padding: 8,
        borderRadius: 5,
        borderWidth: 1,
    }
})

export default BookCard;