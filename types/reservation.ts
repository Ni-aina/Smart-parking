import { StatusType } from "./global";
import { LotInterface } from "./lot";
import { ProfileInterface } from "./profile";
import { VehicleInterface } from "./vehicle";

export interface ReservationPostInterface {
    driverId: string;
    lotId: string;
    vehicleId: string;
    startTime: string;
    endTime: string;
    status: StatusType;
}

export interface ReservationInterface {
    id: string;
    driver: ProfileInterface;
    lot: LotInterface;
    vehicle: VehicleInterface;
    startTime: string;
    endTime: string;
    status: StatusType;
    createdAt: string;
}