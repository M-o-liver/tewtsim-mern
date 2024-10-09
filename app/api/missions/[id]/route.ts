import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Mission from '@/models/Mission'

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const mission = await Mission.findById(params.id);
    if (!mission) {
      return NextResponse.json({ error: 'Mission not found' }, { status: 404 });
    }
    return NextResponse.json(mission);
  } catch (error) {
    console.error('Error fetching mission:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const body = await request.json();
    const updatedMission = await Mission.findByIdAndUpdate(params.id, body, { new: true });
    if (!updatedMission) {
      return NextResponse.json({ error: 'Mission not found' }, { status: 404 });
    }
    return NextResponse.json(updatedMission);
  } catch (error) {
    console.error('Error updating mission:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}