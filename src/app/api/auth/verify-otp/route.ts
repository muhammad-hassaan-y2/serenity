// app/api/auth/verify-otp/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prsima';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  const body = await req.json();
  const { email, otp, password } = body;

  try {
    // Find the OTP entry by email
    const storedOtp = await prisma.oTP.findUnique({
      where: { email },
    });

    if (!storedOtp) {
      return NextResponse.json({ error: 'OTP not found' }, { status: 400 });
    }

    // Check if the OTP matches and is still valid
    if (storedOtp.otp !== otp || new Date() > storedOtp.expiresAt) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
    }

    // After OTP verification, create the user in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'STUDENT', // Default to 'STUDENT' role
      },
    });

    return NextResponse.json({ message: 'OTP verified and user created successfully', user: newUser });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 });
  }
}
