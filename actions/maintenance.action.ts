import { supabase } from "@/lib/supabase";
import { VehicleMaintenanceInterface } from "@/types/maintenance";
import { normalizeData } from "@/utils/normalizeData";
import { rejectTimeout } from "@/utils/rejectTimeout";

export async function createMaintenance(maintenance: VehicleMaintenanceInterface): Promise<VehicleMaintenanceInterface | null> {
    try {
        const request = (async () => {
            const {
                vehicleId: vehicle_id,
                maintenanceType: maintenance_type,
                performedDate: performed_date,
                dueDate: due_date,
                notes
            } = maintenance;

            if (!vehicle_id) throw new Error("Vehicle ID is required");

            const { data: newMaintenance, error } = await supabase.from("vehicle_maintenances")
                .insert([{
                    vehicle_id,
                    maintenance_type,
                    performed_date,
                    due_date,
                    notes
                }])
                .select()
                .single()

            if (!newMaintenance || error) throw new Error(`An error occurred during maintenance creation, ${error?.message}`);

            const normalized = normalizeData(newMaintenance);
            return normalized as VehicleMaintenanceInterface;
        })()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}

export async function updateMaintenance(maintenance: VehicleMaintenanceInterface): Promise<VehicleMaintenanceInterface | null> {
    try {
        const request = (async () => {
            const {
                id,
                vehicleId: vehicle_id,
                maintenanceType: maintenance_type,
                performedDate: performed_date,
                dueDate: due_date,
                notes
            } = maintenance;

            if (!id) return null;

            const { data: updatedMaintenance, error } = await supabase.from("vehicle_maintenances")
                .update({
                    vehicle_id,
                    maintenance_type,
                    performed_date,
                    due_date,
                    notes
                })
                .eq("id", id)
                .select()
                .single()

            if (!updatedMaintenance || error) throw new Error(`An error occurred during maintenance update, ${error?.message}`);

            const normalized = normalizeData(updatedMaintenance);
            return normalized as VehicleMaintenanceInterface;
        })()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}

export async function deleteMaintenance(id: string): Promise<boolean> {
    try {
        const request = (async () => {
            const { error } = await supabase.from("vehicle_maintenances")
                .delete()
                .eq("id", id)

            if (error) throw new Error(`An error occurred during maintenance deletion, ${error?.message}`);
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

export async function getMaintenancesByVehicleId(vehicleId: string): Promise<VehicleMaintenanceInterface[]> {
    if (!vehicleId) throw new Error("Vehicle ID is required");

    try {
        const request = (async () => {
            const { data: maintenances, error } = await supabase.from("vehicle_maintenances")
                .select("*")
                .eq("vehicle_id", vehicleId)
                .order("performed_date", {
                    ascending: false
                })

            if (!maintenances || error) throw new Error(`Fetching maintenances raised an error, ${error?.message}`);

            const normalized = maintenances.map(item => normalizeData(item));
            return normalized as VehicleMaintenanceInterface[];
        })()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}
