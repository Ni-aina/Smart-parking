import Button from "@/components/ui/button";
import Header from "@/components/ui/header";
import { Colors } from "@/constants/Colors";
import { useLotStore } from "@/stores/zustand/lot";
import { getDateFormat, getTimeFormat } from "@/utils/dateTimeAction";
import { StyleSheet, Text, useColorScheme, View } from "react-native";

const ReviewScreen = () => {
    const colorscheme = useColorScheme() || "light";
    const {
        lot: {
            lotArea,
            lotAddress,
            vehicleModel,
            startTime,
            durationHours
        }
    } = useLotStore();

    const handleBook = () => {

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
                        flex: 1
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
                                Duration
                            </Text>
                            <Text
                                style={{
                                    fontSize: 16,
                                    color: Colors[colorscheme].text
                                }}
                            >
                                {durationHours}
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
                    </View>
                </View>
                <Button
                    title="Book Now"
                    onPress={handleBook}
                />
            </View>
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