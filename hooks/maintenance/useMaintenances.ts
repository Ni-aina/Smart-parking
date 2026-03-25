import {
    createMaintenance,
    deleteMaintenance,
    getMaintenancesByVehicleId,
    updateMaintenance
} from "@/actions/maintenance.action";
import { VehicleMaintenanceInterface } from "@/types/maintenance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useMaintenances = (vehicleId: string) => {
    const queryClient = useQueryClient();

    const {
        data: maintenances = [],
        isLoading: isLoadingMaintenances
    } = useQuery({
        queryKey: ["maintenances", vehicleId],
        queryFn: () => getMaintenancesByVehicleId(vehicleId),
        enabled: !!vehicleId
    })

    const {
        mutateAsync: handleCreate,
        isPending: isCreating
    } = useMutation({
        mutationFn: (data: VehicleMaintenanceInterface) => createMaintenance(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["maintenances", vehicleId] });
        }
    })

    const {
        mutateAsync: handleUpdate,
        isPending: isUpdating
    } = useMutation({
        mutationFn: (data: VehicleMaintenanceInterface) => updateMaintenance(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["maintenances", vehicleId] });
        }
    })

    const {
        mutateAsync: handleDelete,
        isPending: isDeleting
    } = useMutation({
        mutationFn: (id: string) => deleteMaintenance(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["maintenances", vehicleId] });
        }
    })

    return {
        maintenances,
        isLoadingMaintenances,
        handleCreate,
        isCreating,
        handleUpdate,
        isUpdating,
        handleDelete,
        isDeleting
    }
}
