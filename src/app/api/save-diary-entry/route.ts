import { NextResponse } from 'next/server'
import prisma from '@/lib/prsima'

export async function POST(request: Request) {
  const { date, entry } = await request.json()
  try {
    const savedEntry = await prisma.diaryEntry.create({
      data: {
        date: new Date(date),
        entry,
      },
    })
    return NextResponse.json(savedEntry)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to save entry' }, { status: 500 })
  }
}
