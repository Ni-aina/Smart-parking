import { getPaymentByReservationId } from "@/actions/payment.action";
import { useQuery } from "@tanstack/react-query";

const usePaymentReservation = (reservationId: string) => {
    
    const {
        data: paymentReservation,
        isLoading: paymentReservationLoading
    } = useQuery({
        queryKey: ["reservation-payment", reservationId],
        queryFn: async () => await getPaymentByReservationId(reservationId)
    })

    return {
        paymentReservation,
        paymentReservationLoading
    }
}
 
export default usePaymentReservation;