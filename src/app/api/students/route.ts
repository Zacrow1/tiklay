import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const students = await db.student.findMany({
      include: {
        user: true
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(students)
  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json(
      { error: 'Error fetching students' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, firstName, lastName, phone, address, emergencyContact } = body

    // First create the user
    const user = await db.user.create({
      data: {
        email,
        name: `${firstName} ${lastName}`,
        role: 'STUDENT'
      }
    })

    // Then create the student profile
    const student = await db.student.create({
      data: {
        userId: user.id,
        firstName,
        lastName,
        phone,
        address,
        emergencyContact
      },
      include: {
        user: true
      }
    })

    return NextResponse.json(student, { status: 201 })
  } catch (error) {
    console.error('Error creating student:', error)
    return NextResponse.json(
      { error: 'Error creating student' },
      { status: 500 }
    )
  }
}