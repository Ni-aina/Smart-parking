import PaymentReview from "@/components/books/paymentReview";
import NoDataFound from "@/components/NoDataFound";
import Button from "@/components/ui/button";
import Header from "@/components/ui/header";
import LoaderSkeleton from "@/components/ui/Skeleton";
import { Colors } from "@/constants/Colors";
import usePaymentReservation from "@/hooks/payments/usePaymentReservation";
import { ticketHmtl } from "@/lib/ticketHtml";
import * as Print from 'expo-print';
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    StyleSheet,
    useColorScheme,
    View
} from "react-native";
import QRCode from "react-native-qrcode-svg";

const ETicket = () => {
    const { t } = useTranslation();
    const { id } = useLocalSearchParams<{ id: string }>();
    const colorscheme = useColorScheme() || "light";
    const [isPrinting, setIsPrinting] = useState(false);

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
                    title={t("e_ticket")}
                />
                <NoDataFound
                    message={t("no_payment_reservation_found")}
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
        try {
            setIsPrinting(true);

            const htmlToPrint = ticketHmtl({
                transactionId,
                lotName,
                lotLocation,
                plateNumber,
                amount,
                status: t(`status_${status.toLowerCase()}`, { defaultValue: status }),
                startTime,
                endTime,
                labels: {
                    name: t("name"),
                    location: t("location"),
                    arrivalDate: t("arrival_date"),
                    arrivalTime: t("arrival_time"),
                    vehicleNumber: t("vehicle_number"),
                    paymentStatus: t("payment_status"),
                    exitDate: t("exit_date"),
                    exitTime: t("exit_time"),
                    totalPayment: t("total_payment")
                }
            })

            if (!htmlToPrint) return;

            await Print.printAsync({
                html: htmlToPrint
            })
        } catch {

        } finally {
            setIsPrinting(false);
        }
    }

    return (
        <View style={[styles.container, { backgroundColor: Colors[colorscheme].background }]}>
            <Header
                title={t("e_ticket")}
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
                    title={t("print")}
                    onPress={handlePrint}
                    disabled={isPrinting}
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
        paddingBottom: 50,
        gap: 20
    }
})

export default ETicket;