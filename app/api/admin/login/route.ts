import { NextResponse } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import connectToDatabase from '../../../lib/mongodb';
import AdminModel from '../../../lib/adminModel';

export const runtime = 'nodejs';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default_fallback_secret_must_be_32_bytes_long'
);

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password required' }, { status: 400 });
    }

    await connectToDatabase();

    // 1. Fetch user by lowercase email
    const admin = await AdminModel.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // 2. Perform secure time-constant password verification
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // 3. Issue signed JWT session token
    const token = await new SignJWT({ sub: admin._id.toString(), email: admin.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('8h')
      .sign(JWT_SECRET);

    return NextResponse.json({ token, email: admin.email });
  } catch (e) {
    console.error('Admin login error', e);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return NextResponse.json({ message: 'Missing token' }, { status: 400 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    return NextResponse.json({ ok: true, session: payload });
  } catch (e) {
    return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
  }
}