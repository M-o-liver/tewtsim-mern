import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Result from '@/models/Result';

export const dynamic = 'force-dynamic';

export async function GET() {
  await dbConnect();
  const results = await Result.find({}).populate('missionId', 'title');
  return NextResponse.json(results);
}