import ReviewReservation from "@/components/reservations/reviewReservation";
import Button from "@/components/ui/button";
import Header from "@/components/ui/header";
import Loading from "@/components/ui/loading";
import useReservations from "@/hooks/reservations/useReservations";
import useCurrentProfile from "@/hooks/useCurrentProfile";
import { useLotStore } from "@/stores/zustand/lot";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

const ReviewScreen = () => {
    const { t } = useTranslation();
    const { currentProfile } = useCurrentProfile();
    const driverId = currentProfile?.id || "";

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
    } = useReservations();

    const handleBook = () => {
        handleCreate({
            driverId,
            lotId: id,
            vehicleId,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            status: "pending"
        })
    }


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
    }
})

export default ReviewScreen;