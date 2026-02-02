import { getPaymentByTransactionId } from "@/actions/payment.action";
import PaymentReview from "@/components/books/paymentReview";
import NoDataFound from "@/components/noDataFound";
import ProtectedRoute from "@/components/ProtectedRoute";
import Button from "@/components/ui/button";
import Header from "@/components/ui/header";
import Loading from "@/components/ui/loading";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useEffect, useState } from "react";
import { StyleSheet, Text, useColorScheme, View } from "react-native";

const QRCodeScanner = () => {
    const colorScheme = useColorScheme() || "light";

    const [permission, requestPermission] = useCameraPermissions();
    const [payment, setPayment] = useState<{
        lotName: string;
        lotLocation: string;
        plateNumber: string;
        status: string;
        startTime: Date;
        endTime: Date;
        amount: number;
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
                        name: lotName,
                        location: lotLocation,
                    },
                    vehicle: {
                        plateNumber
                    },
                    startTime: startTimeStr,
                    endTime: endTimeStr,
                },
                amount,
                status
            } = paymentData;

            const startTime = new Date(startTimeStr);
            const endTime = new Date(endTimeStr);

            setPayment({
                lotName,
                lotLocation,
                plateNumber,
                status,
                startTime,
                endTime,
                amount
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
                        <View
                            style={{
                                backgroundColor:
                                    colorScheme === "light" ?
                                        "#F5F5F5" :
                                        "#1E1E1E",
                                borderWidth: 1,
                                borderColor: Colors[colorScheme].gray200,
                                borderRadius: 15,
                                padding: 30,
                                gap: 40
                            }}
                        >
                            <PaymentReview
                                lotName={payment.lotName}
                                lotLocation={payment.lotLocation}
                                startTime={payment.startTime}
                                endTime={payment.endTime}
                                plateNumber={payment.plateNumber}
                                status={payment.status}
                                amount={payment.amount}
                            />
                        </View>
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
                        <View
                            style={{
                                marginTop: 15
                            }}
                        >
                            <Button
                                title="Stop scan"
                                onPress={
                                    () => setScanning(false)
                                }
                            />
                        </View>
                        :
                        <>
                            {
                                payment === undefined &&
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
                            }
                            <View
                                style={{
                                    marginTop: 15
                                }}
                            >
                                <Button
                                    title="Scan now"
                                    onPress={
                                        () => setScanning(true)
                                    }
                                />
                            </View>
                        </>
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