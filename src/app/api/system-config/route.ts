import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const config = await db.systemConfig.findFirst()
    return NextResponse.json(config || {
      medicalServiceFee: 5000.0,
      studioName: "Tiklay",
      studioPhone: "",
      studioEmail: "",
      studioAddress: "",
      studioDescription: ""
    })
  } catch (error) {
    console.error('Error fetching system config:', error)
    return NextResponse.json(
      { error: 'Error fetching system config' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { medicalServiceFee, studioName, studioPhone, studioEmail, studioAddress, studioDescription } = body

    const existingConfig = await db.systemConfig.findFirst()
    
    let config
    if (existingConfig) {
      config = await db.systemConfig.update({
        where: { id: existingConfig.id },
        data: {
          medicalServiceFee: parseFloat(medicalServiceFee),
          studioName,
          studioPhone,
          studioEmail,
          studioAddress,
          studioDescription
        }
      })
    } else {
      config = await db.systemConfig.create({
        data: {
          medicalServiceFee: parseFloat(medicalServiceFee),
          studioName,
          studioPhone,
          studioEmail,
          studioAddress,
          studioDescription
        }
      })
    }

    return NextResponse.json(config)
  } catch (error) {
    console.error('Error updating system config:', error)
    return NextResponse.json(
      { error: 'Error updating system config' },
      { status: 500 }
    )
  }
}