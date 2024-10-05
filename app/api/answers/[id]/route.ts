import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Answer from '@/models/Answer'
import Question from '@/models/Question'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  await dbConnect()
  const answers = await Answer.find({ missionId: params.id }).populate('questionId')
  
  const formattedAnswers = await Promise.all(answers.map(async (answer) => {
    const question = await Question.findById(answer.questionId)
    return {
      questionId: answer.questionId,
      userAnswer: answer.answer,
      correctAnswer: question.correctAnswer,
    }
  }))

  return NextResponse.json(formattedAnswers)
}