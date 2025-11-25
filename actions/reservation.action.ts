import { supabase } from "@/lib/supabase";
import { ReservationInterface } from "@/types/reservation";
import { isUUID } from "@/utils/isUUID";
import { denormalizeData, normalizeData } from "@/utils/normalizeData";
import { rejectTimeout } from "@/utils/rejectTimeout";

export async function createReservation(reservation: ReservationInterface)
    : Promise<ReservationInterface> {
    try {
        const { id, created_at, ...payload } = denormalizeData(reservation);

        const request = (async () => {
            const { data: newReservation, error } = await supabase.from("reservations")
                .insert([payload])
                .select();
            if (!newReservation || error) throw new Error(`An error occured during reservation creation, 
                ${error.message}`)

            return normalizeData(newReservation) as ReservationInterface;
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
                .select("*")
                .eq("driver_id", driverId)
                .gte("created_at", new Date().toISOString())

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