import { supabase } from "@/lib/supabase";
import { TransactionInterface, TransactionPostInterface } from "@/types/transaction";
import { denormalizeData, normalizeData } from "@/utils/normalizeData";
import { rejectTimeout } from "@/utils/rejectTimeout";

export async function createTransaction(transaction: TransactionPostInterface)
:Promise<TransactionInterface> {
    try {
        if (!transaction.reservationId) throw  new Error("You must have a reservation");
        const {...payload } = denormalizeData(transaction);
        const request = (async ()=> {
            const { data: newTransaction, error } = await supabase.from("payments")
            .insert([payload])
            .select(`
                *, 
                reservation:reservation_id(
                    *,
                    driver: driver_id(*),
                    lot: lot_id(*),
                    vehicle: vehicle_id(*)
                )
            `)

            if (!newTransaction || error) 
                throw new Error(`An error occured during transaction creation, ${error.message}`);

            const normalizedData = normalizeData(newTransaction);
            return normalizedData as TransactionInterface;
        })()
        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;   
    }
}