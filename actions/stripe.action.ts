import { webBaseUrl } from "@/config";
import { supabase } from "@/lib/supabase";
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

    const {
      lot: { owner: { customerId } }
    } = reservation;

    if (!customerId) throw new Error("Lot owner does not have a Stripe customer ID");

    const now = new Date();
    const reservationEndDate = new Date(reservation.endTime);
    const diffTime = reservationEndDate.getTime() - now.getTime();

    if (diffTime < 0) throw new Error("Reservation has already ended");

    const { data: session } = await supabase.auth.getSession();
    const accessToken = session?.session?.access_token;
    if (!accessToken) throw new Error("User is not authenticated");

    const res = await fetch(
      `${webBaseUrl}/api/protected/payments/create-intent`,
      {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          amount: amount,
          userId,
          reservationId,
          customerId,
          currency
        })
      }
    )

    return res.json();
  } catch (error) {
    throw error;
  }
}

