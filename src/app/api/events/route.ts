import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const events = await db.event.findMany({
      orderBy: { date: 'asc' }
    })
    return NextResponse.json(events)
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Error fetching events' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, date, startTime, endTime, location, maxAttendees, ticketPrice } = body

    const event = await db.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        startTime,
        endTime,
        location,
        maxAttendees: maxAttendees ? parseInt(maxAttendees) : null,
        ticketPrice: ticketPrice ? parseFloat(ticketPrice) : null
      }
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      { error: 'Error creating event' },
      { status: 500 }
    )
  }
}