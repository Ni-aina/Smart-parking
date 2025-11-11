import { createVehicle, deleteVehicle, getVehiclesByDriverId, updateVehicle } from "@/actions/vehicle.action";
import { VehicleInterface } from "@/types/vehicle";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import useCurrentProfile from "./useCurrentProfile";

const useVehicles = () => {
    const { currentProfile } = useCurrentProfile();
    const profileId = currentProfile?.id || "";

    const queryClient = useQueryClient();
    const router = useRouter();

    const {
        data: vehicles,
        isLoading,
        error: errorFetching,
        refetch,
        isRefetching
    } = useQuery({
        queryKey: ["vehicles"],
        queryFn: ()=> getVehiclesByDriverId(profileId)
    })

    const {
        mutate: handleCreate,
        error: creationError,
        isPending: isCreating
    } = useMutation({
        mutationFn: (vehicle: VehicleInterface) => createVehicle(vehicle),
        onSettled: () => queryClient.invalidateQueries({
            queryKey: ["vehicles"]
        }),
        onSuccess: () => router.canGoBack() && router.back()
    })

     const {
        mutate: handleUpdate,
        error: updateError,
        isPending: isUpdating
    } = useMutation({
        mutationFn: (vehicle: VehicleInterface) => updateVehicle(vehicle),
        onSettled: () => queryClient.invalidateQueries({
            queryKey: ["vehicles"]
        }),
        onSuccess: () => router.canGoBack() && router.back()
    })

    const {
        mutate: handleDelete,
        isPending: isDeleting
    } = useMutation({
        mutationFn: (id: string)=> deleteVehicle(id),
        onSettled: ()=> queryClient.invalidateQueries({
            queryKey: ["vehicles"]
        })
    })

    return {
        handleCreate,
        creationError,
        isCreating,
        handleUpdate,
        updateError,
        isUpdating,
        handleDelete,
        isDeleting,
        vehicles,
        errorFetching,
        isLoading,
        refetch,
        isRefetching
    }
}

export default useVehicles;