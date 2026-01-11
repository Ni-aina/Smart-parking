import { supabase } from "@/lib/supabase";
import { LotInterface } from "@/types/lot";
import { normalizeData } from "@/utils/normalizeData";
import { rejectTimeout } from "@/utils/rejectTimeout";

export async function getParkingById(parkingId: string): Promise<LotInterface | null> {
    try {
        const request = (async () => {
            const { data: parking, error } = await supabase.from("parking_lots")
                .select(`
                    id, 
                    name, 
                    location,
                    location_lat, 
                    location_lng, 
                    created_at, 
                    total_spots, 
                    occupied_spots,
                    price_per_hour, 
                    url_images, 
                    lotType: type_id(
                    id, 
                    vehicle_type, 
                    description,
                    max_width, 
                    max_length, 
                    max_height
                    )
                `)
                .eq("id", parkingId)
                .single();

            if (!parking || error) throw new Error(`The parking cannot be find, ${error?.message}`);
            const normalized = normalizeData(parking);
            return normalized as LotInterface;
        })()
        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }

}

export async function getParkingLots(
params: {
    searchTerm?: string;
    filters?: {
        type?: string;
        priceRange?: [number, number];
    }
    location?: {
        latitude: number | null;
        longitude: number | null;
    }
    pagination?: {
        page: number;
        limit: number;
    }
} = {}): Promise<LotInterface[]> {
    try {

        const {
            searchTerm = "",
            filters = {},
            location = {
                latitude: null,
                longitude: null
            },
            pagination = {
                page: 1,
                limit: 20
            }
        } = params;

        const request = (async () => {

            const { data: parkings, error } = await supabase.rpc(
                "get_parking_lots_advanced",
                {
                    search_term: searchTerm,
                    type_filter: filters.type ?? null,
                    min_price: filters.priceRange?.[0] ?? 0,
                    max_price: filters.priceRange?.[1] ?? 10000,
                    user_lat: location?.latitude ?? null,
                    user_lng: location?.longitude ?? null,
                    page: pagination.page,
                    limit_count: pagination.limit
                }
            )

            if (!parkings || error) throw new Error(`An error occured during fetching parkings, ${error?.message}`);
            const normalized = parkings.map((item: any) => normalizeData(item));
            return normalized as LotInterface[];
        })()
        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}