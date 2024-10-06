import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  await dbConnect();

  const { username, password } = await req.json();

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ username, password: hashedPassword });
    return NextResponse.json({ message: 'User created', userId: user._id }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if ('code' in error && error.code === 11000) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 });
      }
      console.error('Error creating user:', error);
      return NextResponse.json({ error: 'An error occurred while creating the user' }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}