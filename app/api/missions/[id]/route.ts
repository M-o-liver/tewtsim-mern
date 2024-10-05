import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Mission from '@/models/Mission'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  await dbConnect()
  const mission = await Mission.findById(params.id)
  if (!mission) {
    return NextResponse.json({ error: 'Mission not found' }, { status: 404 })
  }
  return NextResponse.json(mission)
}