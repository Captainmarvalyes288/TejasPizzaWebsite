
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Order } from "@/models/Order";
import mongoose from "mongoose";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { cartProducts, paymentId, orderId } = body;

    mongoose.connect(process.env.MONGO_URL);

    const newOrder = await Order.create({
      userEmail: session.user.email,
      cartProducts,
      paid: true,
      paymentId,
      orderId,
    });

    return NextResponse.json({ success: true, order: newOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ success: false, message: 'Failed to create order' }, { status: 500 });
  }
}
