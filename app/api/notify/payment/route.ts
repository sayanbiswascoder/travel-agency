import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectToDatabase from '../../../lib/mongodb';
import BookingModel from '../../../lib/bookingModel';
import { sendBookingInvoiceEmail } from '@/app/utils/email';
import { createInvoicePdf, type BookingInvoice } from '@/app/utils/invoice';

type PaymentNotificationPayload = {
  // Payment verification fields
  razorpay_payment_id?: unknown;
  razorpay_order_id?: unknown;
  razorpay_signature?: unknown;
  // Booking/customer fields
  email?: unknown;
  firstName?: unknown;
  lastName?: unknown;
  mobile?: unknown;
  packageName?: unknown;
  amount?: unknown;
  travelers?: unknown;
  travelDate?: unknown;

  // Session actions
  action?: unknown;
  sessionId?: unknown;
  // For session creation
  slug?: unknown;
  title?: unknown;
};

// DB-backed session storage using bookings collection
async function createBookingSession(data: Record<string, any>) {
  await connectToDatabase();
  const doc = await BookingModel.create({
    packageSlug: data.slug || '',
    packageTitle: data.title || data.packageName || '',
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    name: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
    email: data.email || '',
    phone: data.mobile || '',
    guests: typeof data.travelers === 'number' ? data.travelers : Number(data.travelers || 1),
    startDate: data.travelDate || '',
    totalCost: typeof data.totalCost === 'number' ? data.totalCost : Number(data.totalCost || 0),
    status: 'payment_pending',
  });
  return doc;
}

async function readBookingSession(id: string) {
  await connectToDatabase();
  try {
    const doc = await BookingModel.findById(id).lean();
    return doc || null;
  } catch (e) {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PaymentNotificationPayload;

    // If the client is creating a server-side session for payment details
    if (body.action === 'create_session') {
      const sessionData = {
        slug: typeof body.slug === 'string' ? body.slug : '',
        title: typeof body.title === 'string' ? body.title : (typeof body.packageName === 'string' ? body.packageName : ''),
        totalCost: typeof body.amount === 'number' ? body.amount : Number(body.amount || 0),
        email: typeof body.email === 'string' ? body.email : '',
        firstName: typeof body.firstName === 'string' ? body.firstName : '',
        lastName: typeof body.lastName === 'string' ? body.lastName : '',
        mobile: typeof body.mobile === 'string' ? body.mobile : '',
        travelers: typeof body.travelers === 'string' || typeof body.travelers === 'number' ? body.travelers : '',
        travelDate: typeof body.travelDate === 'string' ? body.travelDate : '',
        createdAt: new Date().toISOString(),
      };

      // Persist session data into bookings collection and return booking id as sessionId
      const doc = await createBookingSession({
        slug: sessionData.slug,
        title: sessionData.title,
        totalCost: sessionData.totalCost,
        email: sessionData.email,
        firstName: sessionData.firstName,
        lastName: sessionData.lastName,
        mobile: sessionData.mobile,
        travelers: sessionData.travelers,
        travelDate: sessionData.travelDate,
      });

      return NextResponse.json({ sessionId: doc._id.toString() });
    }

    // If the client is fetching a previously created session
    if (body.action === 'fetch_session') {
      if (typeof body.sessionId !== 'string' || !body.sessionId) {
        return NextResponse.json({ message: 'Missing sessionId' }, { status: 400 });
      }

      const sessionDoc = await readBookingSession(body.sessionId);
      if (!sessionDoc) {
        return NextResponse.json({ message: 'Session not found' }, { status: 404 });
      }

      const session = {
        slug: sessionDoc.packageSlug || '',
        title: sessionDoc.packageTitle || sessionDoc.name || '',
        totalCost: sessionDoc.totalCost || 0,
        email: sessionDoc.email || '',
        firstName: sessionDoc.firstName || '',
        lastName: sessionDoc.lastName || '',
        mobile: sessionDoc.phone || '',
        travelers: sessionDoc.guests ? String(sessionDoc.guests) : '1',
        travelDate: sessionDoc.startDate || '',
      };

      return NextResponse.json({ session });
    }

    // Otherwise treat this as the existing payment notification flow
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      email,
      firstName,
      lastName,
      mobile,
      packageName,
      amount,
      travelers,
      travelDate,
    } = body;

    if (
      typeof razorpay_payment_id !== 'string' ||
      typeof razorpay_order_id !== 'string' ||
      typeof razorpay_signature !== 'string'
    ) {
      return NextResponse.json({ message: 'Missing payment verification fields.' }, { status: 400 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json({ message: 'Razorpay secret not configured on server.' }, { status: 500 });
    }

    const hmac = crypto.createHmac('sha256', keySecret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const expectedSignature = hmac.digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
    }

    const paidAmount = Number(amount || 0) / 100;
    const customerName = `${typeof firstName === 'string' ? firstName : ''} ${typeof lastName === 'string' ? lastName : ''}`.trim() || 'Customer';
    const invoiceId = razorpay_order_id;

    const invoice: BookingInvoice = {
      invoiceId,
      paymentId: razorpay_payment_id,
      customerName,
      email: typeof email === 'string' && email ? email : undefined,
      mobile: typeof mobile === 'string' && mobile ? mobile : undefined,
      packageName: typeof packageName === 'string' && packageName ? packageName : undefined,
      amountPaid: paidAmount,
      travelers: typeof travelers === 'string' || typeof travelers === 'number' ? travelers : undefined,
      travelDate: typeof travelDate === 'string' && travelDate ? travelDate : undefined,
      issuedAt: new Date(),
    };

    const invoicePdf = createInvoicePdf(invoice);
    let emailResult: Awaited<ReturnType<typeof sendBookingInvoiceEmail>> = { sent: false, skipped: false };

    try {
      emailResult = await sendBookingInvoiceEmail(invoice, invoicePdf);
    } catch (error) {
      emailResult = {
        sent: false,
        skipped: false,
        message: error instanceof Error ? error.message : 'Unable to send invoice email.',
      };
      console.error('Payment verified, but invoice email failed:', error);
    }

    return NextResponse.json({
      success: true,
      email: emailResult,
      invoice: {
        filename: invoicePdf.filename,
        contentType: invoicePdf.contentType,
        base64: invoicePdf.base64,
      },
    });
  } catch (error) {
    console.error('Error processing payment notification:', error);
    const message = error instanceof Error ? error.message : 'Failed to process payment notification.';
    return NextResponse.json({ message }, { status: 500 });
  }
}

