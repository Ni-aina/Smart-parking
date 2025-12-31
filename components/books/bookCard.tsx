import { Colors } from "@/constants/Colors";
import { defaultParking } from "@/lib/defaultImages";
import { ReservationInterface } from "@/types/reservation";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image, StyleSheet, Text, useColorScheme, View } from "react-native";

interface BookCardProps {
    reservation: ReservationInterface
}

const BookCard = ({ reservation }: BookCardProps) => {
    const colorScheme = useColorScheme() || 'light';
    const lotImage = reservation.lot.urlImages.length > 0 ? reservation.lot.urlImages[0] : null;

    return (
        <View
            style={[
                styles.card,
                {
                    borderColor: Colors[colorScheme].gray200
                }
            ]}>
            <Image
                source={lotImage ? { uri: lotImage } : defaultParking()}
                style={styles.image}
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
                            backgroundColor:
                                reservation.status === 'cancelled' ?
                                    'rgba(255, 0, 0, 0.1)' :
                                    'rgba(0, 122, 255, 0.1)',
                            padding: 8,
                            borderRadius: 50
                        }}
                    >
                        <Text
                            style={{
                                fontWeight: "700",
                                color:
                                    reservation.status === 'cancelled' ?
                                        'red' :
                                        Colors[colorScheme].tint,
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
    )
}

const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 8,
        marginVertical: 8,
        flexDirection: 'row',
        alignItems: 'center'
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginRight: 16
    }
})

export default BookCard;