"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import type { PredictionWithEvent } from "@/lib/data/predictions"

interface ClientProfileTabsProps {
  predictions: PredictionWithEvent[]
}

export default function ClientProfileTabs({ predictions }: ClientProfileTabsProps) {
  const [activeTab, setActiveTab] = useState("history")

  // Sort predictions by date (newest first)
  const sortedPredictions = [...predictions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  return (
    <Tabs defaultValue="history" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="history">Prediction History</TabsTrigger>
        <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
      </TabsList>

      <TabsContent value="history" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Your Prediction History</CardTitle>
            <CardDescription>View all your past predictions</CardDescription>
          </CardHeader>
          <CardContent>
            {sortedPredictions.length > 0 ? (
              <div className="space-y-4">
                {sortedPredictions.map((prediction) => (
                  <div key={prediction.id} className="flex flex-col p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{prediction.event.title}</h3>
                        <p className="text-sm text-muted-foreground">{formatDate(prediction.event.date)}</p>
                      </div>
                      <div className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                        {prediction.outcome === "win"
                          ? "Home Win"
                          : prediction.outcome === "draw"
                            ? "Draw"
                            : "Away Win"}
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <div className="text-sm">
                        Predicted Score:{" "}
                        <span className="font-medium">
                          {prediction.homeScore} - {prediction.awayScore}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Made on {new Date(prediction.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-6 text-muted-foreground">You haven't made any predictions yet.</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="upcoming" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Events you've made predictions for that haven't happened yet</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filter for upcoming events */}
            {sortedPredictions.filter((p) => new Date(p.event.date) > new Date()).length > 0 ? (
              <div className="space-y-4">
                {sortedPredictions
                  .filter((p) => new Date(p.event.date) > new Date())
                  .map((prediction) => (
                    <div key={prediction.id} className="flex flex-col p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{prediction.event.title}</h3>
                          <p className="text-sm text-muted-foreground">{formatDate(prediction.event.date)}</p>
                        </div>
                        <div className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                          {prediction.outcome === "win"
                            ? "Home Win"
                            : prediction.outcome === "draw"
                              ? "Draw"
                              : "Away Win"}
                        </div>
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <div className="text-sm">
                          Predicted Score:{" "}
                          <span className="font-medium">
                            {prediction.homeScore} - {prediction.awayScore}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-center py-6 text-muted-foreground">
                You don't have any predictions for upcoming events.
              </p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
