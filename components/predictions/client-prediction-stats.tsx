"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

interface PredictionStats {
  winCount: number
  drawCount: number
  lossCount: number
  totalPredictions: number
}

interface ClientPredictionStatsProps {
  eventStats: PredictionStats
}

export default function ClientPredictionStats({ eventStats }: ClientPredictionStatsProps) {
  const { winCount, drawCount, lossCount, totalPredictions } = eventStats

  const data = [
    { name: "Home Win", value: winCount },
    { name: "Draw", value: drawCount },
    { name: "Away Win", value: lossCount },
  ]

  const filteredData = data.filter((entry) => entry.value > 0)
  const COLORS = ["#10b981", "#6366f1", "#ef4444"]

  if (totalPredictions === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Community Predictions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-6 text-muted-foreground">No predictions have been made for this event yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Community Predictions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={filteredData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {filteredData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} predictions`, ""]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 text-center">
          <div className="p-4 rounded-lg bg-muted">
            <div className="text-2xl font-bold">{winCount}</div>
            <div className="text-sm text-muted-foreground">Home Win</div>
          </div>
          <div className="p-4 rounded-lg bg-muted">
            <div className="text-2xl font-bold">{drawCount}</div>
            <div className="text-sm text-muted-foreground">Draw</div>
          </div>
          <div className="p-4 rounded-lg bg-muted">
            <div className="text-2xl font-bold">{lossCount}</div>
            <div className="text-sm text-muted-foreground">Away Win</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
