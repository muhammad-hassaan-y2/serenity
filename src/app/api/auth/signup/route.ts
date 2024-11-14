import { NextResponse } from 'next/server';
import prisma from '@/lib/prsima';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, role } = body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user in the database
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: role || 'STUDENT', // Default to 'STUDENT' role if no role is provided
      },
    });

    return NextResponse.json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);  // Log the error for debugging purposes
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
