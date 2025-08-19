import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const teachers = await db.teacher.findMany({
      include: {
        user: true
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(teachers)
  } catch (error) {
    console.error('Error fetching teachers:', error)
    return NextResponse.json(
      { error: 'Error fetching teachers' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { teacherId, spacePercentage } = body

    const teacher = await db.teacher.update({
      where: { id: teacherId },
      data: {
        spacePercentage: parseFloat(spacePercentage)
      },
      include: {
        user: true
      }
    })

    return NextResponse.json(teacher)
  } catch (error) {
    console.error('Error updating teacher:', error)
    return NextResponse.json(
      { error: 'Error updating teacher' },
      { status: 500 }
    )
  }
}