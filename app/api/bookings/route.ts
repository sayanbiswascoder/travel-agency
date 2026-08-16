import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const STORE_DIR = path.join(process.cwd(), 'tmp');
const BOOKING_FILE = path.join(STORE_DIR, 'bookings.json');

function ensureStore() {
  if (!fs.existsSync(STORE_DIR)) fs.mkdirSync(STORE_DIR, { recursive: true });
  if (!fs.existsSync(BOOKING_FILE)) fs.writeFileSync(BOOKING_FILE, '[]', 'utf-8');
}

function readBookings() {
  try {
    ensureStore();
    const raw = fs.readFileSync(BOOKING_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read bookings', e);
    return [];
  }
}

function writeBookings(bookings: any[]) {
  try {
    ensureStore();
    fs.writeFileSync(BOOKING_FILE, JSON.stringify(bookings, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.error('Failed to write bookings', e);
    return false;
  }
}

export async function GET() {
  const bookings = readBookings();
  return NextResponse.json({ bookings });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const now = new Date().toISOString();
    const booking = {
      id: `${now}-${Math.random().toString(36).slice(2, 9)}`,
      createdAt: now,
      status: 'pending',
      ...body,
    };

    const bookings = readBookings();
    bookings.unshift(booking);
    writeBookings(bookings);

    return NextResponse.json({ ok: true, booking });
  } catch (e) {
    console.error('Booking create error', e);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
