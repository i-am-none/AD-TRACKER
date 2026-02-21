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
    <div className="max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Log Sleep</h1>

      <div className="space-y-2">
        <label className="block text-sm">Bedtime</label>
        <input
          type="datetime-local"
          value={bedtime}
          onChange={(e) => setBedtime(e.target.value)}
          className="w-full bg-gray-800 border border-gray-600 p-2 rounded"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm">Wake Time</label>
        <input
          type="datetime-local"
          value={wakeTime}
          onChange={(e) => setWakeTime(e.target.value)}
          className="w-full bg-gray-800 border border-gray-600 p-2 rounded"
        />
      </div>

      <div className="space-y-2">
        <label>Sleep Quality: {sleepQuality}</label>
        <input
          type="range"
          min="0"
          max="5"
          value={sleepQuality}
          onChange={(e) => setSleepQuality(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label>Awakenings</label>
        <input
          type="number"
          value={awakenings}
          onChange={(e) => setAwakenings(Number(e.target.value))}
          className="w-full bg-gray-800 border border-gray-600 p-2 rounded"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-white text-black py-2 rounded font-semibold"
      >
        Log Sleep
      </button>

      {message && (
        <p className="text-sm text-green-400">{message}</p>
      )}

      {lastSleep && (
        <div className="border border-gray-700 p-4 rounded">
          <h3 className="font-semibold mb-2">Last Sleep Summary</h3>
          <p>Duration: {duration?.toFixed(2)} hours</p>
          <p>Quality: {lastSleep.sleepQuality}</p>
          <p>Awakenings: {lastSleep.awakenings}</p>
        </div>
      )}
    </div>
  )
}