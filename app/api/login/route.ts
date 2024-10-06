import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  console.log('Login request received');
  try {
    console.log('Connecting to database');
    await dbConnect();
    console.log('Database connected');

    const { username, password } = await req.json();
    console.log('Searching for user');
    const user = await User.findOne({ username }).maxTimeMS(5000); // Add timeout for database query

    if (!user) {
      console.log('User not found');
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    console.log('Comparing password');
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log('Invalid password');
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    console.log('Generating token');
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    console.log('Login successful');
    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}