import { supabase } from "@/lib/supabase";
import { VehicleInterface } from "@/types/vehicle";
import { isUUID } from "@/utils/isUUID";
import { normalizeData } from "@/utils/normalizeData";
import { rejectTimeout } from "@/utils/rejectTimeout";

export async function createVehicle(vehicle: VehicleInterface): Promise<VehicleInterface | null> {
    try {
        const request = (async () => {
            const {
                driverId: driver_id,
                plateNumber: plate_number,
                make,
                model,
                year,
                width,
                length,
                height,
            } = vehicle;

            if (!driver_id) throw new Error("You must be authenticated");

            const { data: newVehicle, error } = await supabase.from("vehicles")
                .insert([{
                    driver_id,
                    plate_number,
                    make,
                    model,
                    year,
                    width,
                    length,
                    height
                }])
                .select()
                .single()

            if (!newVehicle || error) throw new Error(`An error occured during vechile creation, ${error?.message}`);

            const normalized = normalizeData(newVehicle);
            return normalized as VehicleInterface;
        })()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}


export async function updateVehicle(vehicle: VehicleInterface): Promise<VehicleInterface | null> {
    try {
        const request = (async () => {
            const {
                id,
                plateNumber: plate_number,
                make,
                model,
                year,
                width,
                length,
                height,
            } = vehicle;

            if (!id) return null;

            const { data: updatedVehicle, error } = await supabase.from("vehicles")
                .update({
                    plate_number,
                    make,
                    model,
                    year,
                    width,
                    length,
                    height
                })
                .eq("id", id)
                .select()
                .single()

            if (!updatedVehicle || error) throw new Error(`An error occured during vehicle edition, ${error?.message}`);

            const normalized = normalizeData(updatedVehicle);
            return normalized as VehicleInterface;
        })()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}

export async function deleteVehicle(id: string): Promise<boolean> {
    try {
        const request = (async () => {
            const { error } = await supabase.from("vehicles")
                .delete()
                .eq("id", id)

            if (error) throw new Error(`An error occured during vehicle deletion, ${error?.message}`);
            return true;
        })()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}

export async function getVehiclesByDriverId(driverId: string): Promise<VehicleInterface[]> {
    if (!isUUID(driverId)) throw new Error("You have to be authenticated");

    try {
        const request = (async () => {
            const { data: vehicles, error } = await supabase.from("vehicles")
                .select("*")
                .eq("driver_id", driverId)
                .order("created_at", {
                    ascending: false
                })

            if (!vehicles || error) throw new Error(`Fetching vehicles raise an error, ${error?.message}`);

            const normalized = vehicles.map(item => normalizeData(item));
            return normalized as VehicleInterface[];
        })()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}