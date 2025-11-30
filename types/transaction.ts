import { StatusType } from "./global";
import { ReservationInterface } from "./reservation";

export interface TransactionPostInterface {
    reservationId: string;
    amount: number;
    method: string;
    status: StatusType;
    transactionId: string;
}

export interface TransactionInterface {
    id: string;
    reservationId: ReservationInterface;
    amount: number;
    method: string;
    status: StatusType;
    transactionId: string;
    createdAt: string;
}