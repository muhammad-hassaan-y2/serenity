import { NextResponse } from 'next/server';
import prisma from '@/lib/prsima';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, name } = body;

  // Check if the user already exists in the User table
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }

  // Generate OTP
  const otp = crypto.randomInt(100000, 999999).toString();

  // Upsert OTP: Update if it exists, create if it doesn't
  try {
    console.log("Upserting OTP...");
    await prisma.oTP.upsert({
      where: { email },
      update: {
        otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // OTP expires in 10 minutes
      },
      create: {
        email,
        otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // OTP expires in 10 minutes
      },
    });
    console.log("OTP upserted successfully");
  } catch (error) {
    console.error("Error upserting OTP:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  // Send OTP to the user's email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false, // Bypass SSL issues
    },
  });

  try {
    console.log("Sending email...");
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for Sign Up',
      text: `Your OTP code is: ${otp}`,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: "Email sending failed" }, { status: 500 });
  }

  return NextResponse.json({ message: 'OTP sent to your email' });
}
