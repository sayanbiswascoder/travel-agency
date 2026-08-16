import { NextResponse } from 'next/server';
import { getPackages as loadPkgs, savePackages as persistPkgs } from '../../../lib/package-store2';
import fs from 'fs';
import path from 'path';

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
  try {
    const pkgs = loadPkgs();
    return NextResponse.json({ packages: pkgs });
  } catch (e) {
    console.error('Admin packages GET error', e);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!isAuthenticated(request)) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    if (!body || !body.slug) return NextResponse.json({ message: 'Missing slug' }, { status: 400 });

    const pkgs = loadPkgs();
    const idx = pkgs.findIndex((p: any) => p.slug === body.slug);
    if (idx === -1) return NextResponse.json({ message: 'Package not found' }, { status: 404 });

    // Apply allowed updates
    const allowed = ['title', 'price', 'summary', 'description', 'badge', 'image', 'duration', 'rating'];
    allowed.forEach((k) => {
      if (Object.prototype.hasOwnProperty.call(body, k)) (pkgs[idx] as any)[k] = body[k];
    });

    const ok = persistPkgs(pkgs);
    if (!ok) return NextResponse.json({ message: 'Failed to save' }, { status: 500 });

    return NextResponse.json({ ok: true, package: pkgs[idx] });
  } catch (e) {
    console.error('Admin package update error', e);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
