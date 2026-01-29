import { Colors } from "@/constants/Colors";
import { getDateFormat, getTimeFormat } from "@/utils/dateTimeAction";
import { StyleSheet, Text, useColorScheme, View } from "react-native";

interface ReviewReservationInterface {
    lotArea: string;
    lotAddress: string;
    vehicleModel: string;
    pricePerHour: number;
    durationHours: number;
    startTime: Date;
}

const ReviewReservation = ({
    lotArea,
    lotAddress,
    vehicleModel,
    pricePerHour,
    durationHours,
    startTime
}: ReviewReservationInterface) => {

    const colorscheme = useColorScheme() || "light";

    return (
        <>
            <View
                style={[
                    styles.card,
                    {
                        borderColor: Colors[colorscheme].gray200
                    }
                ]}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        gap: 5
                    }}
                >
                    <Text
                        style={{
                            fontSize: 16,
                            color: Colors[colorscheme].icon
                        }}
                    >
                        Parking Area
                    </Text>
                    <Text
                        style={{
                            fontSize: 16,
                            color: Colors[colorscheme].text
                        }}
                    >
                        {lotArea}
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        gap: 5
                    }}
                >
                    <Text
                        style={{
                            fontSize: 16,
                            color: Colors[colorscheme].icon
                        }}
                    >
                        Address
                    </Text>
                    <Text
                        style={{
                            fontSize: 16,
                            color: Colors[colorscheme].text
                        }}
                    >
                        {lotAddress}
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        gap: 5
                    }}
                >
                    <Text
                        style={{
                            fontSize: 16,
                            color: Colors[colorscheme].icon
                        }}
                    >
                        Vehicle
                    </Text>
                    <Text
                        style={{
                            fontSize: 16,
                            color: Colors[colorscheme].text
                        }}
                    >
                        {vehicleModel}
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        gap: 5
                    }}
                >
                    <Text
                        style={{
                            fontSize: 16,
                            color: Colors[colorscheme].icon
                        }}
                    >
                        Date
                    </Text>
                    <Text
                        style={{
                            fontSize: 16,
                            color: Colors[colorscheme].text
                        }}
                    >
                        {getDateFormat(startTime)}
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        gap: 5
                    }}
                >
                    <Text
                        style={{
                            fontSize: 16,
                            color: Colors[colorscheme].icon
                        }}
                    >
                        Hours
                    </Text>
                    <Text
                        style={{
                            fontSize: 16,
                            color: Colors[colorscheme].text
                        }}
                    >
                        {getTimeFormat(startTime)}
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        gap: 5
                    }}
                >
                    <Text
                        style={{
                            fontSize: 16,
                            color: Colors[colorscheme].icon
                        }}
                    >
                        Duration
                    </Text>
                    <Text
                        style={{
                            fontSize: 16,
                            color: Colors[colorscheme].text
                        }}
                    >
                        {durationHours} {durationHours < 2 ? "hour" : "hours"}
                    </Text>
                </View>
            </View>
            <View
                style={[
                    styles.card,
                    {
                        borderColor: Colors[colorscheme].gray200
                    }
                ]}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        gap: 5
                    }}
                >
                    <Text
                        style={{
                            fontSize: 16,
                            color: Colors[colorscheme].icon
                        }}
                    >
                        Amount
                    </Text>
                    <Text
                        style={{
                            fontSize: 16,
                            color: Colors[colorscheme].icon
                        }}
                    >
                        ${pricePerHour}/hour
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        gap: 5
                    }}
                >
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: "bold",
                            color: Colors[colorscheme].text
                        }}
                    >
                        Total
                    </Text>
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: "bold",
                            color: Colors[colorscheme].text
                        }}
                    >
                        $ {pricePerHour * durationHours}
                    </Text>
                </View>
            </View>

        </>
    )
}

const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 15,
        gap: 10
    }
})

export default ReviewReservation;