import { NextResponse } from 'next/server'
import prisma from '@/lib/prsima'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const userId = url.searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }

  try {
    const studyPath = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        topics: {
          include: { subtopics: true },
        },
      },
    })
    return NextResponse.json(studyPath)
  } catch (error) {
    console.error('Failed to fetch study path:', error)
    return NextResponse.json({ error: 'Failed to fetch study path' }, { status: 500 })
  }
}
