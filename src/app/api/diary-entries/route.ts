import { NextResponse } from 'next/server'
import prisma from '@/lib/prsima'

export async function GET() {
  try {
    const entries = await prisma.diaryEntry.findMany({
      orderBy: { date: 'desc' },
    })
    return NextResponse.json(entries)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 })
  }
}
