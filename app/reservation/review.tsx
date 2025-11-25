import Button from "@/components/ui/button";
import Header from "@/components/ui/header";
import Loading from "@/components/ui/loading";
import { Colors } from "@/constants/Colors";
import useCurrentProfile from "@/hooks/useCurrentProfile";
import useReservation from "@/hooks/useReservation";
import { useLotStore } from "@/stores/zustand/lot";
import { getDateFormat, getTimeFormat } from "@/utils/dateTimeAction";
import { StyleSheet, Text, useColorScheme, View } from "react-native";

const ReviewScreen = () => {
    const { currentProfile } = useCurrentProfile();
    const driverId = currentProfile?.id || "";

    const colorscheme = useColorScheme() || "light";
    const {
        lot: {
            id,
            lotArea,
            lotAddress,
            vehicleId,
            vehicleModel,
            startTime,
            endTime,
            durationHours,
            pricPerHour
        }
    } = useLotStore();

    const {
        handleCreate,
        creationError,
        isCreating
    } = useReservation();

    const handleBook = () => {
        handleCreate({
            id: "",
            driverId,
            lotId: id,
            vehicleId,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            status: "pending",
            createdAt: ""
        })
    }


    return (
        <>
            <View
                style={styles.container}
            >
                <Header
                    title="Review Summary"
                />
                <View
                    style={{
                        flex: 1,
                        gap: 10
                    }}
                >
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
                                {durationHours} {+durationHours < 2 ? "hour" : "hours"}
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
                                ${pricPerHour}/hour
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
                                $ {pricPerHour * +durationHours}
                            </Text>
                        </View>
                    </View>
                    {
                        creationError &&
                        <Text
                            style={{
                                fontSize: 14,
                                color: "#ff0000"
                            }}
                        >
                            {creationError.message}
                        </Text>
                    }
                </View>
                <Button
                    title="Book Now"
                    onPress={handleBook}
                />
            </View >
            {
                isCreating &&
                <Loading />
            }
        </>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 60,
        gap: 20
    },
    card: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 15,
        gap: 10
    }
})

export default ReviewScreen;