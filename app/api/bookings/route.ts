import { NextResponse } from 'next/server';
import connectToDatabase from '../../lib/mongodb';
import BookingModel from '../../lib/bookingModel';

export const runtime = 'nodejs';

export async function GET() {
  try {
    await connectToDatabase();
    const bookings = await BookingModel.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ bookings });
  } catch (e) {
    console.error('DB bookings GET error', e);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Booking create request body:', body);
    await connectToDatabase();
    const doc = await BookingModel.create({
      packageSlug: body.packageSlug || body.slug || body.package || '',
      name: body.name,
      email: body.email,
      phone: body.mobile || body.phone || '',
      guests: body.travelers || body.guests || 1,
      startDate: body.travelDate || body.startDate,
      notes: body.notes,
      status: body.status || 'pending',
    });
    return NextResponse.json({ ok: true, booking: doc });
  } catch (e) {
    console.error('Booking create DB error', e);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
