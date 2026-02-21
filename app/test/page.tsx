"use client"

import { useState } from "react"

export default function Test() {
  const [value, setValue] = useState("")

  return (
    <div style={{ padding: 50 }}>
      <h1>TEST PAGE</h1>
      <input
        style={{ border: "2px solid red", padding: 10 }}
        type="text"
        value={value}
        onChange={(e) => {
          console.log("typing", e.target.value)
          setValue(e.target.value)
        }}
      />
      <p>Value: {value}</p>
    </div>
  )
}