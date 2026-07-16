import { cancelReservation, createReservation, getReservationById } from "@/actions/reservation.action";
import { initialLotState } from "@/data/lot";
import { useLotStore } from "@/stores/zustand/lot";
import { ReservationPostInterface } from "@/types/reservation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import useCurrentProfile from "../useCurrentProfile";

const useReservation = (id?: string) => {
    const { currentProfile } = useCurrentProfile();
    const driverId = currentProfile?.id || "";

    const queryClient = useQueryClient();
    const router = useRouter();

    const { setLot } = useLotStore();

    const {
        data: reservation,
        isLoading
    } = useQuery({
        queryKey: [`fetch-reservation-${id}`],
        queryFn: () => getReservationById(id as string),
        enabled: !!id
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
                queryKey: [`fetch-reservations-${driverId}`]
            })
            queryClient.invalidateQueries({
                queryKey: [`fetch-book-history-${driverId}`]
            })
            setLot(initialLotState);
            router.push("/(tabs)/book");
        }
    })


    const {
        mutate: handleCancel,
        error: cancellationError
    } = useMutation({
        mutationKey: [`cancel-reservation-${id}`],
        mutationFn: () => cancelReservation(id as string),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [`fetch-reservations-${driverId}`]
            })
            queryClient.invalidateQueries({
                queryKey: [`fetch-book-history-${driverId}`]
            })
        }
    })

    return {
        reservation,
        isLoading,
        handleCreate,
        creationError,
        isCreating,
        handleCancel,
        cancellationError
    }
}

export default useReservation;