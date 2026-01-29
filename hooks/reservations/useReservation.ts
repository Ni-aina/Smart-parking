import { getReservationById } from "@/actions/reservation.action";
import { useQuery } from "@tanstack/react-query";

const useReservation = (id: string) => {
    const {
        data: reservation,
        isLoading,
    } = useQuery({
        queryKey: [`fetch-reservation-${id}`],
        queryFn: () => getReservationById(id)
    })

    return {
        reservation,
        isLoading
    }
}

export default useReservation;