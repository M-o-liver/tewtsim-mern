import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Result from '@/models/Result'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  await dbConnect()
  const result = await Result.findOne({ missionId: params.id })
  if (!result) {
    return NextResponse.json({ error: 'Result not found' }, { status: 404 })
  }
  return NextResponse.json(result)
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { story, finalSummary } = await request.json()
  await dbConnect()
  const result = await Result.findOneAndUpdate(
    { missionId: params.id },
    { story, finalSummary },
    { new: true, upsert: true }
  )
  return NextResponse.json(result)
}