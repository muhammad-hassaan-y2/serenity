
import { NextResponse } from 'next/server';
import prisma from '@/lib/prsima';

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Goal ID is required' }, { status: 400 });
    }

    const deletedGoal = await prisma.goal.delete({
      where: { id },
    });

    return NextResponse.json(deletedGoal);
  } catch (error) {
    console.error('Failed to delete goal:', error);
    return NextResponse.json({ error: 'Failed to delete goal', details: error.message }, { status: 500 });
  }
}
