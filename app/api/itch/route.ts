import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { period, intensity } = body

    if (!period || intensity === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    if (intensity < 0 || intensity > 10) {
      return NextResponse.json(
        { error: "Intensity must be between 0 and 10" },
        { status: 400 }
      )
    }

    const log = await prisma.itchLog.create({
      data: {
        period,
        intensity,
      },
    })

    return NextResponse.json(log)
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const logs = await prisma.itchLog.findMany({
    where: {
      timestamp: {
        gte: today,
      },
    },
    orderBy: {
      timestamp: "asc",
    },
  })

  const average =
    logs.length > 0
      ? logs.reduce((sum, l) => sum + l.intensity, 0) / logs.length
      : 0

  const highCount = logs.filter(l => l.intensity >= 7).length
  const flare = highCount >= 2

  return NextResponse.json({
    logs,
    average,
    flare
  })
}