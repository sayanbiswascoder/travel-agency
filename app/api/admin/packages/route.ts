import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import connectToDatabase from '../../../lib/mongodb';
import PackageModel from '../../../lib/packageModel';

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
  try {
    console.log('Admin packages GET: using MongoDB');
    await connectToDatabase();
    const pkgs = await PackageModel.find().sort({ createdAt: -1 }).lean();
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

      await connectToDatabase();
      const allowedFields = ['title', 'price', 'summary', 'description', 'badge', 'image', 'duration', 'rating', 'features', 'itinerary'];
      const update: any = {};
      allowedFields.forEach((k) => {
        if (Object.prototype.hasOwnProperty.call(body, k)) update[k] = body[k];
      });

      const updated = await PackageModel.findOneAndUpdate({ slug: body.slug }, { $set: update }, { new: true, upsert: false }).lean();
      if (!updated) return NextResponse.json({ message: 'Package not found' }, { status: 404 });
      return NextResponse.json({ ok: true, package: updated });
  } catch (e) {
    console.error('Admin package update error', e);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
