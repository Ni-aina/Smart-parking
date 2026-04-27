import { StatusType } from "@/types/global";

export const getStatusColor = (status: StatusType) => {
    switch (status.toLowerCase()) {
        case 'active':
            return '#4caf50';
        case 'pending':
            return '#1976d2';
        case 'cancelled':
            return '#f44336';
        default:
            return undefined;
    }
}