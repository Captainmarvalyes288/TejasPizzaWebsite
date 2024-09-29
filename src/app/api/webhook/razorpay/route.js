import getRawBody from 'raw-body';
import crypto from 'crypto';
import Razorpay from 'razorpay';

export const config = {
  api: {
    bodyParser: false, 
  },
};

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req, res) {
  try {
    // Parse the raw body from the request stream
    const rawBody = await getRawBody(req);
    const signature = req.headers['x-razorpay-signature'];

    // Verify the signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      throw new Error('Invalid signature');
    }

    const event = JSON.parse(rawBody.toString());

    if (event.event === 'payment.captured') {
      const orderId = event?.payload?.payment?.entity?.notes?.orderId;
      const isPaid = event?.payload?.payment?.entity?.status === 'captured';

      if (isPaid && orderId) {
        await Order.updateOne({ _id: orderId }, { paid: true });
      }
    }

    res.status(200).json({ status: 'ok', received: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}



// import { Order } from "@/models/Order";
// import Razorpay from "razorpay";
// import crypto from "crypto";

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET
// });

// export async function POST(req) {
//   const rawBody = await req.text();
//   const signature = req.headers.get('x-razorpay-signature');


//   try {
//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
//       .update(rawBody)
//       .digest("hex");

//     if (expectedSignature !== signature) {
//       throw new Error('Invalid signature');
//     }

//     const event = JSON.parse(rawBody);

//     if (event.event === 'payment.captured') {
//       console.log(event);
//       const orderId = event?.payload?.payment?.entity?.notes?.orderId;
//       const isPaid = event?.payload?.payment?.entity?.status === 'captured';

//       if (isPaid && orderId) {
//         await Order.updateOne({ _id: orderId }, { paid: true });
//         console.log(`Order ${orderId} marked as paid`);
//       }
//     }

//     return Response.json({ received: true }, { status: 200 });
//   } catch (err) {
//     console.error('Razorpay webhook error:', err);
//     return Response.json({ error: err.message }, { status: 400 });
//   }
// }



// import {Order} from "@/models/Order";

// const stripe = require('stripe')(process.env.STRIPE_SK);

// export async function POST(req) {
//   const sig = req.headers.get('stripe-signature');
//   let event;

//   try {
//     const reqBuffer = await req.text();
//     const signSecret = process.env.STRIPE_SIGN_SECRET;
//     event = stripe.webhooks.constructEvent(reqBuffer, sig, signSecret);
//   } catch (e) {
//     console.error('stripe error');
//     console.log(e);
//     return Response.json(e, {status: 400});
//   }

//   if (event.type === 'checkout.session.completed') {
//     console.log(event);
//     const orderId = event?.data?.object?.metadata?.orderId;
//     const isPaid = event?.data?.object?.payment_status === 'paid';
//     if (isPaid) {
//       await Order.updateOne({_id:orderId}, {paid:true});
//     }
//   }

//   return Response.json('ok', {status: 200});
// }