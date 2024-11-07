import { NextResponse } from 'next/server'
import prisma from '@/lib/prsima'

export async function PUT(request: Request) {
  const { date, entry } = await request.json()
  try {
    const updatedEntry = await prisma.diaryEntry.update({
      where: { date: new Date(date) },
      data: { entry },
    })
    return NextResponse.json(updatedEntry)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to update entry' }, { status: 500 })
  }
}
