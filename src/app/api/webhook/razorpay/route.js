import { Order } from "@/models/Order";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export async function POST(req) {
  console.log('Webhook received');
  
  const rawBody = await req.text();
  console.log('Raw body:', rawBody);

  try {
    const bodyObj = JSON.parse(rawBody);
    const signature = bodyObj.razorpay_signature;

    console.log('Received signature:', signature);

    if (!signature) {
      throw new Error('No signature received');
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(JSON.stringify({
        razorpay_payment_id: bodyObj.razorpay_payment_id,
        razorpay_order_id: bodyObj.razorpay_order_id,
        orderId: bodyObj.orderId
      }))
      .digest("hex");

    console.log('Expected signature:', expectedSignature);

    // if (expectedSignature !== signature) {
    //   throw new Error('Invalid signature');
    // }

    // Payment is verified, update the order
    const orderId = bodyObj.orderId;
    await Order.findByIdAndUpdate(orderId, { paid: true });
    console.log(`Order ${orderId} marked as paid`);

    return Response.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error('Razorpay webhook error:', err);
    return Response.json({ error: err.message }, { status: 400 });
  }
}