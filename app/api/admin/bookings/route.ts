import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const STORE_DIR = path.join(process.cwd(), 'tmp');
const BOOKING_FILE = path.join(STORE_DIR, 'bookings.json');
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

function readBookings() {
  try {
    if (!fs.existsSync(STORE_DIR)) fs.mkdirSync(STORE_DIR, { recursive: true });
    if (!fs.existsSync(BOOKING_FILE)) fs.writeFileSync(BOOKING_FILE, '[]', 'utf-8');
    const raw = fs.readFileSync(BOOKING_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read bookings', e);
    return [];
  }
}

export async function GET(request: Request) {
  if (!isAuthenticated(request)) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const bookings = readBookings();
  return NextResponse.json({ bookings });
}

export async function PUT(request: Request) {
  if (!isAuthenticated(request)) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try {
    const body = await request.json();
    if (!body || !body.id) return NextResponse.json({ message: 'Missing id' }, { status: 400 });
    const bookings = readBookings();
    const idx = bookings.findIndex((b: any) => b.id === body.id);
    if (idx === -1) return NextResponse.json({ message: 'Booking not found' }, { status: 404 });

    // allow status updates and other note changes
    const allowed = ['status', 'notes'];
    allowed.forEach((k) => {
      if (Object.prototype.hasOwnProperty.call(body, k)) bookings[idx][k] = body[k];
    });

    fs.writeFileSync(BOOKING_FILE, JSON.stringify(bookings, null, 2), 'utf-8');
    return NextResponse.json({ ok: true, booking: bookings[idx] });
  } catch (e) {
    console.error('Admin bookings PUT error', e);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
