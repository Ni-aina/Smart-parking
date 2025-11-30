import { supabase } from "@/lib/supabase";
import { ReservationInterface, ReservationPostInterface } from "@/types/reservation";
import { isUUID } from "@/utils/isUUID";
import { denormalizeData, normalizeData } from "@/utils/normalizeData";
import { rejectTimeout } from "@/utils/rejectTimeout";

export async function createReservation(reservation: ReservationPostInterface)
    : Promise<ReservationPostInterface> {
    try {
        const { ...payload } = denormalizeData(reservation);

        const request = (async () => {
            const { data: newReservation, error } = await supabase.from("reservations")
                .insert([payload])
                .select();
            if (!newReservation || error) throw new Error(`An error occured during reservation creation, 
                ${error.message}`)

            return normalizeData(newReservation) as ReservationPostInterface;
        })()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}

export async function getReservationsByDriverId(driverId: string)
    : Promise<ReservationInterface[]> {
    try {
        if (!isUUID(driverId)) throw new Error("You have to be authenticated");

        const request = (async () => {
            const { data: reservations, error } = await supabase.from("reservations")
                .select(`
                    *,
                    driver: driver_id(*),
                    lot: lot_id(*),
                    vehicle: vehicle_id(*)
                `)
                .eq("driver_id", driverId)
                .order("created_at", {
                    ascending: false
                })

            if (!reservations) throw new Error(`Reservation fetching error, ${error.message}`);
            const normalizedData = reservations.map(item => normalizeData(item));
            return normalizedData as ReservationInterface[];
        })()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}