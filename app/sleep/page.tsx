"use client"

import { useState, useEffect } from "react"

export default function SleepPage() {
  const [bedtime, setBedtime] = useState("")
  const [wakeTime, setWakeTime] = useState("")
  const [sleepQuality, setSleepQuality] = useState(3)
  const [awakenings, setAwakenings] = useState(0)
  const [message, setMessage] = useState("")

  const [lastSleep, setLastSleep] = useState<any>(null)
  const [duration, setDuration] = useState<number | null>(null)

  const fetchLatest = async () => {
    const res = await fetch("/api/sleep")
    const data = await res.json()

    if (data.log) {
      setLastSleep(data.log)
      setDuration(data.durationHours)
    }
  }

  useEffect(() => {
    fetchLatest()
  }, [])

  const handleSubmit = async () => {
    if (!bedtime || !wakeTime) {
      setMessage("Please fill bedtime and wake time")
      return
    }

    const res = await fetch("/api/sleep", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: new Date().toISOString(),
        bedtime: new Date(bedtime).toISOString(),
        wakeTime: new Date(wakeTime).toISOString(),
        sleepQuality,
        awakenings,
      }),
    })

    const data = await res.json()

    if (res.ok) {
      setMessage("Sleep logged ✅")
      fetchLatest()
    } else {
      setMessage(data.error || "Error")
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Log Sleep</h1>

      <div>
        <label>Bedtime</label>
        <input
          type="datetime-local"
          value={bedtime}
          onChange={(e) => setBedtime(e.target.value)}
          style={{ border: "1px solid black", padding: 5, display: "block" }}
        />
      </div>

      <div>
        <label>Wake Time</label>
        <input
          type="datetime-local"
          value={wakeTime}
          onChange={(e) => setWakeTime(e.target.value)}
          style={{ border: "1px solid black", padding: 5, display: "block" }}
        />
      </div>

      <div>
        <label>Sleep Quality: {sleepQuality}</label>
        <input
          type="range"
          min="0"
          max="5"
          value={sleepQuality}
          onChange={(e) => setSleepQuality(Number(e.target.value))}
        />
      </div>

      <div>
        <label>Awakenings</label>
        <input
          type="number"
          value={awakenings}
          onChange={(e) => setAwakenings(Number(e.target.value))}
          style={{ border: "1px solid black", padding: 5 }}
        />
      </div>

      <button onClick={handleSubmit}>
        Log Sleep
      </button>

      {message && <p>{message}</p>}

      {lastSleep && (
        <div style={{ marginTop: 20 }}>
          <h3>Last Sleep Summary</h3>
          <p>Duration: {duration?.toFixed(2)} hours</p>
          <p>Quality: {lastSleep.sleepQuality}</p>
          <p>Awakenings: {lastSleep.awakenings}</p>
        </div>
      )}
    </div>
  )
}