import { NextResponse } from 'next/server'
import { updateSubtopicCompletion } from '@/lib/mockDatabase'

export async function PUT(req: Request) {
  const { topicId, subtopicId } = await req.json()

  if (!topicId || !subtopicId) {
    return NextResponse.json(
      { error: 'topicId and subtopicId are required' },
      { status: 400 }
    )
  }

  try {
    const updatedTopics = updateSubtopicCompletion(topicId, subtopicId)
    return NextResponse.json({ topics: updatedTopics })
  } catch (error) {
    console.error("Error updating progress:", error);  // Log the error for debugging
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 })
  }
}
