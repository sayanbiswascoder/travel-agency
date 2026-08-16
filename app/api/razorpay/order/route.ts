import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const amount = Number(body.amount || 0);
    const currency = String(body.currency || 'INR');
    const receipt = String(body.receipt || `booking_${Date.now()}`);

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { message: 'Amount must be greater than zero.' },
        { status: 400 }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      const demoOrderId = `order_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

      return NextResponse.json({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
        orderId: demoOrderId,
        amount: Math.round(amount * 100),
        currency,
        receipt,
        demo: true,
        message: 'Using demo order ID because Razorpay credentials are not configured yet.',
      });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt,
      notes: {
        source: 'travel-agency-booking',
      },
    });

    return NextResponse.json({
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || keyId,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      demo: false,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create Razorpay order.';

    return NextResponse.json({ message }, { status: 500 });
  }
}
