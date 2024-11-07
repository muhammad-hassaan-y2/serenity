import { NextResponse } from 'next/server'
import prisma from '@/lib/prsima'

export async function DELETE(request: Request) {
  const { date } = await request.json()
  try {
    await prisma.diaryEntry.delete({
      where: { date: new Date(date) },
    })
    return NextResponse.json({ message: 'Entry deleted' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 })
  }
}
