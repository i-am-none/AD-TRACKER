"use client"

import { useState, useEffect } from "react"

const periods = ["MORNING", "AFTERNOON", "NIGHT", "FLARE"]

export default function ItchPage() {
  const [period, setPeriod] = useState("MORNING")
  const [intensity, setIntensity] = useState(5)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [logs, setLogs] = useState<any[]>([])
  const [average, setAverage] = useState(0)
  const [flare, setFlare] = useState(false)

  const fetchData = async () => {
    const res = await fetch("/api/itch")
    const data = await res.json()
    setLogs(data.logs)
    setAverage(data.average)
    setFlare(data.flare)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = async () => {
    setLoading(true)
    setMessage("")

    const res = await fetch("/api/itch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        period,
        intensity: Number(intensity),
      }),
    })

    if (res.ok) {
      setMessage("Logged successfully ✅")
      fetchData()
    } else {
      const data = await res.json()
      setMessage(data.error || "Something went wrong")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-8">Log Itch</h1>

      <div className="mb-6">
        <label className="block mb-2">Period</label>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="text-black p-2 rounded"
        >
          {periods.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="block mb-2">
          Intensity: {intensity}
        </label>
        <input
          type="range"
          min="0"
          max="10"
          value={intensity}
          onChange={(e) => setIntensity(Number(e.target.value))}
          className="w-64"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-white text-black px-6 py-2 rounded font-semibold"
      >
        {loading ? "Logging..." : "Log Itch"}
      </button>

      {message && <p className="mt-4">{message}</p>}

      <hr className="my-10 border-gray-700" />

      <h2 className="text-xl font-bold mb-4">Today's Summary</h2>

      <p>Average Itch: {average.toFixed(2)}</p>
      <p className={flare ? "text-red-500 font-bold" : ""}>
        Flare Status: {flare ? "⚠ FLARE DETECTED" : "No flare"}
      </p>

      <h3 className="mt-6 font-semibold">Logs:</h3>
      <ul className="mt-2 space-y-2">
        {logs.map((log) => (
          <li key={log.id} className="border p-2 rounded">
            {log.period} — {log.intensity}
          </li>
        ))}
      </ul>
    </div>
  )
}