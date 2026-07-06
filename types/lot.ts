import { ProfileInterface } from "./profile";

export interface lotTypeInterface {
    id: string;
    vehicleType: string;
    description: string;
    maxWidth: number;
    maxLength: number;
    maxHeight: number;
}

export interface LotInterface {
    id: string;
    ownerId: string;
    owner: ProfileInterface;
    lotType:lotTypeInterface;
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
    distanceM?: number;
    rating?: number;
}

export interface LotStateInterface {
    id: string;
    lotArea: string;
    lotAddress: string;
    maxWidth: number;
    maxHeight: number;
    maxLength: number;
    vehicleId: string;
    vehicleNumber: string;
    pricePerHour: number;
    startTime: Date;
    endTime: Date;
    durationHours: string;
}

export interface DistanceTimeInterface {
    distanceKm: number;
    timeHours: number;
    timeMinutes: number;
    formatted: string;
}