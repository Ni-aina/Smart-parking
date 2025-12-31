import { createReservation, getReservationsByDriverId } from "@/actions/reservation.action";
import { ReservationPostInterface } from "@/types/reservation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import useCurrentProfile from "./useCurrentProfile";

const useReservation = () => {
    const { currentProfile } = useCurrentProfile();
    const driverId = currentProfile?.id || "";

    const queryClient = useQueryClient();
    const router = useRouter();

    const {
        data: reservations,
        isLoading,
        refetch,
        isRefetching
    } = useQuery({
        queryKey: [`fetch-reservation-${driverId}`],
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
                queryKey: [`fetch-reservation-${driverId}`, "parking-lots"]
            })
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

export default useReservation;