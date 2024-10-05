import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Answer from '@/models/Answer'

export async function POST(request: Request) {
  const { missionId, answers } = await request.json()
  await dbConnect()
  const savedAnswers = await Promise.all(
    Object.entries(answers).map(([questionId, answer]) =>
      Answer.create({ missionId, questionId, answer })
    )
  )
  return NextResponse.json(savedAnswers, { status: 201 })
}