import useVehicles from "@/hooks/vehicles/useVehicles";
import { useLotStore } from "@/stores/zustand/lot";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, View } from "react-native";
import Button from "../ui/button";
import ErrorModal from "../ui/errorModal";
import RequestTooLong from "../ui/requestTooLong";
import LoaderSkeleton from "../ui/Skeleton";
import VehicleSelectItem from "./VehicleSelectItem";

const VehicleList = () => {
    const { t } = useTranslation()
    const [error, setError] = useState("");
    const router = useRouter();

    const {
        vehicles,
        errorFetching,
        isLoading,
        refetch,
        isRefetching
    } = useVehicles();

    const {
        lot: {
            vehicleId
        }
    } = useLotStore()

    const handleContinue = () => {
        if (!vehicleId) {
            setError("Please select a vehicle");
            return;
        }
        router.push("/reservation/bookDetails");
    }

    useEffect(() => {
        const timedOut = setTimeout(() => {
            setError("");
        }, 1000 * 3)
        return () => clearTimeout(timedOut);
    }, [error])

    if (isLoading) return <LoaderSkeleton />

    return (
        <>
            <View
                style={{
                    flex: 1,
                    paddingBottom: 10
                }}
            >
                {
                    errorFetching ?
                        <RequestTooLong
                            message={errorFetching.message}
                            refresh={refetch}
                        /> :

                        <FlatList
                            data={vehicles}
                            keyExtractor={item => item.id?.toString()}
                            renderItem={({ item }) =>
                                <VehicleSelectItem
                                    vehicle={item}
                                />
                            }
                            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                            showsVerticalScrollIndicator={false}
                            refreshing={isRefetching}
                            onRefresh={refetch}
                        />
                }
                <Button
                    title={t("continue")}
                    onPress={handleContinue}
                />
            </View>
            <ErrorModal
                visible={!!error}
                title={t("no_selected_vehicle")}
                message={error}
                onClose={() => setError("")}
            />
        </>
    )
}

export default VehicleList;