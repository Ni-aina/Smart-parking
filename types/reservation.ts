import { StatusType } from "./global";

export interface ReservationInterface {
    id: string;
    driverId: string;
    lotId: string;
    vehicleId: string;
    startTime: string;
    endTime: string;
    status: StatusType;
    createdAt: string;
}