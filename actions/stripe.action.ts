import { webBaseUrl } from "@/config";
import { getReservationById } from "./reservation.action";

export async function createPaymentIntent(
  userId: string,
  reservationId: string,
  amount: number,
  currency: string = "usd"
) {
  try {
    const reservation = await getReservationById(reservationId);
    if (!reservation) throw new Error("Reservation not found");

    const now = new Date();
    const reservationEndDate = new Date(reservation.endTime);
    const diffTime = reservationEndDate.getTime() - now.getTime();

    if (diffTime < 0) throw new Error("Reservation has already ended");

    const res = await fetch(
      `${webBaseUrl}/api/payments/create-intent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amount,
          userId,
          reservationId,
          currency
        })
      }
    )

    return res.json()
  } catch (error) {
    throw error;
  }
}

