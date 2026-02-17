import { cancelReservation, getReservationById } from "@/actions/reservation.action";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useCurrentProfile from "../useCurrentProfile";

const useReservation = (id: string) => {
    const { currentProfile } = useCurrentProfile();
    const driverId = currentProfile?.id || "";

    const queryClient = useQueryClient();

    const {
        data: reservation,
        isLoading
    } = useQuery({
        queryKey: [`fetch-reservation-${id}`],
        queryFn: () => getReservationById(id)
    })

    const {
        mutate: handleCancel,
        error: cancellationError,
        isPending: isCancelling
    } = useMutation({
        mutationKey: [`cancel-reservation-${id}`],
        mutationFn: () => cancelReservation(id),
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
        handleCancel,
        cancellationError,
        isCancelling
    }
}

export default useReservation;