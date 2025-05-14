"use client"

import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Stats {
  totalPredictions: number
  correctPredictions: number
  accuracy: number
}

const fetcher = (url: string) =>
  fetch(url, { credentials: 'include' })
    .then(res => {
      if (!res.ok) throw new Error('Network response was not ok')
      return res.json()
    })

export default function UserStats() {
  const { data, error } = useSWR<Stats>('/api/profile/stats', fetcher)

  if (error) {
    return <div className="text-red-600">Ошибка загрузки статистики</div>
  }
  if (!data) {
    return <div>Загрузка статистики...</div>
  }

  const { totalPredictions, correctPredictions, accuracy } = data

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Predictions</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground"
          >
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
            <line x1="4" x2="4" y1="22" y2="15" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPredictions}</div>
          <p className="text-xs text-muted-foreground">Predictions made across all events</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Correct Predictions</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{correctPredictions}</div>
          <p className="text-xs text-muted-foreground">Predictions that were accurate</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Accuracy Rate</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground"
          >
            <path d="M12 20v-6M6 20V10M18 20V4" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{accuracy.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">Percentage of correct predictions</p>
        </CardContent>
      </Card>
    </div>
  )
}
