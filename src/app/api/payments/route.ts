import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const payments = await db.payment.findMany({
      include: {
        student: {
          include: {
            user: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(payments)
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json(
      { error: 'Error fetching payments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { studentId, amount, method, description, dueDate } = body

    const payment = await db.payment.create({
      data: {
        studentId,
        amount: parseFloat(amount),
        method,
        description,
        dueDate: dueDate ? new Date(dueDate) : null
      },
      include: {
        student: {
          include: {
            user: true
          }
        }
      }
    })

    return NextResponse.json(payment, { status: 201 })
  } catch (error) {
    console.error('Error creating payment:', error)
    return NextResponse.json(
      { error: 'Error creating payment' },
      { status: 500 }
    )
  }
}