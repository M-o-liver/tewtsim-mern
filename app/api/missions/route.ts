import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Mission from '@/models/Mission'

export const dynamic = 'force-dynamic';

export async function GET() {
  await dbConnect()
  const missions = await Mission.find({})
  return NextResponse.json(missions)
}