import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { date, bedtime, wakeTime, sleepQuality, awakenings } = body

    if (!date || !bedtime || !wakeTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const bedtimeDate = new Date(bedtime)
    const wakeDate = new Date(wakeTime)

    if (isNaN(bedtimeDate.getTime()) || isNaN(wakeDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      )
    }

    const durationMs = wakeDate.getTime() - bedtimeDate.getTime()
    const durationHours = durationMs / (1000 * 60 * 60)

    if (durationHours <= 0) {
      return NextResponse.json(
        { error: "Wake time must be after bedtime" },
        { status: 400 }
      )
    }

    const log = await prisma.sleepLog.create({
      data: {
        date: new Date(date),
        bedtime: bedtimeDate,
        wakeTime: wakeDate,
        sleepQuality,
        awakenings,
      },
    })

    return NextResponse.json(log)

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  const logs = await prisma.sleepLog.findMany({
    orderBy: {
      date: "desc",
    },
    take: 1,
  })

  if (logs.length === 0) {
    return NextResponse.json({ log: null })
  }

  const log = logs[0]

  const durationMs =
    new Date(log.wakeTime).getTime() -
    new Date(log.bedtime).getTime()

  const durationHours = durationMs / (1000 * 60 * 60)

  return NextResponse.json({
    log,
    durationHours,
  })
}