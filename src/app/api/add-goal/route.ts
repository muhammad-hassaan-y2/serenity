import { NextResponse } from 'next/server';
import prisma from '@/lib/prsima';

export async function POST(request: Request) {
  const goalData = await request.json();

  // Convert dueDate to ISO format if it's just a date string
  if (goalData.dueDate) {
    goalData.dueDate = new Date(goalData.dueDate).toISOString();
  }

  try {
    const newGoal = await prisma.goal.create({ data: goalData });
    return NextResponse.json(newGoal);
  } catch (error) {
    console.error("Failed to add goal:", error); // Add error logging
    return NextResponse.json({ error: 'Failed to add goal', details: error.message }, { status: 500 });
  }
}
