// app/api/auth/verify-otp/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prsima';

export async function POST(req: Request) {
  const body = await req.json();
  const { email, otp } = body;

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

    // Proceed with user registration or login logic here

    return NextResponse.json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 });
  }
}
