// src/app/api/study-path/route.ts
import { NextResponse } from 'next/server'
import { getStudyPath } from '@/lib/mockDatabase'
import { StudyPathResponse } from '@/lib/types'

export async function GET() {
  const topics = getStudyPath()
  const currentTopic = topics.find((topic) => topic.progress < 100) || null

  const response: StudyPathResponse = {
    topics,
    currentTopic,
  }

  return NextResponse.json(response)
}
