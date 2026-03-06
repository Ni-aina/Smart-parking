import { getPaymentByTransactionId, updateTicketToScanned } from "@/actions/payment.action";
import { updateReservationToCompleted } from "@/actions/reservation.action";
import NoDataFound from "@/components/noDataFound";
import ProtectedRoute from "@/components/ProtectedRoute";
import ScanResult from "@/components/scanner/scanResult";
import Button from "@/components/ui/button";
import Header from "@/components/ui/header";
import Loading from "@/components/ui/loading";
import { Colors } from "@/constants/Colors";
import useCurrentProfile from "@/hooks/useCurrentProfile";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, useColorScheme, View } from "react-native";

type ScanStatus = "valid" | "expired" | "not_found";

const QRCodeScanner = () => {
    const { currentProfile } = useCurrentProfile();
    const profileId = currentProfile?.id!;
    const agentCreatorId = currentProfile?.agentCreatorId!;
    const roles = currentProfile?.roles || [];

    const { t } = useTranslation();
    const colorScheme = useColorScheme() || "light";

    const [permission, requestPermission] = useCameraPermissions();
    const [scanStatus, setScanStatus] = useState<ScanStatus>();
    const [scanning, setScanning] = useState(false);
    const [isPending, setIsPending] = useState(false);

    const handleBarcodeScanned = async ({ data }: { data: string }) => {
        if (isPending) return;

        if (!data || (!agentCreatorId && !roles.includes("owner"))) {
            setScanning(false);
            return;
        }
        
        try {
            setIsPending(true);

            const paymentData = await getPaymentByTransactionId(data);
            if (!paymentData) throw new Error(t("payment_not_found"));

            const endTime = new Date(paymentData.reservation.endTime);
            const isExpired = endTime < new Date();
            
            const {
                id: paymentId,
                reservation: {
                    id: reservationId,
                    lot: {
                        ownerId: lotOwner
                    }
                },
                hasScanned
            } = paymentData;
            
            if (lotOwner !== agentCreatorId && (!roles.includes("owner") || profileId !== lotOwner)) throw new Error();

            if (hasScanned) await updateReservationToCompleted(reservationId);
            else await updateTicketToScanned(paymentId);
            
            setScanStatus(isExpired ? "expired" : "valid");
        } catch {
            setScanStatus("not_found");
        } finally {
            setIsPending(false);
            setScanning(false);
        }
    }

    useEffect(() => {
        if (!scanning) return;
        setScanStatus(undefined);
    }, [scanning])

    if (!permission) return (
        <ProtectedRoute>
            <View style={styles.container}>
                <Header
                    title={t("scanner")}
                />
                <NoDataFound
                    message={t("permission_denied")}
                    iconName="accessibility-outline"
                />
            </View>
        </ProtectedRoute>
    )

    if (!permission.granted) return (
        <ProtectedRoute>
            <View style={styles.container}>
                <Header
                    title={t("scanner")}
                />
                <Text
                    style={{
                        color: Colors[colorScheme].text
                    }}
                >
                    {t("camera_permission_message")}
                </Text>
                <Button
                    title={t("grant_permission")}
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
                    title={t("scanner")}
                />
                {
                    scanStatus &&
                    <ScanResult status={scanStatus} />
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
                                title={t("stop_scan")}
                                onPress={
                                    () => setScanning(false)
                                }
                            />
                        </View>
                        :
                        <>
                            {
                                !scanStatus &&
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
                                    title={t("scan_now")}
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
