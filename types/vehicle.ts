import { VehicleCategoryInterface } from "./category";

export interface VehicleInterface {
    id: string;
    driverId: string;
    plateNumber: string;
    make: string;
    model: string;
    year: string;
    category: VehicleCategoryInterface;
    createdAt: string;
}