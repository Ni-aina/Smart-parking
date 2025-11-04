import { createVehicle, getVehicles } from "@/actions/vehicle.action";
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
        queryFn: ()=> getVehicles(profileId)
    })

    const {
        mutate,
        error,
        isPending
    } = useMutation({
        mutationFn: (vehicle: VehicleInterface) => createVehicle(vehicle),
        onSettled: () => queryClient.invalidateQueries({
            queryKey: ["vehicles"]
        }),
        onSuccess: () => router.canGoBack() && router.back()
    })

    return {
        mutate,
        error,
        isPending,
        vehicles,
        errorFetching,
        isLoading,
        refetch,
        isRefetching
    }
}

export default useVehicles;