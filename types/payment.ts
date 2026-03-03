export interface PaymentInterface {
    id: string;
    reservation: {
        id: string;
        lot: {
            id: string;
            ownerId: string;
            name: string;
            location: string;
            pricePerHour: number;
        }
        vehicle: {
            id: string;
            make: string;
            model: string;
            plateNumber: string;
        }
        startTime: string;
        endTime: string;
    }
    amount: number;
    method: string;
    status: string;
    transactionId: string;
    hasScanned: boolean;
    createdAt: string;
}