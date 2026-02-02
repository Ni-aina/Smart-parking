import { getPaymentByTransactionId } from "@/actions/payment.action";
import NoDataFound from "@/components/noDataFound";
import ProtectedRoute from "@/components/ProtectedRoute";
import ReviewReservation from "@/components/reservations/reviewReservation";
import Button from "@/components/ui/button";
import Header from "@/components/ui/header";
import Loading from "@/components/ui/loading";
import { Colors } from "@/constants/Colors";
import { calculateDurationHours } from "@/utils/dateTimeAction";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useEffect, useState } from "react";
import { StyleSheet, Text, useColorScheme, View } from "react-native";

const QRCodeScanner = () => {
    const colorScheme = useColorScheme() || "light";

    const [permission, requestPermission] = useCameraPermissions();
    const [payment, setPayment] = useState<{
        lotArea: string;
        lotAddress: string;
        vehicleModel: string;
        pricePerHour: number;
        durationHours: number;
        startTime: Date;
    } | null>();
    const [scanning, setScanning] = useState(false);
    const [isPending, setIsPending] = useState(false);

    const handleBarcodeScanned = async ({ data }: { data: string }) => {
        if (!data) {
            setScanning(false);
            return;
        }
        try {
            setIsPending(true);
            const paymentData = await getPaymentByTransactionId(data);
            if (!paymentData) throw new Error("Payment not found");
            const {
                reservation: {
                    lot: {
                        name: lotArea,
                        location: lotAddress,
                        pricePerHour
                    },
                    vehicle: {
                        model: vehicleModel
                    },
                    startTime: startTimeStr,
                    endTime: endTimeStr
                }
            } = paymentData;

            const startTime = new Date(startTimeStr);
            const durationHours = calculateDurationHours(startTimeStr, endTimeStr);

            setPayment({
                lotArea,
                lotAddress,
                vehicleModel,
                pricePerHour,
                durationHours,
                startTime
            })
        } catch (error) {
            setPayment(null);
        } finally {
            setIsPending(false);
            setScanning(false);
        }
    }

    useEffect(() => {
        if (!scanning) return;
        setPayment(undefined);
    }, [scanning])

    if (!permission) return (
        <ProtectedRoute>
            <View style={styles.container}>
                <Header
                    title="Scanner"
                />
                <NoDataFound
                    message="Persmission denied"
                    iconName="accessibility-outline"
                />
            </View>
        </ProtectedRoute>
    )

    if (!permission.granted) return (
        <ProtectedRoute>
            <View style={styles.container}>
                <Header
                    title="Scanner"
                />
                <Text
                    style={{
                        color: Colors[colorScheme].text
                    }}
                >
                    To scan QR codes and check in bookings, we need access to your device's camera.
                    Your privacy is important to us - the camera will only be used for scanning purposes.
                </Text>
                <Button
                    title="Grant Permission"
                    onPress={requestPermission}
                />
            </View>
        </ProtectedRoute>
    )

    return (
        <>
            <View
                style={styles.container}
            >
                <Header
                    title="Scanner"
                />
                {
                    payment === null ?
                        <NoDataFound
                            message="Payment not found"
                            iconName="card-outline"
                        />
                        :
                        payment &&
                        <ReviewReservation
                            lotArea={payment.lotArea}
                            lotAddress={payment.lotAddress}
                            vehicleModel={payment.vehicleModel}
                            pricePerHour={payment.pricePerHour}
                            durationHours={payment.durationHours}
                            startTime={payment.startTime}
                        />
                }
                {
                    scanning &&
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center"
                        }}
                    >
                        <CameraView
                            style={styles.camera}
                            barcodeScannerSettings={{
                                barcodeTypes: ["qr"],
                            }}
                            onBarcodeScanned={handleBarcodeScanned}
                        />
                    </View>
                }
                {
                    scanning ?
                        <Button
                            title="Stop scan"
                            onPress={
                                () => setScanning(false)
                            }
                        />
                        :
                        <View
                            style={{
                                gap: 30
                            }}
                        >
                            <View
                                style={{
                                    alignSelf: "stretch",
                                    flexDirection: "row",
                                    justifyContent: "center"
                                }}
                            >
                                <Ionicons
                                    size={200}
                                    name="scan-outline"
                                    color={Colors[colorScheme].gray200}
                                />
                            </View>
                            <Button
                                title="Scan now"
                                onPress={
                                    () => setScanning(true)
                                }
                            />
                        </View>
                }
            </View>
            {
                isPending &&
                <Loading />
            }
        </>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 40,
        paddingHorizontal: 20,
        gap: 20
    },
    camera: {
        width: "65%",
        height: 215,
        borderRadius: 8,
        overflow: "hidden"
    }
})

export default QRCodeScanner;