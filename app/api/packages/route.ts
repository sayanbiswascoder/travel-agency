import { NextResponse } from 'next/server';
import connectToDatabase from '../../lib/mongodb';
import PackageModel from '../../lib/packageModel';

export const runtime = 'nodejs';

export async function GET() {
  try {
    await connectToDatabase();
    const pkgs = await PackageModel.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ packages: pkgs });
  } catch (e) {
    console.error('Public packages GET error', e);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
