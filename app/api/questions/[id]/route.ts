import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Question from '@/models/Question'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  await dbConnect()
  const questions = await Question.find({ missionId: params.id })
  return NextResponse.json(questions)
}