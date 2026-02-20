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

export async function getReservationById(id: string)
    : Promise<ReservationInterface> {
    try {
        if (!id) throw new Error("Reservation id is required");

        const request = (async () => {
            const { data: reservation, error } = await supabase.from("reservations")
                .select(`
                    *,
                    driver: driver_id(*),
                    lot: lot_id(*, owner: owner_id(*)),
                    vehicle: vehicle_id(*)
                `)
                .eq("id", id)
                ?.single()

            if (!reservation || error) throw new Error(`Reservation fetching error, ${error?.message}`);
            return normalizeData(reservation) as ReservationInterface;
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

        const d = new Date();
        d.setMonth(d.getMonth() - 6);

        const request = (async () => {
            const { data: reservations, error } = await supabase.from("reservations")
                .select(`
                    *,
                    driver: driver_id(*),
                    lot: lot_id(*),
                    vehicle: vehicle_id(*)
                `)
                .eq("driver_id", driverId)
                .gte("created_at", d.toISOString())
                .order("created_at", {
                    ascending: false
                })

            if (!reservations || error) throw new Error(`Reservations fetching error, ${error.message}`);
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

export async function getBooksHistoryByDriverId(driverId: string)
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

export async function checkLotByTime(
    lotId: string,
    startTime: Date,
    endTime: Date
): Promise<number> {
    try {
        if (!lotId) throw new Error("Lot id is required");
        if (!startTime || !endTime) throw new Error("Start time and end time are required");
        if (startTime > endTime) throw new Error("Start time must be before end time");

        const request = (async () => {
            const [lotResult, reservationsResult] = await Promise.all([
                supabase
                    .from("parking_lots")
                    .select("total_spots")
                    .eq("id", lotId)
                    .single(),
                supabase
                    .from("reservations")
                    .select("id")
                    .eq("lot_id", lotId)
                    .eq("status", "active")
                    .or(`and(start_time.lte.${endTime.toISOString()},end_time.gte.${startTime.toISOString()})`)
            ])

            if (lotResult.error) throw new Error(`Lot fetching error, ${lotResult.error.message}`);
            if (reservationsResult.error) throw new Error(`Reservations fetching error, ${reservationsResult.error.message}`);
            if (!lotResult.data) throw new Error("Lot not found");

            const totalSpots = lotResult.data.total_spots;
            const occupiedSpots = reservationsResult.data?.length || 0;

            return totalSpots - occupiedSpots;
        })()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}

export async function cancelReservation(reservationId: string): Promise<ReservationInterface> {
    try {
        if (!reservationId) throw new Error("Reservation id is required");

        const request = (async () => {
            const currentReservation = await getReservationById(reservationId);

            if (!currentReservation) throw new Error("Reservation not found");

            if (
                currentReservation.status !== "pending" &&
                currentReservation.status !== "active"
            ) throw new Error("Only pending or active reservations can be cancelled");
            
            const { data, error } = await supabase.from("reservations")
                .update({ status: "cancelled" })
                .eq("id", reservationId)
                .select()
                .single();

            if (error) throw new Error(`Reservation cancellation error, ${error.message}`);

            return normalizeData(data) as ReservationInterface;
        })()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}