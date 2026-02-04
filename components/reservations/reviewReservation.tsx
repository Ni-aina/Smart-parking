import { Colors } from "@/constants/Colors";
import { getDateFormat, getTimeFormat } from "@/utils/dateTimeAction";
import { useTranslation } from "react-i18next";
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
    const { t } = useTranslation()
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
                        {t("parking_area")}
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
                        {t("address")}
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
                        {t("vehicle")}
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
                        {t("date")}
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
                        {t("hours")}
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
                        {t("duration")}
                    </Text>
                    <Text
                        style={{
                            fontSize: 16,
                            color: Colors[colorscheme].text
                        }}
                    >
                        {durationHours} {durationHours < 2 ? t("hour") : t("hours")}
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
                        {t("amount")}
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
                        {t("total")}
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