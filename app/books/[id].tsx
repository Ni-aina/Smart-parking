import NoDataFound from "@/components/noDataFound";
import Button from "@/components/ui/button";
import Header from "@/components/ui/header";
import LoaderSkeleton from "@/components/ui/Skeleton";
import { Colors } from "@/constants/Colors";
import usePaymentReservation from "@/hooks/payments/usePaymentReservation";
import { ticketHmtl } from "@/lib/ticketHtml";
import { getDateFormat, getTimeFormat } from "@/utils/dateTimeAction";
import * as Print from 'expo-print';
import { useLocalSearchParams } from "expo-router";
import {
    StyleSheet,
    Text,
    useColorScheme,
    View
} from "react-native";
import QRCode from "react-native-qrcode-svg";

const TextWeight = ({
    text,
}: { text: string }) => {
    const colorscheme = useColorScheme() || "light";

    return (
        <Text
            style={{
                fontSize: 16,
                color: Colors[colorscheme].text,
                fontWeight: "600"
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
        >
            {text}
        </Text>
    )
}

const ETicket = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const colorscheme = useColorScheme() || "light";

    const {
        paymentReservation,
        paymentReservationLoading
    } = usePaymentReservation(id);

    if (paymentReservationLoading) return (
        <View style={styles.container}>
            <LoaderSkeleton />
        </View>
    )

    if (!paymentReservation?.transactionId) {
        return (
            <View style={styles.container}>
                <Header
                    title="E-Ticket"
                />
                <NoDataFound
                    message="No payment reservation found"
                    iconName="card-outline"
                />
            </View>
        )
    }

    const {
        reservation: {
            startTime,
            endTime,
            vehicle: {
                plateNumber
            },
            lot: {
                name: lotName,
                location: lotLocation
            }
        },
        amount,
        status,
        transactionId
    } = paymentReservation;

    const handlePrint = async () => {
        const htmlToPrint = ticketHmtl({
            transactionId,
            lotName,
            lotLocation,
            plateNumber,
            amount,
            status,
            startTime,
            endTime
        })

        if (!htmlToPrint) return;

        await Print.printAsync({
            html: htmlToPrint
        })
    }

    return (
        <View style={[styles.container, { backgroundColor: Colors[colorscheme].background }]}>
            <Header
                title="E-Ticket"
            />
            <View
                style={{
                    flex: 1,
                    justifyContent: "space-between"
                }}
            >
                <View
                    style={{
                        backgroundColor:
                            colorscheme === "light" ?
                                "#F5F5F5" :
                                "#1E1E1E",
                        borderWidth: 1,
                        borderColor: Colors[colorscheme].gray200,
                        borderRadius: 15,
                        marginTop: 20,
                        padding: 30,
                        gap: 40
                    }}
                >
                    <View
                        style={{
                            minHeight: 200,
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <QRCode
                            value={transactionId}
                            size={200}
                        />
                        <View
                            style={{
                                width: "100%",
                                borderBottomWidth: 1,
                                borderColor: Colors[colorscheme].icon,
                                borderStyle: "dashed",
                                marginTop: 40,
                                position: "relative"
                            }}
                        >
                            <View
                                style={{
                                    position: "absolute",
                                    top: -16,
                                    left: -45,
                                    width: 32,
                                    height: 32,
                                    backgroundColor: Colors[colorscheme].background,
                                    borderRadius: 16
                                }}
                            />
                            <View
                                style={{
                                    position: "absolute",
                                    top: -16,
                                    right: -45,
                                    width: 32,
                                    height: 32,
                                    backgroundColor: Colors[colorscheme].background,
                                    borderRadius: 16
                                }}
                            />
                        </View>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            gap: 16
                        }}
                    >
                        <View
                            style={{
                                width: "50%",
                                gap: 10
                            }}
                        >
                            <View
                                style={{
                                    gap: 5
                                }}
                            >
                                <Text
                                    style={{ color: Colors[colorscheme].icon }}
                                >
                                    Name
                                </Text>
                                <TextWeight text={lotName} />
                            </View>
                            <View
                                style={{
                                    gap: 5
                                }}
                            >
                                <Text
                                    style={{ color: Colors[colorscheme].icon }}
                                >
                                    Location
                                </Text>
                                <TextWeight text={lotLocation} />
                            </View>
                            <View
                                style={{
                                    gap: 5
                                }}
                            >
                                <Text
                                    style={{ color: Colors[colorscheme].icon }}
                                >
                                    Arrival Date
                                </Text>
                                <TextWeight
                                    text={
                                        getDateFormat(new Date(startTime))
                                    }
                                />
                            </View>
                            <View
                                style={{
                                    gap: 5
                                }}
                            >
                                <Text
                                    style={{ color: Colors[colorscheme].icon }}
                                >
                                    Arrival Time
                                </Text>
                                <TextWeight
                                    text={
                                        getTimeFormat(new Date(startTime))
                                    }
                                />
                            </View>
                        </View>
                        <View
                            style={{
                                width: "50%",
                                gap: 10
                            }}
                        >
                            <View
                                style={{
                                    gap: 5
                                }}
                            >
                                <Text
                                    style={{ color: Colors[colorscheme].icon }}
                                >
                                    Vehicle Number
                                </Text>
                                <TextWeight text={plateNumber} />
                            </View>
                            <View
                                style={{
                                    gap: 5
                                }}
                            >
                                <Text
                                    style={{ color: Colors[colorscheme].icon }}
                                >
                                    Payment  Status
                                </Text>
                                <TextWeight text={status} />
                            </View>
                            <View
                                style={{
                                    gap: 5
                                }}
                            >
                                <Text
                                    style={{ color: Colors[colorscheme].icon }}
                                >
                                    Exit Date
                                </Text>
                                <TextWeight
                                    text={
                                        getDateFormat(new Date(endTime))
                                    }
                                />
                            </View>
                            <View
                                style={{
                                    gap: 5
                                }}
                            >
                                <Text
                                    style={{ color: Colors[colorscheme].icon }}
                                >
                                    Exit Time
                                </Text>
                                <TextWeight
                                    text={
                                        getTimeFormat(new Date(endTime))
                                    }
                                />
                            </View>
                            <View
                                style={{
                                    marginTop: 10,
                                    gap: 5
                                }}
                            >
                                <Text
                                    style={{
                                        fontWeight: "700",
                                        color: Colors[colorscheme].icon
                                    }}
                                >
                                    Total Payment
                                </Text>
                                <TextWeight text={`$ ${amount}`} />
                            </View>
                        </View>
                    </View>
                </View>
                <Button
                    title="Print"
                    onPress={handlePrint}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 60,
        gap: 20
    }
})

export default ETicket;