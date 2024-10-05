import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Note from '@/models/Note'

export async function POST(request: Request) {
  const { missionId, note } = await request.json()
  await dbConnect()
  const newNote = await Note.create({ missionId, note })
  return NextResponse.json(newNote, { status: 201 })
}