import { NextResponse } from 'next/server'
import prisma from '@/lib/prsima';

export async function PUT(req: Request) {
  const { topicId, subtopicId }: { topicId: string; subtopicId: string } = await req.json()

  if (!topicId || !subtopicId) {
    return NextResponse.json({ error: 'Topic ID and Subtopic ID are required' }, { status: 400 })
  }

  try {
    // Mark subtopic as completed
    await prisma.subtopic.update({
      where: { id: subtopicId },
      data: { completed: true },
    })

    // Recalculate topic progress
    const subtopics = await prisma.subtopic.findMany({
      where: { topicId },
    })
    const completedCount = subtopics.filter((st) => st.completed).length
    const newProgress = Math.round((completedCount / subtopics.length) * 100)

    await prisma.topic.update({
      where: { id: topicId },
      data: { progress: newProgress },
    })

    return NextResponse.json({ message: 'Progress updated' })
  } catch (error) {
    console.error('Failed to update progress:', error)
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 })
  }
}
