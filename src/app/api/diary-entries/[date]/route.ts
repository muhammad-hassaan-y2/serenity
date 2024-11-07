import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prsima'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function PUT(
  request: NextRequest,
  { params }: { params: { date: string } }
) {
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

    const { entry } = await request.json()
    const { date } = params

    const existingEntry = await prisma.diaryEntry.findFirst({
      where: {
        userId: user.id,
        date: new Date(date)
      }
    })

    if (!existingEntry) {
      return NextResponse.json(
        { error: 'Entry not found' },
        { status: 404 }
      )
    }

    const updatedEntry = await prisma.diaryEntry.update({
      where: {
        id: existingEntry.id
      },
      data: {
        entry
      }
    })

    return NextResponse.json(updatedEntry)
  } catch (error) {
    console.error('Failed to update entry:', error)
    return NextResponse.json(
      { error: 'Failed to update entry' }, 
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { date: string } }
) {
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

    const { date } = params

    const existingEntry = await prisma.diaryEntry.findFirst({
      where: {
        userId: user.id,
        date: new Date(date)
      }
    })

    if (!existingEntry) {
      return NextResponse.json(
        { error: 'Entry not found' },
        { status: 404 }
      )
    }

    await prisma.diaryEntry.delete({
      where: {
        id: existingEntry.id
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete entry:', error)
    return NextResponse.json(
      { error: 'Failed to delete entry' }, 
      { status: 500 }
    )
  }
}