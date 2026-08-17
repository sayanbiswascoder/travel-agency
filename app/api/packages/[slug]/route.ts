import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import PackageModel from '../../../lib/packageModel';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const parts = url.pathname.split('/');
    const slug = parts[parts.length - 1];
    if (!slug) return NextResponse.json({ message: 'Missing slug' }, { status: 400 });

    await connectToDatabase();
    const pkg = await PackageModel.findOne({ slug }).lean();
    if (!pkg) return NextResponse.json({ message: 'Not found' }, { status: 404 });
    return NextResponse.json({ package: pkg });
  } catch (e) {
    console.error('Public package by slug GET error', e);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
