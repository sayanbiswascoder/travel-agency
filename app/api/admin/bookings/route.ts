import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import connectToDatabase from '../../../lib/mongodb';
import BookingModel from '../../../lib/bookingModel';

export const runtime = 'nodejs';

const SESS_DIR = path.join(process.cwd(), 'tmp', 'admin-sessions');

function isAuthenticated(request: Request) {
  try {
    const token = request.headers.get('x-admin-token') || '';
    if (!token) return false;
    const file = path.join(SESS_DIR, `${token}.json`);
    return fs.existsSync(file);
  } catch (e) {
    return false;
  }
}

export async function GET(request: Request) {
  if (!isAuthenticated(request)) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    await connectToDatabase();
    const bookings = await BookingModel.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ bookings });
  } catch (e) {
    console.error('Admin bookings DB GET error', e);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!isAuthenticated(request)) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try {
    const body = await request.json();
    if (!body || (!body.id && !body._id)) return NextResponse.json({ message: 'Missing id' }, { status: 400 });

    await connectToDatabase();
    const id = body._id || body.id;
    const allowed: any = {};
    ['status', 'notes'].forEach((k) => {
      if (Object.prototype.hasOwnProperty.call(body, k)) allowed[k] = body[k];
    });
    const updated = await BookingModel.findByIdAndUpdate(id, { $set: allowed }, { new: true }).lean();
    if (!updated) return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    return NextResponse.json({ ok: true, booking: updated });
  } catch (e) {
    console.error('Admin bookings PUT error', e);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
