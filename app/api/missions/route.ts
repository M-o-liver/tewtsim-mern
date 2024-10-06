import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Mission from '@/models/Mission';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  await dbConnect();
  
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Mission ID is required' }, { status: 400 });
  }

  try {
    const mission = await Mission.findById(id);
    if (!mission) {
      return NextResponse.json({ error: 'Mission not found' }, { status: 404 });
    }
    return NextResponse.json(mission);
  } catch (error) {
    console.error('Error fetching mission:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}