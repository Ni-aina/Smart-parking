import { webBaseUrl } from "@/config";

export async function createPaymentIntent(
    userId: string,
    reservationId: string,
    amount: number,
    currency: string = "usd"
) {
  const res = await fetch(
    `${webBaseUrl}/api/payments/create-intent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount,
        userId,
        reservationId,
        currency
      })
    }
  )

  return res.json()
}

