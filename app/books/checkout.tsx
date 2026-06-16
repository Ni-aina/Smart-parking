import { getPaymentByReservationId } from "@/actions/payment.action";
import { createPaymentIntent } from "@/actions/stripe.action";
import ReviewReservation from "@/components/reservations/reviewReservation";
import Button from "@/components/ui/button";
import ErrorModal from "@/components/ui/errorModal";
import Header from "@/components/ui/header";
import Loading from "@/components/ui/loading";
import LoaderSkeleton from "@/components/ui/Skeleton";
import { Colors } from "@/constants/Colors";
import useReservation from "@/hooks/reservations/useReservation";
import useCurrentProfile from "@/hooks/useCurrentProfile";
import { calculateDurationHours } from "@/utils/dateTimeAction";
import { CardField, useStripe } from "@stripe/stripe-react-native";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, useColorScheme, View } from "react-native";

const Checkout = () => {
    const { t } = useTranslation();
    const colorScheme = useColorScheme() || "light";
    const router = useRouter();

    const queryClient = useQueryClient();

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [pendingPayment, setPendingPayment] = useState(false);

    const {
        id,
        amount: amountString,
    } = useLocalSearchParams<{
        id: string,
        amount: string
    }>()

    const {
        isLoading,
        reservation
    } = useReservation(id);

    const {
        currentProfile
    } = useCurrentProfile();

    const amount = Number.parseFloat(amountString);
    const driverId = currentProfile?.id;

    const { confirmPayment } = useStripe();

    const pay = async () => {
        try {
            setPendingPayment(true);
            const paymentReservation = await getPaymentByReservationId(id);

            const alreadyPaid = paymentReservation?.transactionId &&
                paymentReservation.status === "succeeded";

            if (alreadyPaid) {
                setErrorMessage(t("already_paid_reservation"));
                setPendingPayment(false);
                return;
            }

            const {
                clientSecret,
                error: createPaymentError
            } = await createPaymentIntent(
                driverId!,
                id,
                amount
            )

            if (createPaymentError) {
                throw new Error(createPaymentError);
            }

            const { error: confirmError, paymentIntent } = await confirmPayment(
                clientSecret,
                {
                    paymentMethodType: "Card"
                }
            )

            if (confirmError) {
                throw new Error(confirmError.message);
            } else {
                const transactionId = paymentIntent.id!;

                if (!transactionId) {
                    throw new Error(t("payment_failed_no_transaction"));
                }

                await queryClient.invalidateQueries({
                    queryKey: [`fetch-reservation-${driverId}`, "parking-lots"]
                })

                router.push("/(tabs)/book");
            }
        } catch (error) {
            const errorMessage = error instanceof Error ?
                error.message === "ended_reservation_error" ?
                    t("ended_reservation_error") : error.message
                : t("unexpected_error");
            setErrorMessage(errorMessage);
        }
        finally {
            setPendingPayment(false);
        }
    }

    if (isLoading) return (
        <View
            style={styles.container}
        >
            <LoaderSkeleton />
        </View>
    )

    if (!reservation) return;

    const {
        lot: {
            name: lotArea,
            location: lotAddress,
            pricePerHour
        },
        vehicle: {
            plateNumber
        },
        startTime: startTimeStr,
        endTime: endTimeStr
    } = reservation;

    const startTime = new Date(startTimeStr);
    const durationHours = calculateDurationHours(startTimeStr, endTimeStr)

    return (
        <>
            <View style={styles.container}>
                <Header
                    title={t("checkout")}
                />
                <View style={styles.content}>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: "flex-start",
                            gap: 20
                        }}
                    >
                        <ReviewReservation
                            lotArea={lotArea}
                            lotAddress={lotAddress}
                            vehicleNumber={plateNumber}
                            pricePerHour={pricePerHour}
                            durationHours={durationHours}
                            startTime={startTime}
                        />
                        <CardField
                            postalCodeEnabled={false}
                            placeholders={{
                                number: t("card_placeholder")
                            }}
                            cardStyle={{
                                backgroundColor: Colors[colorScheme].background,
                                placeholderColor: Colors[colorScheme].icon,
                                textColor: Colors[colorScheme].text,
                                borderRadius: 5
                            }}
                            style={{
                                width: "100%",
                                height: 50,
                                marginVertical: 10
                            }}
                        />
                    </View>
                    <Button
                        title={t("pay_now")}
                        onPress={pay}
                    />
                </View>
            </View>
            <ErrorModal
                onClose={
                    () => setErrorMessage(null)
                }
                message={errorMessage || ""}
                visible={errorMessage !== null}
            />
            {
                pendingPayment &&
                <Loading />
            }
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 60,
        gap: 20
    },
    content: {
        flex: 1,
        justifyContent: "space-between"
    }
})

export default Checkout;