import PaymentReview from "@/components/books/paymentReview";
import NoDataFound from "@/components/noDataFound";
import Button from "@/components/ui/button";
import Header from "@/components/ui/header";
import LoaderSkeleton from "@/components/ui/Skeleton";
import { Colors } from "@/constants/Colors";
import usePaymentReservation from "@/hooks/payments/usePaymentReservation";
import { ticketHmtl } from "@/lib/ticketHtml";
import * as Print from 'expo-print';
import { useLocalSearchParams } from "expo-router";
import {
    StyleSheet,
    useColorScheme,
    View
} from "react-native";
import QRCode from "react-native-qrcode-svg";

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
                        <View
                            style={{
                                marginTop: 30
                            }}
                        >
                            <PaymentReview
                                lotName={lotName}
                                lotLocation={lotLocation}
                                startTime={startTime}
                                endTime={endTime}
                                plateNumber={plateNumber}
                                status={status}
                                amount={amount}
                            />
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