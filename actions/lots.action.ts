import { supabase } from "@/lib/supabase";
import { LotInterface } from "@/types/lot";
import { normalizeData } from "@/utils/normalizeData";
import { rejectTimeout } from "@/utils/rejectTimeout";

export async function getParkingById(parkingId: string): Promise<LotInterface | null> {
    try {
        const request = (async () => {
            const { data: parking, error } = await supabase.from("parking_lots")
                .select(`
                    *, 
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

export async function getParkingLots(): Promise<LotInterface[] | null> {
    try {
        const request = (async () => {
            const { data: parkings, error } = await supabase.from("parking_lots")
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
                `);

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