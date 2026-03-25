export interface VehicleMaintenanceInterface {
    id?: string;
    vehicleId: string;
    maintenanceType: string;
    performedDate: string;
    dueDate?: string;
    notes?: string;
    createdAt?: string;
}

export type MaintenanceType = 
    | 'oil_change'
    | 'tire_rotation'
    | 'brake_inspection'
    | 'battery_check'
    | 'engine_service'
    | 'transmission_service'
    | 'air_filter'
    | 'coolant_flush'
    | 'general_inspection'
    | 'other';
