import { NextResponse } from 'next/server';
import prisma from '@/lib/prsima';

export async function GET() {
  try {
    const goals = await prisma.goal.findMany();
    return NextResponse.json(goals);
  } catch (error) {
    console.error("Error fetching goals:", error);  // Log the error for debugging
    return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 });
  }
}
