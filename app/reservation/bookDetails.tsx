import BookForm from "@/components/reservations/bookForm";
import Button from "@/components/ui/button";
import ErrorModal from "@/components/ui/errorModal";
import Header from "@/components/ui/header";
import { useLotStore } from "@/stores/zustand/lot";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

const BookDetailsScreen = () => {
    const { t } = useTranslation();
    const [error, setError] = useState("");
    const router = useRouter();

    const {
        lot: {
            startTime,
            endTime,
            durationHours
        }
    } = useLotStore();

    const handleContinue = () => {
        if (
            !startTime ||
            !endTime ||
            !durationHours
        ) {
            setError(t("duration_required"));
            return;
        }
        router.push("/reservation/review");
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
                    title={t("book_details")}
                />
                <BookForm />
                <Button
                    title={t("continue")}
                    onPress={handleContinue}
                />
            </View>
            <ErrorModal
                visible={!!error}
                title={t("required_information")}
                message={error}
                onClose={() => setError("")}
            />
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

export default BookDetailsScreen;