export interface LotInterface {
    id: string;
    ownerId: string;
    lotType: {
        id: string;
        vehicle_type: string;
        description: string;
        max_width: number;
        max_length: number;
        max_height: number;
    };
    name: string;
    location: string;
    locationLat: number;
    locationLng: number;
    totalSpots: number;
    occupiedSpots: number;
    pricePerHour: number;
    agents: string[];
    urlImages: string[];
    createdAt: string;
    distance?: DistanceTimeInterface;
}

export interface DistanceTimeInterface {
    distanceKm: number;
    timeHours: number;
    timeMinutes: number;
    formatted: string;
}