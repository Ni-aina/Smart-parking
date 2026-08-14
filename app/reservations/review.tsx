import ReviewReservation from "@/components/reservations/reviewReservation";
import Button from "@/components/ui/button";
import ErrorModal from "@/components/ui/errorModal";
import Header from "@/components/ui/header";
import Loading from "@/components/ui/loading";
import useReservation from "@/hooks/books/useReservation";
import useCurrentProfile from "@/hooks/useCurrentProfile";
import { useLotStore } from "@/stores/zustand/lot";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

const ReviewScreen = () => {
    const { t } = useTranslation();
    const { currentProfile } = useCurrentProfile();
    const driverId = currentProfile?.id || "";

    const [error, setError] = useState("");

    const {
        lot: {
            id,
            lotArea,
            lotAddress,
            vehicleId,
            vehicleNumber,
            startTime,
            endTime,
            durationHours,
            pricePerHour
        }
    } = useLotStore();

    const {
        handleCreate,
        creationError,
        isCreating
    } = useReservation();

    const handleBook = () => {
        if (!startTime || !endTime || !durationHours) {
            setError(t("duration_required"))
            return
        }

        const timeMinusFiveMinutes = new Date()
        timeMinusFiveMinutes.setMinutes(timeMinusFiveMinutes.getMinutes() - 5)

        if (startTime < timeMinusFiveMinutes) {
            setError(t("book_time_error"))
            return
        }

        handleCreate({
            driverId,
            lotId: id,
            vehicleId,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            status: "pending"
        })
    }

    useEffect(() => {
        const timedOut = setTimeout(() => {
            setError("");
        }, 1000 * 3)
        return () => clearTimeout(timedOut);
    }, [error])

    return (
        <>
            <View
                style={styles.container}
            >
                <Header
                    title={t("review_summary")}
                />
                <View
                    style={{
                        flex: 1,
                        gap: 10
                    }}
                >
                    <ReviewReservation
                        lotArea={lotArea}
                        lotAddress={lotAddress}
                        vehicleNumber={vehicleNumber}
                        pricePerHour={pricePerHour}
                        durationHours={+durationHours}
                        startTime={startTime}
                    />
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
                    title={t("book_now")}
                    onPress={handleBook}
                />
            </View >

            <ErrorModal
                visible={!!error}
                title={t("required_information")}
                message={error}
                onClose={() => setError("")}
            />

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
        paddingBottom: 50,
        gap: 20
    }
})

export default ReviewScreen;