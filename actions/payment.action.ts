import { supabase } from "@/lib/supabase";
import { PaymentInterface } from "@/types/payment";
import { normalizeData } from "@/utils/normalizeData";
import { rejectTimeout } from "@/utils/rejectTimeout";

export async function getPaymentByReservationId(reservationId: string)
    : Promise<PaymentInterface> {
    try {
        const request = (async () => {
            const {
                data: paymentData,
                error: errorPayment
            } = await supabase
                .from('payments')
                .select(`
                    id,
                    reservation: reservation_id (
                        id,
                        lot: lot_id(
                            id,
                            name,
                            location,
                            price_per_hour
                        ),
                        vehicle: vehicle_id(
                            id,
                            make,
                            model,
                            plate_number
                        ),
                        start_time,
                        end_time
                    ),
                    amount,
                    method,
                    status,
                    transaction_id,
                    created_at
                `)
                .eq('reservation_id', reservationId)
                .maybeSingle();

            if (errorPayment) {
                throw errorPayment;
            }

            return normalizeData(paymentData || {}) as PaymentInterface;
        }
        )()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}

export async function getPaymentByTransactionId(transactionId: string)
    : Promise<PaymentInterface> {
    try {
        const request = (async () => {
            const {
                data: paymentData,
                error: errorPayment
            } = await supabase
                .from('payments')
                .select(`
                    id,
                    reservation: reservation_id (
                        id,
                        lot: lot_id(
                            id,
                            name,
                            location,
                            price_per_hour
                        ),
                        vehicle: vehicle_id(
                            id,
                            make,
                            model,
                            plate_number
                        ),
                        start_time,
                        end_time
                    ),
                    amount,
                    method,
                    status,
                    transaction_id,
                    created_at
                `)
                .eq('transaction_id', transactionId)
                .maybeSingle();

            if (errorPayment) {
                throw errorPayment;
            }

            return normalizeData(paymentData || {}) as PaymentInterface;
        }
        )()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}