import { db } from "@/server";
import { orders } from "@/server/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2025-04-30.basil",
  });

  const sig = req.headers.get("stripe-signature") || "";
  const signingSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

  // Read the request body as text
  const reqText = await req.text();
  // Convert the text to a buffer
  const reqBuffer = Buffer.from(reqText);

  let event;
  try {
    event = stripe.webhooks.constructEvent(reqBuffer, sig, signingSecret);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    // On error, log and return the error message.
    if (!(err instanceof Error)) console.log(err);
    console.log(`❌ Error message: ${errorMessage}`);
    return NextResponse.json(
      { message: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    );
  }

  const permittedEvents = [
    "payment_intent.succeeded",
    "charge.succeeded",
    "payment_intent.payment_failed",
  ];

  if (!permittedEvents.includes(event.type)) {
    console.log(`Unhandled event type ${event.type}`);
    return NextResponse.json(
      { message: `Unhandled event type ${event.type}` },
      { status: 400 }
    );
  }

  switch (event.type) {
    case "payment_intent.succeeded":
      //get paymentIntentID
      const retrieveOrder = await stripe.paymentIntents.retrieve(
        event.data.object.id,
        {
          expand: ["latest_charge"],
        }
      );
      const charge = retrieveOrder.latest_charge as Stripe.Charge;
      //save into db

      const updated = await db
        .update(orders)
        .set({
          status: "succeeded",
          receiptURL: charge.receipt_url,
        })
        .where(eq(orders.paymentIntentID, event.data.object.id))
        .returning();

      break;

    case "charge.succeeded":
      // No-op: we handle everything via payment_intent.succeeded
      console.log("🔔 charge.succeeded received but ignored.");
      break;

    default:
      throw new Error(`Unhandled event: ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event.
  return NextResponse.json({ message: "Received" }, { status: 200 });
}
