import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'password123';
const SESS_DIR = path.join(process.cwd(), 'tmp', 'admin-sessions');

function writeAdminSession(token: string, data: any) {
  if (!fs.existsSync(SESS_DIR)) fs.mkdirSync(SESS_DIR, { recursive: true });
  fs.writeFileSync(path.join(SESS_DIR, `${token}.json`), JSON.stringify(data, null, 2), 'utf-8');
}

function readAdminSession(token: string) {
  const file = path.join(SESS_DIR, `${token}.json`);
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch (e) {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body.email;
    const password = body.password;

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = crypto.randomUUID();
    const now = new Date().toISOString();
    const session = { email: ADMIN_EMAIL, createdAt: now };

    writeAdminSession(token, session);

    return NextResponse.json({ token, email: ADMIN_EMAIL });
  } catch (e) {
    console.error('Admin login error', e);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');
    if (!token) return NextResponse.json({ message: 'Missing token' }, { status: 400 });
    const session = readAdminSession(token);
    if (!session) return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    return NextResponse.json({ ok: true, session });
  } catch (e) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
