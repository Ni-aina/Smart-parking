import { createReservation, getReservationsByDriverId } from "@/actions/reservation.action";
import { initialLotState } from "@/data/lot";
import { useLotStore } from "@/stores/zustand/lot";
import { ReservationPostInterface } from "@/types/reservation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import useCurrentProfile from "../useCurrentProfile";

const useReservations = () => {
    const { currentProfile } = useCurrentProfile();
    const driverId = currentProfile?.id || "";

    const queryClient = useQueryClient();
    const router = useRouter();

    const { setLot } = useLotStore();

    const {
        data: reservations,
        isLoading,
        refetch,
        isRefetching
    } = useQuery({
        queryKey: [`fetch-reservations-${driverId}`],
        queryFn: () => getReservationsByDriverId(driverId)
    })

    const {
        mutate: handleCreate,
        error: creationError,
        isPending: isCreating
    } = useMutation({
        mutationKey: ["create-reservation"],
        mutationFn: (reservation: ReservationPostInterface) => createReservation(reservation),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [`fetch-reservations-${driverId}`, "parking-lots"]
            })
            setLot(initialLotState);
            router.push("/(tabs)/book");
        }
    })

    return {
        reservations,
        isLoading,
        refetch,
        isRefetching,
        handleCreate,
        creationError,
        isCreating
    }
}

export default useReservations;