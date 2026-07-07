import { getParkingById } from "@/actions/lots.action";
import { useLocationStore } from "@/stores/zustand/location";
import { LotInterface, lotTypeInterface } from "@/types/lot";
import { ProfileInterface } from "@/types/profile";
import { getDistanceTime } from "@/utils/getDistanceTime";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const useLot = ({ id }: { id: string }) => {
    const {
        location,
        refreshLocation
    } = useLocationStore();

    const latitude = location?.latitude;
    const longitude = location?.longitude;

    const {
        data: lot,
        isLoading,
        refetch,
        isRefetching
    } = useQuery({
        queryKey: [`lot-details-${id}`],
        queryFn: () => {
            refreshLocation();
            return getParkingById(id);
        }
    })

    const lotFormated: LotInterface = {
        id: lot?.id || "",
        owner: lot?.owner as ProfileInterface,
        lotType: lot?.lotType as lotTypeInterface,
        name: lot?.name || "",
        location: lot?.location || "",
        locationLat: lot?.locationLat || 0,
        locationLng: lot?.locationLng || 0,
        totalSpots: lot?.totalSpots || 0,
        occupiedSpots: lot?.occupiedSpots || 0,
        pricePerHour: lot?.pricePerHour || 0,
        agents: lot?.agents || [],
        urlImages: lot?.urlImages || [],
        createdAt: lot?.createdAt || "",
        distance: getDistanceTime(
            latitude,
            longitude,
            lot?.locationLat,
            lot?.locationLng
        )
    }

    useEffect(() => {
        if (isLoading) return;
        refetch();
    }, [
        isLoading,
        latitude,
        longitude,
        refetch
    ])

    return {
        lot: lotFormated,
        isLoading,
        refetch,
        isRefetching
    }
}

export default useLot;