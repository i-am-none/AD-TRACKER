"use client"

import { useEffect, useState } from "react"

export default function Dashboard() {
  const [itchAvg, setItchAvg] = useState(0)
  const [flare, setFlare] = useState(false)
  const [sleepDuration, setSleepDuration] = useState<number | null>(null)
  const [sleepQuality, setSleepQuality] = useState<number | null>(null)

  const fetchItch = async () => {
    const res = await fetch("/api/itch")
    const data = await res.json()

    setItchAvg(data.average || 0)
    setFlare(data.flare || false)
  }

  const fetchSleep = async () => {
    const res = await fetch("/api/sleep")
    const data = await res.json()

    if (data.log) {
      setSleepDuration(data.durationHours)
      setSleepQuality(data.log.sleepQuality)
    }
  }

  useEffect(() => {
    fetchItch()
    fetchSleep()
  }, [])

  const interpretation = () => {
    if (flare && sleepDuration && sleepDuration < 6) {
      return "⚠ Poor sleep may be contributing to flare."
    }

    if (!flare && sleepDuration && sleepDuration >= 7) {
      return "✓ Stable day. Sleep likely supporting recovery."
    }

    return "Monitor trends over multiple days."
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Daily Dashboard</h1>

      <div style={{ marginTop: 20 }}>
        <h2>Itch</h2>
        <p>Average Today: {itchAvg.toFixed(2)}</p>
        <p style={{ color: flare ? "red" : "green" }}>
          {flare ? "FLARE DETECTED" : "No flare"}
        </p>
      </div>

      <div style={{ marginTop: 20 }}>
        <h2>Sleep</h2>
        {sleepDuration ? (
          <>
            <p>Duration: {sleepDuration.toFixed(2)} hours</p>
            <p>Quality: {sleepQuality}</p>
          </>
        ) : (
          <p>No sleep logged</p>
        )}
      </div>

      <div style={{ marginTop: 30 }}>
        <h2>System Interpretation</h2>
        <p>{interpretation()}</p>
      </div>
    </div>
  )
}