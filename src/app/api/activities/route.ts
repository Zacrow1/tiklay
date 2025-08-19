import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const activities = await db.activity.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(activities)
  } catch (error) {
    console.error('Error fetching activities:', error)
    return NextResponse.json(
      { error: 'Error fetching activities' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, duration, price, dayOfWeek, startTime, endTime } = body

    const activity = await db.activity.create({
      data: {
        name,
        description,
        duration: parseInt(duration),
        price: parseFloat(price),
        dayOfWeek: dayOfWeek ? parseInt(dayOfWeek) : null,
        startTime,
        endTime
      }
    })

    return NextResponse.json(activity, { status: 201 })
  } catch (error) {
    console.error('Error creating activity:', error)
    return NextResponse.json(
      { error: 'Error creating activity' },
      { status: 500 }
    )
  }
}