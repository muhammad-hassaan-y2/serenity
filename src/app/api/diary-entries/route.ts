import { NextResponse } from 'next/server'
import { format } from 'date-fns'
import prisma from '@/lib/prsima'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET() {
  try {
    // Get the current user's session
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get the user ID from the email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Fetch entries for the current user
    const entries = await prisma.diaryEntry.findMany({
      where: {
        userId: user.id
      },
      orderBy: { date: 'desc' }
    })
    
    // Convert to the format expected by the frontend
    const formattedEntries = entries.reduce((acc, entry) => ({
      ...acc,
      [format(entry.date, 'yyyy-MM-dd')]: entry.entry
    }), {})
    
    return NextResponse.json(formattedEntries)
  } catch (error) {
    console.error('Failed to fetch entries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch entries' }, 
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const { date, entry } = await request.json()
    
    // Check if an entry already exists for this date
    const existingEntry = await prisma.diaryEntry.findFirst({
      where: {
        userId: user.id,
        date: new Date(date)
      }
    })

    if (existingEntry) {
      // Update existing entry
      const updatedEntry = await prisma.diaryEntry.update({
        where: {
          id: existingEntry.id
        },
        data: {
          entry
        }
      })
      return NextResponse.json(updatedEntry)
    }

    // Create new entry
    const savedEntry = await prisma.diaryEntry.create({
      data: {
        date: new Date(date),
        entry,
        userId: user.id
      }
    })
    
    return NextResponse.json(savedEntry)
  } catch (error) {
    console.error('Failed to save entry:', error)
    return NextResponse.json(
      { error: 'Failed to save entry' }, 
      { status: 500 }
    )
  }
}