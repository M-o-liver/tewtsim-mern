import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Mission from '@/models/Mission'

export async function GET() {
  await dbConnect()
  const missions = await Mission.find({})
  return NextResponse.json(missions)
}